import axios from "axios";
import * as cheerio from "cheerio";
import {
  IPLData,
  LiveMatch,
  Match,
  MatchStatus,
  PointsTableEntry,
  Team,
} from "@/types/ipl";
import { dummyData } from "./dummy-data";

// Base URLs
const IPL_BASE_URL = "https://www.iplt20.com";
const POINTS_TABLE_URL = `${IPL_BASE_URL}/points-table/men/2025`;
const MATCHES_URL = `${IPL_BASE_URL}/matches`;
const RESULTS_URL = `${IPL_BASE_URL}/matches/results`;

// Team mapping for consistent IDs
const TEAM_ID_MAP: Record<string, string> = {
  "Chennai Super Kings": "csk",
  "Mumbai Indians": "mi",
  "Royal Challengers Bengaluru": "rcb",
  "Sunrisers Hyderabad": "srh",
  "Delhi Capitals": "dc",
  "Kolkata Knight Riders": "kkr",
  "Rajasthan Royals": "rr",
  "Punjab Kings": "pbks",
  "Gujarat Titans": "gt",
  "Lucknow Super Giants": "lsg",
};

// Get team ID from name
const getTeamId = (teamName: string): string => {
  // Try exact match first
  if (TEAM_ID_MAP[teamName]) {
    return TEAM_ID_MAP[teamName];
  }

  // Try to find a partial match
  const teamKeys = Object.keys(TEAM_ID_MAP);
  const matchedTeam = teamKeys.find(
    (key) => teamName.includes(key) || key.includes(teamName)
  );

  if (matchedTeam) {
    return TEAM_ID_MAP[matchedTeam];
  }

  // Fallback: create a reasonable ID from the name
  return teamName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

// Get team object from name
const getTeamFromName = (teamName: string): Team => {
  const id = getTeamId(teamName);

  // Look up in our dummy data first for logos and colors
  const existingTeam = dummyData.teams.find((team) => team.id === id);

  if (existingTeam) {
    return existingTeam;
  }

  // Create a new team entry
  return {
    id,
    name: teamName,
    shortName: teamName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase(),
    logo: `/teams/${id}.png`,
    color: "#888888",
  };
};

// Parse a date string to ISO format
const parseDate = (dateStr: string): string => {
  try {
    // Example: "Saturday, April 9, 2025"
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  } catch (error) {
    // Fallback to current date if parsing fails
    return new Date().toISOString().split("T")[0];
  }
};

// Parse a time string (e.g., "7:30 PM IST" to "19:30")
const parseTime = (timeStr: string): string => {
  try {
    // Extract hours and minutes
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return "00:00";

    let hours = parseInt(match[1]);
    const minutes = match[2];
    const period = match[3].toUpperCase();

    // Convert to 24-hour format
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  } catch (error) {
    return "00:00";
  }
};

// Extract numeric value from string
const extractNumber = (str: string): number => {
  const match = str.match(/[-+]?\d*\.?\d+/);
  return match ? parseFloat(match[0]) : 0;
};

/**
 * Scrape the points table
 */
async function scrapePointsTable(): Promise<PointsTableEntry[]> {
  try {
    const { data } = await axios.get(POINTS_TABLE_URL);
    const $ = cheerio.load(data);
    const pointsTable: PointsTableEntry[] = [];

    // Select the points table
    $(".standings-table tbody tr").each((i, el) => {
      const teamName = $(el).find("td:nth-child(2)").text().trim();
      const team = getTeamFromName(teamName);

      const matches =
        parseInt($(el).find("td:nth-child(3)").text().trim()) || 0;
      const won = parseInt($(el).find("td:nth-child(4)").text().trim()) || 0;
      const lost = parseInt($(el).find("td:nth-child(5)").text().trim()) || 0;
      const tied = parseInt($(el).find("td:nth-child(6)").text().trim()) || 0;
      const points = parseInt($(el).find("td:nth-child(7)").text().trim()) || 0;
      const nrrText = $(el).find("td:nth-child(8)").text().trim();
      const netRunRate = parseFloat(nrrText) || 0;

      pointsTable.push({
        team,
        matches,
        won,
        lost,
        tied,
        points,
        netRunRate,
      });
    });

    return pointsTable.length > 0 ? pointsTable : dummyData.pointsTable;
  } catch (error) {
    console.error("Error scraping points table:", error);
    return dummyData.pointsTable;
  }
}

/**
 * Scrape upcoming matches
 */
async function scrapeUpcomingMatches(): Promise<Match[]> {
  try {
    const { data } = await axios.get(MATCHES_URL);
    const $ = cheerio.load(data);
    const upcomingMatches: Match[] = [];

    // Process each match card
    $(".match-card").each((i, el) => {
      try {
        const dateText = $(el).find(".match-card__date").text().trim();
        const timeText = $(el).find(".match-card__time").text().trim();
        const venueText = $(el).find(".match-card__venue").text().trim();

        const team1Name = $(el)
          .find(".match-card__team-1 .match-card__team-name")
          .text()
          .trim();
        const team2Name = $(el)
          .find(".match-card__team-2 .match-card__team-name")
          .text()
          .trim();

        if (!team1Name || !team2Name) return;

        const team1 = getTeamFromName(team1Name);
        const team2 = getTeamFromName(team2Name);

        upcomingMatches.push({
          id: `match-${i}`,
          team1,
          team2,
          date: parseDate(dateText),
          time: parseTime(timeText),
          venue: venueText,
          status: MatchStatus.UPCOMING,
        });
      } catch (error) {
        console.error("Error processing match card:", error);
      }
    });

    return upcomingMatches.length > 0
      ? upcomingMatches
      : dummyData.upcomingMatches;
  } catch (error) {
    console.error("Error scraping upcoming matches:", error);
    return dummyData.upcomingMatches;
  }
}

/**
 * Scrape completed matches
 */
async function scrapeCompletedMatches(): Promise<Match[]> {
  try {
    const { data } = await axios.get(RESULTS_URL);
    const $ = cheerio.load(data);
    const completedMatches: Match[] = [];

    // Process each match card
    $(".match-card--complete").each((i, el) => {
      try {
        const dateText = $(el).find(".match-card__date").text().trim();
        const timeText = $(el).find(".match-card__time").text().trim();
        const venueText = $(el).find(".match-card__venue").text().trim();

        const team1Name = $(el)
          .find(".match-card__team-1 .match-card__team-name")
          .text()
          .trim();
        const team2Name = $(el)
          .find(".match-card__team-2 .match-card__team-name")
          .text()
          .trim();

        if (!team1Name || !team2Name) return;

        const team1 = getTeamFromName(team1Name);
        const team2 = getTeamFromName(team2Name);

        const resultText = $(el).find(".match-card__result").text().trim();

        completedMatches.push({
          id: `completed-${i}`,
          team1,
          team2,
          date: parseDate(dateText),
          time: parseTime(timeText),
          venue: venueText,
          status: MatchStatus.COMPLETED,
          result: resultText,
        });
      } catch (error) {
        console.error("Error processing completed match card:", error);
      }
    });

    return completedMatches;
  } catch (error) {
    console.error("Error scraping completed matches:", error);
    return [];
  }
}

/**
 * Scrape live match
 */
async function scrapeLiveMatch(): Promise<LiveMatch | undefined> {
  try {
    const { data } = await axios.get(IPL_BASE_URL);
    const $ = cheerio.load(data);

    // Find the live match element
    const liveMatchEl = $(".match-card--live").first();

    if (liveMatchEl.length === 0) {
      return undefined;
    }

    const dateText = liveMatchEl.find(".match-card__date").text().trim();
    const timeText = liveMatchEl.find(".match-card__time").text().trim();
    const venueText = liveMatchEl.find(".match-card__venue").text().trim();

    const team1Name = liveMatchEl
      .find(".match-card__team-1 .match-card__team-name")
      .text()
      .trim();
    const team2Name = liveMatchEl
      .find(".match-card__team-2 .match-card__team-name")
      .text()
      .trim();

    if (!team1Name || !team2Name) {
      return undefined;
    }

    const team1 = getTeamFromName(team1Name);
    const team2 = getTeamFromName(team2Name);

    // Extract scores
    const team1ScoreText = liveMatchEl
      .find(".match-card__team-1 .match-card__score")
      .text()
      .trim();
    const team2ScoreText = liveMatchEl
      .find(".match-card__team-2 .match-card__score")
      .text()
      .trim();

    // Parse scores (e.g., "156/4 (16.2 ov)")
    const team1ScoreMatch = team1ScoreText.match(
      /(\d+)\/(\d+)\s*\((\d+\.\d+|\d+)\s*ov\)/
    );
    const team2ScoreMatch = team2ScoreText.match(
      /(\d+)\/(\d+)\s*\((\d+\.\d+|\d+)\s*ov\)/
    );

    const liveMatch: LiveMatch = {
      id: "live-match",
      team1,
      team2,
      date: parseDate(dateText),
      time: parseTime(timeText),
      venue: venueText,
      status: MatchStatus.LIVE,
    };

    if (team1ScoreMatch) {
      liveMatch.team1Score = {
        runs: parseInt(team1ScoreMatch[1]) || 0,
        wickets: parseInt(team1ScoreMatch[2]) || 0,
        overs: parseFloat(team1ScoreMatch[3]) || 0,
      };
    }

    if (team2ScoreMatch) {
      liveMatch.team2Score = {
        runs: parseInt(team2ScoreMatch[1]) || 0,
        wickets: parseInt(team2ScoreMatch[2]) || 0,
        overs: parseFloat(team2ScoreMatch[3]) || 0,
      };
    }

    // Calculate run rates
    if (liveMatch.team1Score) {
      liveMatch.currentRunRate =
        liveMatch.team1Score.overs > 0
          ? liveMatch.team1Score.runs / liveMatch.team1Score.overs
          : 0;
    }

    if (
      liveMatch.team1Score &&
      liveMatch.team2Score &&
      liveMatch.team1Score.overs >= 20
    ) {
      const runsNeeded =
        liveMatch.team1Score.runs + 1 - liveMatch.team2Score.runs;
      const oversLeft = 20 - liveMatch.team2Score.overs;

      if (runsNeeded > 0 && oversLeft > 0) {
        liveMatch.requiredRunRate = runsNeeded / oversLeft;
      }
    }

    // Use more detailed data from dummy data for elements we can't easily scrape
    const dummyLiveMatch = dummyData.liveMatch;

    if (dummyLiveMatch) {
      liveMatch.currentBatsmen = dummyLiveMatch.currentBatsmen;
      liveMatch.currentBowler = dummyLiveMatch.currentBowler;
      liveMatch.recentOvers = dummyLiveMatch.recentOvers;
      liveMatch.commentary = dummyLiveMatch.commentary;
      liveMatch.lastWicket = dummyLiveMatch.lastWicket;
    }

    return liveMatch;
  } catch (error) {
    console.error("Error scraping live match:", error);
    return dummyData.liveMatch;
  }
}

/**
 * Main function to scrape IPL data
 */
export async function scrapeIPLDataWithCheerio(): Promise<IPLData> {
  try {
    // Perform all scraping tasks in parallel
    const [pointsTable, upcomingMatches, completedMatches, liveMatch] =
      await Promise.all([
        scrapePointsTable(),
        scrapeUpcomingMatches(),
        scrapeCompletedMatches(),
        scrapeLiveMatch(),
      ]);

    // Combine all matches for the complete schedule
    const completeSchedule = [
      ...(liveMatch ? [{ ...liveMatch }] : []),
      ...upcomingMatches,
      ...completedMatches,
    ];

    // Extract all unique teams
    const teamMap = new Map<string, Team>();

    // Add teams from points table
    pointsTable.forEach((entry) => {
      teamMap.set(entry.team.id, entry.team);
    });

    // Add teams from schedule
    completeSchedule.forEach((match) => {
      teamMap.set(match.team1.id, match.team1);
      teamMap.set(match.team2.id, match.team2);
    });

    const teams = Array.from(teamMap.values());

    // Sort upcoming matches by date
    const sortedUpcomingMatches = upcomingMatches
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    return {
      teams,
      upcomingMatches: sortedUpcomingMatches,
      liveMatch,
      pointsTable,
      completeSchedule,
    };
  } catch (error) {
    console.error("Error scraping IPL data with Cheerio:", error);
    throw error;
  }
}
