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

// GitHub hosted cricket API endpoints
const GITHUB_API_BASE_URL = "https://cricket-api-production.up.railway.app";
const BACKUP_API_URL = "https://cricket-live-data.p.rapidapi.com";

// Team mapping for consistent IDs
const TEAM_ID_MAP: Record<string, string> = {
  "Chennai Super Kings": "csk",
  "Mumbai Indians": "mi",
  "Royal Challengers Bangalore": "rcb",
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
    if (teamName.includes(key) || key.includes(teamName)) {
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
 * Fetch IPL data from GitHub hosted API
 */
export async function getIPLDataFromGitHubAPI(): Promise<IPLData> {
  try {
    // Try to get live match data
    const liveResponse = await axios.get(
      `${GITHUB_API_BASE_URL}/score?id=current`
    );

    let liveMatch: LiveMatch | undefined;

    if (liveResponse.data && !liveResponse.data.error) {
      const liveData = liveResponse.data;

      // Check if it's an IPL match
      const isIPL =
        liveData.title &&
        (liveData.title.includes("IPL") ||
          liveData.title.includes("Indian Premier League"));

      if (isIPL) {
        // Extract team names from the title or teams data
        const teamNames = liveData.teams ? liveData.teams.split(" vs ") : [];

        if (teamNames.length === 2) {
          const team1 = getTeamFromName(teamNames[0]);
          const team2 = getTeamFromName(teamNames[1]);

          // Extract scores
          let team1Score;
          let team2Score;

          if (liveData.score) {
            const scoreLines = liveData.score.split("\n");

            if (scoreLines.length >= 2) {
              // Try to parse scores like "156/4 (16.2 ov)"
              const scoreRegex = /(\d+)\/(\d+)\s*\((\d+\.\d+|\d+)/;

              const team1ScoreMatch = scoreLines[0].match(scoreRegex);
              if (team1ScoreMatch) {
                team1Score = {
                  runs: parseInt(team1ScoreMatch[1]),
                  wickets: parseInt(team1ScoreMatch[2]),
                  overs: parseFloat(team1ScoreMatch[3]),
                };
              }

              const team2ScoreMatch = scoreLines[1].match(scoreRegex);
              if (team2ScoreMatch) {
                team2Score = {
                  runs: parseInt(team2ScoreMatch[1]),
                  wickets: parseInt(team2ScoreMatch[2]),
                  overs: parseFloat(team2ScoreMatch[3]),
                };
              }
            }
          }

          // Create the live match object
          liveMatch = {
            id: "live-match",
            team1,
            team2,
            date: new Date().toISOString().split("T")[0],
            time: new Date().toTimeString().split(" ")[0].substring(0, 5),
            venue: liveData.venue || "Unknown Venue",
            status: MatchStatus.LIVE,
            team1Score,
            team2Score,
          };

          // Calculate run rates
          if (team1Score && team1Score.overs > 0) {
            liveMatch.currentRunRate = team1Score.runs / team1Score.overs;
          } else if (team2Score && team2Score.overs > 0) {
            liveMatch.currentRunRate = team2Score.runs / team2Score.overs;
          }

          // Add commentary if available
          if (liveData.update) {
            liveMatch.commentary = [
              {
                time: new Date().toTimeString().split(" ")[0].substring(0, 5),
                text: liveData.update,
              },
            ];
          }
        }
      }
    }

    // Since this API doesn't provide comprehensive IPL data,
    // we'll combine the live match with dummy data for the rest
    const pointsTable = dummyData.pointsTable;
    const completeSchedule = [...dummyData.completeSchedule];

    // Update the live match in the complete schedule if available
    if (liveMatch) {
      const liveMatchIndex = completeSchedule.findIndex(
        (match) =>
          (match.team1.id === liveMatch!.team1.id &&
            match.team2.id === liveMatch!.team2.id) ||
          (match.team1.id === liveMatch!.team2.id &&
            match.team2.id === liveMatch!.team1.id)
      );

      if (liveMatchIndex >= 0) {
        completeSchedule[liveMatchIndex] = {
          ...completeSchedule[liveMatchIndex],
          status: MatchStatus.LIVE,
        };
      } else {
        completeSchedule.push({
          ...liveMatch,
          status: MatchStatus.LIVE,
        });
      }
    }

    // Get upcoming matches
    const upcomingMatches = completeSchedule
      .filter((match) => match.status === MatchStatus.UPCOMING)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    // Extract all teams
    const teams = dummyData.teams;

    return {
      teams,
      upcomingMatches,
      liveMatch,
      pointsTable,
      completeSchedule,
    };
  } catch (error) {
    console.error("Error fetching IPL data from GitHub API:", error);
    throw error;
  }
}
