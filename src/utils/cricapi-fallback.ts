import axios from "axios";
import {
  IPLData,
  LiveMatch,
  Match,
  MatchStatus,
  PointsTableEntry,
  Team,
} from "@/types/ipl";
import { dummyData } from "./dummy-data";

// CricAPI endpoints (from cricapi.com)
const CRICAPI_BASE_URL = "https://api.cricapi.com/v1";
const CRICAPI_KEY = "YOUR_CRICAPI_KEY"; // Replace with your API key

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

// Get team object from name
const getTeamFromName = (teamName: string): Team => {
  // Try to extract the team ID
  let id = "";
  for (const [key, value] of Object.entries(TEAM_ID_MAP)) {
    if (teamName.includes(key)) {
      id = value;
      break;
    }
  }

  // If no ID found, create one from the team name
  if (!id) {
    id = teamName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  // Look up in our dummy data for logos and colors
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
 * Get IPL data from CricAPI
 */
export async function getIPLDataFromCricAPI(): Promise<IPLData> {
  try {
    // 1. Get current IPL series info
    const seriesResponse = await axios.get(`${CRICAPI_BASE_URL}/series_info`, {
      params: {
        apikey: CRICAPI_KEY,
        offset: 0,
        search: "Indian Premier League",
      },
    });

    const seriesData = seriesResponse.data;
    if (!seriesData.data || seriesData.data.length === 0) {
      throw new Error("No IPL series found");
    }

    // Find the most recent IPL series
    const currentSeries = seriesData.data[0];
    const seriesId = currentSeries.id;

    // 2. Get matches for this series
    const matchesResponse = await axios.get(
      `${CRICAPI_BASE_URL}/series_matches`,
      {
        params: {
          apikey: CRICAPI_KEY,
          id: seriesId,
        },
      }
    );

    const matchesData = matchesResponse.data;
    if (!matchesData.data || matchesData.data.length === 0) {
      throw new Error("No matches found for this series");
    }

    // 3. Get current matches to find live ones
    const currentMatchesResponse = await axios.get(
      `${CRICAPI_BASE_URL}/currentMatches`,
      {
        params: {
          apikey: CRICAPI_KEY,
          offset: 0,
        },
      }
    );

    const currentMatchesData = currentMatchesResponse.data;
    const liveMatches = currentMatchesData.data
      ? currentMatchesData.data.filter(
          (match: any) =>
            match.series_id === seriesId && match.status !== "Match not started"
        )
      : [];

    // Process all matches
    const allMatches: Match[] = [];
    let liveMatch: LiveMatch | undefined;

    // Process upcoming and completed matches
    matchesData.data.forEach((match: any) => {
      const team1 = getTeamFromName(match.teamInfo[0].name);
      const team2 = getTeamFromName(match.teamInfo[1].name);

      // Convert date to YYYY-MM-DD format
      const matchDate = new Date(match.dateTimeGMT);
      const date = matchDate.toISOString().split("T")[0];

      // Extract time in HH:MM format
      const hours = matchDate.getHours().toString().padStart(2, "0");
      const minutes = matchDate.getMinutes().toString().padStart(2, "0");
      const time = `${hours}:${minutes}`;

      // Determine match status
      const now = new Date();
      const isUpcoming = matchDate > now;

      const status = isUpcoming ? MatchStatus.UPCOMING : MatchStatus.COMPLETED;

      // Create match object
      const newMatch: Match = {
        id: match.id,
        team1,
        team2,
        date,
        time,
        venue: match.venue || "TBA",
        status,
        result: match.status,
      };

      allMatches.push(newMatch);
    });

    // Process live match if any
    if (liveMatches.length > 0) {
      const liveMatchData = liveMatches[0];

      // Get detailed live match info
      const liveMatchResponse = await axios.get(
        `${CRICAPI_BASE_URL}/match_info`,
        {
          params: {
            apikey: CRICAPI_KEY,
            id: liveMatchData.id,
          },
        }
      );

      const liveMatchInfo = liveMatchResponse.data.data;

      if (liveMatchInfo) {
        const team1 = getTeamFromName(liveMatchInfo.teamInfo[0].name);
        const team2 = getTeamFromName(liveMatchInfo.teamInfo[1].name);

        // Convert date to YYYY-MM-DD format
        const matchDate = new Date(liveMatchInfo.dateTimeGMT);
        const date = matchDate.toISOString().split("T")[0];

        // Extract time in HH:MM format
        const hours = matchDate.getHours().toString().padStart(2, "0");
        const minutes = matchDate.getMinutes().toString().padStart(2, "0");
        const time = `${hours}:${minutes}`;

        // Create live match object
        liveMatch = {
          id: liveMatchInfo.id,
          team1,
          team2,
          date,
          time,
          venue: liveMatchInfo.venue || "TBA",
          status: MatchStatus.LIVE,
        };

        // Add score information if available
        if (liveMatchInfo.score) {
          const team1ScoreInfo = liveMatchInfo.score.find((s: any) =>
            s.inning.includes(team1.name)
          );
          const team2ScoreInfo = liveMatchInfo.score.find((s: any) =>
            s.inning.includes(team2.name)
          );

          if (team1ScoreInfo) {
            // Parse score like "156/4 (16.2 ov)"
            const scoreMatch = team1ScoreInfo.r.match(
              /(\d+)\/(\d+)\s*\((\d+\.\d+|\d+)/
            );
            if (scoreMatch) {
              liveMatch.team1Score = {
                runs: parseInt(scoreMatch[1]),
                wickets: parseInt(scoreMatch[2]),
                overs: parseFloat(scoreMatch[3]),
              };
            }
          }

          if (team2ScoreInfo) {
            // Parse score like "156/4 (16.2 ov)"
            const scoreMatch = team2ScoreInfo.r.match(
              /(\d+)\/(\d+)\s*\((\d+\.\d+|\d+)/
            );
            if (scoreMatch) {
              liveMatch.team2Score = {
                runs: parseInt(scoreMatch[1]),
                wickets: parseInt(scoreMatch[2]),
                overs: parseFloat(scoreMatch[3]),
              };
            }
          }
        }

        // Calculate run rates
        if (liveMatch.team1Score && liveMatch.team1Score.overs > 0) {
          liveMatch.currentRunRate =
            liveMatch.team1Score.runs / liveMatch.team1Score.overs;
        } else if (liveMatch.team2Score && liveMatch.team2Score.overs > 0) {
          liveMatch.currentRunRate =
            liveMatch.team2Score.runs / liveMatch.team2Score.overs;
        }

        // Add the live match to all matches
        const existingIndex = allMatches.findIndex(
          (m) => m.id === liveMatch.id
        );
        if (existingIndex >= 0) {
          allMatches[existingIndex] = { ...liveMatch };
        } else {
          allMatches.push({ ...liveMatch });
        }
      }
    }

    // 4. Get points table data
    // Since CricAPI doesn't provide direct points table,
    // we'll calculate it based on matches or use dummy data
    let pointsTable = dummyData.pointsTable;

    // Sort upcoming matches
    const upcomingMatches = allMatches
      .filter((match) => match.status === MatchStatus.UPCOMING)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    // Extract all teams
    const teamsSet = new Set<string>();
    allMatches.forEach((match) => {
      teamsSet.add(match.team1.id);
      teamsSet.add(match.team2.id);
    });

    const teams = Array.from(teamsSet).map((id) => {
      const matchWithTeam = allMatches.find(
        (match) => match.team1.id === id || match.team2.id === id
      );
      return matchWithTeam
        ? matchWithTeam.team1.id === id
          ? matchWithTeam.team1
          : matchWithTeam.team2
        : dummyData.teams.find((team) => team.id === id) || {
            id,
            name: id.toUpperCase(),
            shortName: id.toUpperCase(),
          };
    });

    return {
      teams,
      upcomingMatches,
      liveMatch,
      pointsTable,
      completeSchedule: allMatches,
    };
  } catch (error) {
    console.error("Error fetching IPL data from CricAPI:", error);
    throw error;
  }
}
