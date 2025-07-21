import axios from "axios";
import * as cheerio from "cheerio";
import {
  Match,
  MatchStatus,
  PointsTableEntry,
  Team,
  LiveMatch,
  Score,
  Batsman,
  Bowler,
  Over,
  CommentaryItem,
  IPLData,
} from "@/types/ipl";
import { dummyData } from "./dummy-data";

const BASE_URL = "https://www.iplt20.com";
const POINTS_TABLE_URL = `${BASE_URL}/points-table`;
const FIXTURES_URL = `${BASE_URL}/matches`;
const LIVE_MATCH_URL = `${BASE_URL}/`;

const TEAM_ID_MAP: Record<string, string> = {
  "Chennai Super Kings": "csk",
  "Mumbai Indians": "mi",
  "Royal Challengers Bangalore": "rcb",
  "Sunrisers Hyderabad": "srh",
  "Delhi Capitals": "dc",
  "Kolkata Knight Riders": "kkr",
  "Rajasthan Royals": "rr",
  "Punjab Kings": "pbks",
  "Gujarat Titans": "gt",
  "Lucknow Super Giants": "lsg",
};

const getTeamId = (teamName: string): string => {
  // Try exact match first
  if (TEAM_ID_MAP[teamName]) {
    return TEAM_ID_MAP[teamName];
  }

  // Try to find a partial match
  const teamKeys = Object.keys(TEAM_ID_MAP);
  const matchedTeam = teamKeys.find((key) => teamName.includes(key));

  if (matchedTeam) {
    return TEAM_ID_MAP[matchedTeam];
  }

  // Fallback: create a reasonable ID from the name
  return teamName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

/**
 * Get team object from the team name
 */
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

/**
 * Parse numeric string to number, handling edge cases
 */
const parseNumeric = (value: string | undefined): number => {
  if (!value) return 0;

  const cleaned = value.replace(/[^\d.-]/g, "");
  return cleaned ? parseFloat(cleaned) : 0;
};

/**
 * Parse over notation (e.g., "12.4") to decimal
 */
const parseOvers = (oversText: string): number => {
  const parts = oversText.split(".");
  if (parts.length !== 2) return parseFloat(oversText) || 0;

  const wholeOvers = parseInt(parts[0]) || 0;
  const balls = parseInt(parts[1]) || 0;

  return wholeOvers + balls / 6;
};

/**
 * Scrape points table data
 */
export async function scrapePointsTable(): Promise<PointsTableEntry[]> {
  try {
    const { data } = await axios.get(POINTS_TABLE_URL);
    const $ = cheerio.load(data);
    const pointsTable: PointsTableEntry[] = [];

    // Select the points table rows
    $(".table-responsive table tbody tr").each((i, el) => {
      const cells = $(el).find("td");

      // Extract team name from the team column
      const teamName = $(cells).eq(1).text().trim();
      const team = getTeamFromName(teamName);

      // Extract other columns data
      const matches = parseNumeric($(cells).eq(2).text());
      const won = parseNumeric($(cells).eq(3).text());
      const lost = parseNumeric($(cells).eq(4).text());
      const tied = parseNumeric($(cells).eq(5).text());
      const points = parseNumeric($(cells).eq(7).text());
      const netRunRate = parseNumeric($(cells).eq(8).text());

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

    return pointsTable;
  } catch (error) {
    console.error("Error scraping points table:", error);
    // Fallback to dummy data
    return dummyData.pointsTable;
  }
}

/**
 * Scrape fixtures/schedule data
 */
export async function scrapeFixtures(): Promise<Match[]> {
  try {
    const { data } = await axios.get(FIXTURES_URL);
    const $ = cheerio.load(data);
    const fixtures: Match[] = [];

    // Select fixture containers
    $(".match-block").each((i, el) => {
      const dateText = $(el).find(".match-date").text().trim();
      // Format: "Saturday 20 April, 2024"
      const dateParts = dateText.split(" ");
      if (dateParts.length < 3) return;

      const day = dateParts[1];
      const month = dateParts[2].replace(",", "");
      const year = dateParts[3];
      const date = `${year}-${getMonthNumber(month)}-${day.padStart(2, "0")}`;

      // Process each match in the block
      $(el)
        .find(".match-list-item")
        .each((j, match) => {
          const team1Name = $(match).find(".team-name").eq(0).text().trim();
          const team2Name = $(match).find(".team-name").eq(1).text().trim();

          const team1 = getTeamFromName(team1Name);
          const team2 = getTeamFromName(team2Name);

          const timeText = $(match).find(".match-time").text().trim();
          const venue = $(match).find(".match-venue").text().trim();

          // Determine match status
          let status = MatchStatus.UPCOMING;
          let result;

          if ($(match).hasClass("match-live")) {
            status = MatchStatus.LIVE;
          } else if ($(match).hasClass("match-complete")) {
            status = MatchStatus.COMPLETED;
            result = $(match).find(".match-result").text().trim();
          }

          fixtures.push({
            id: `match-${i}-${j}`,
            team1,
            team2,
            date,
            time: timeText.replace(/[^0-9:]/g, ""), // Extract time portion
            venue,
            status,
            result,
          });
        });
    });

    return fixtures;
  } catch (error) {
    console.error("Error scraping fixtures:", error);
    // Fallback to dummy data
    return dummyData.completeSchedule;
  }
}

/**
 * Scrape live match data
 */
export async function scrapeLiveMatch(): Promise<LiveMatch | null> {
  try {
    const { data } = await axios.get(LIVE_MATCH_URL);
    const $ = cheerio.load(data);

    // Check if there's a live match
    const liveMatchSelector = $(".match-block.match-live");
    if (liveMatchSelector.length === 0) {
      return null; // No live match
    }

    // Extract match details
    const team1Name = $(liveMatchSelector)
      .find(".team-name")
      .eq(0)
      .text()
      .trim();
    const team2Name = $(liveMatchSelector)
      .find(".team-name")
      .eq(1)
      .text()
      .trim();

    const team1 = getTeamFromName(team1Name);
    const team2 = getTeamFromName(team2Name);

    const venue = $(liveMatchSelector).find(".match-venue").text().trim();
    const timeText = $(liveMatchSelector).find(".match-time").text().trim();

    // Extract date
    const dateText = $(liveMatchSelector)
      .closest(".match-block")
      .find(".match-date")
      .text()
      .trim();
    const dateParts = dateText.split(" ");
    const day = dateParts[1];
    const month = dateParts[2].replace(",", "");
    const year = dateParts[3];
    const date = `${year}-${getMonthNumber(month)}-${day.padStart(2, "0")}`;

    // Extract scores if available
    let team1Score: Score | undefined;
    let team2Score: Score | undefined;

    const team1ScoreText = $(liveMatchSelector)
      .find(".team-score")
      .eq(0)
      .text()
      .trim();
    const team2ScoreText = $(liveMatchSelector)
      .find(".team-score")
      .eq(1)
      .text()
      .trim();

    if (team1ScoreText) {
      const scoreParts = team1ScoreText.match(/(\d+)\/(\d+)\s*\((\d+\.\d+)/);
      if (scoreParts && scoreParts.length >= 4) {
        team1Score = {
          runs: parseInt(scoreParts[1]),
          wickets: parseInt(scoreParts[2]),
          overs: parseOvers(scoreParts[3]),
        };
      }
    }

    if (team2ScoreText) {
      const scoreParts = team2ScoreText.match(/(\d+)\/(\d+)\s*\((\d+\.\d+)/);
      if (scoreParts && scoreParts.length >= 4) {
        team2Score = {
          runs: parseInt(scoreParts[1]),
          wickets: parseInt(scoreParts[2]),
          overs: parseOvers(scoreParts[3]),
        };
      }
    }

    // Extract current batsmen details
    const currentBatsmen: Batsman[] = [];
    $(".batter-card").each((i, el) => {
      if (i > 1) return; // Only get the top 2 batsmen

      const name = $(el).find(".player-name").text().trim();
      const runs = parseNumeric($(el).find(".runs").text());
      const ballsText = $(el).find(".balls-faced").text().trim();
      const balls = parseNumeric(ballsText.split(" ")[0]);
      const foursText = $(el).find(".fours").text().trim();
      const fours = parseNumeric(foursText.split(" ")[0]);
      const sixesText = $(el).find(".sixes").text().trim();
      const sixes = parseNumeric(sixesText.split(" ")[0]);

      currentBatsmen.push({
        name,
        runs,
        balls,
        fours,
        sixes,
      });
    });

    // Extract current bowler details
    let currentBowler: Bowler | undefined;
    const bowlerCard = $(".bowler-card").first();
    if (bowlerCard.length) {
      const name = $(bowlerCard).find(".player-name").text().trim();
      const oversText = $(bowlerCard).find(".overs").text().trim();
      const overs = parseOvers(oversText.split(" ")[0]);
      const maidensText = $(bowlerCard).find(".maidens").text().trim();
      const maidens = parseNumeric(maidensText.split(" ")[0]);
      const runsText = $(bowlerCard).find(".runs-conceded").text().trim();
      const runs = parseNumeric(runsText.split(" ")[0]);
      const wicketsText = $(bowlerCard).find(".wickets").text().trim();
      const wickets = parseNumeric(wicketsText.split(" ")[0]);

      currentBowler = {
        name,
        overs,
        maidens,
        runs,
        wickets,
      };
    }

    // Extract recent overs
    const recentOvers: Over[] = [];
    $(".recent-overs .over").each((i, el) => {
      if (i > 2) return; // Only get the last 3 overs

      const overNumber = parseNumeric($(el).find(".over-number").text());
      const runsArr: (number | string)[] = [];

      $(el)
        .find(".ball")
        .each((j, ball) => {
          const ballText = $(ball).text().trim();
          if (ballText === "W") {
            runsArr.push("W");
          } else {
            runsArr.push(parseNumeric(ballText));
          }
        });

      recentOvers.push({
        over: overNumber,
        runs: runsArr,
      });
    });

    // Extract commentary
    const commentary: CommentaryItem[] = [];
    $(".commentary-list .commentary-item").each((i, el) => {
      if (i > 5) return; // Only get the last 5 commentary items

      const time = $(el).find(".commentary-time").text().trim();
      const text = $(el).find(".commentary-text").text().trim();

      commentary.push({
        time,
        text,
      });
    });

    // Calculate run rates
    let currentRunRate: number | undefined;
    let requiredRunRate: number | undefined;

    // For team batting second
    if (team1Score && team2Score && team1Score.overs === 20) {
      currentRunRate = team2Score.runs / team2Score.overs;
      const runsNeeded = team1Score.runs + 1 - team2Score.runs;
      const oversLeft = 20 - team2Score.overs;
      if (oversLeft > 0) {
        requiredRunRate = runsNeeded / oversLeft;
      }
    }
    // For team batting first
    else if (team1Score && (!team2Score || team2Score.runs === 0)) {
      currentRunRate = team1Score.runs / team1Score.overs;
    }

    // Extract last wicket if available
    let lastWicket: string | undefined;
    const lastWicketEl = $(".last-wicket").first();
    if (lastWicketEl.length) {
      lastWicket = lastWicketEl.text().trim();
    }

    return {
      id: "live-match",
      team1,
      team2,
      date,
      time: timeText.replace(/[^0-9:]/g, ""),
      venue,
      status: MatchStatus.LIVE,
      team1Score,
      team2Score,
      currentBatsmen: currentBatsmen.length > 0 ? currentBatsmen : undefined,
      currentBowler,
      recentOvers: recentOvers.length > 0 ? recentOvers : undefined,
      commentary: commentary.length > 0 ? commentary : undefined,
      currentRunRate,
      requiredRunRate,
      lastWicket,
    };
  } catch (error) {
    console.error("Error scraping live match:", error);
    // Fallback to dummy data
    return dummyData.liveMatch;
  }
}

/**
 * Get upcoming matches from the schedule
 */
export function getUpcomingMatches(fixtures: Match[]): Match[] {
  return fixtures
    .filter((match) => match.status === MatchStatus.UPCOMING)
    .sort((a, b) => {
      // Sort by date
      const dateComparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateComparison !== 0) return dateComparison;

      // If same date, sort by time
      return a.time.localeCompare(b.time);
    })
    .slice(0, 5); // Get the next 5 matches
}

/**
 * Helper function to convert month name to number
 */
function getMonthNumber(month: string): string {
  const months: Record<string, string> = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  return months[month] || "01";
}

/**
 * Main scraper function to get all IPL data
 */
export async function scrapeIPLData(): Promise<IPLData> {
  try {
    // 1. Scrape the points table
    const pointsTable = await scrapePointsTable();

    // 2. Scrape the fixtures/schedule
    const completeSchedule = await scrapeFixtures();

    // 3. Scrape the live match
    const liveMatch = await scrapeLiveMatch();

    // 4. Get upcoming matches
    const upcomingMatches = getUpcomingMatches(completeSchedule);

    // 5. Extract unique teams
    const teamsMap = new Map<string, Team>();

    // Add teams from points table
    pointsTable.forEach((entry) => {
      teamsMap.set(entry.team.id, entry.team);
    });

    // Add teams from schedule
    completeSchedule.forEach((match) => {
      teamsMap.set(match.team1.id, match.team1);
      teamsMap.set(match.team2.id, match.team2);
    });

    // Convert Map to array
    const teams = Array.from(teamsMap.values());

    // 6. Return the complete data
    return {
      teams,
      pointsTable,
      completeSchedule,
      upcomingMatches,
      liveMatch: liveMatch || undefined,
    };
  } catch (error) {
    console.error("Error scraping IPL data:", error);
    // Fallback to dummy data
    return dummyData;
  }
}
