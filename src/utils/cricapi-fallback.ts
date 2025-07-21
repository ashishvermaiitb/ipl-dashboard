import { IPLData, Match, Team, PointsTableEntry, LiveMatch } from "@/types/ipl"; // adjust path if needed
import { dummyData } from "./dummy-data";

// Example mock async function to simulate scraping/fallback logic
export async function getIPLData(): Promise<IPLData> {
  try {
    // Simulate fetching/scraping data or falling back to dummy data
    const teams: Team[] = dummyData.teams;
    const pointsTable: PointsTableEntry[] = dummyData.pointsTable;
    const completeSchedule: Match[] = dummyData.completeSchedule;
    const upcomingMatches: Match[] = dummyData.upcomingMatches;
    const liveMatch: LiveMatch | undefined = dummyData.liveMatch; // might be undefined

    // Merge live match into schedule if needed
    const allMatches: Match[] = [...completeSchedule];

    if (liveMatch) {
      const existingIndex = allMatches.findIndex((m) => m.id === liveMatch.id);
      if (existingIndex >= 0) {
        allMatches[existingIndex] = { ...liveMatch };
      } else {
        allMatches.push({ ...liveMatch });
      }
    }

    return {
      teams,
      pointsTable,
      completeSchedule: allMatches,
      upcomingMatches,
      liveMatch, // this can be undefined, and that's okay if IPLData supports it
    };
  } catch (error) {
    console.error(
      "Failed to fetch IPL data. Returning fallback dummy data:",
      error
    );

    return {
      teams: dummyData.teams,
      pointsTable: dummyData.pointsTable,
      completeSchedule: dummyData.completeSchedule,
      upcomingMatches: dummyData.upcomingMatches,
      liveMatch: dummyData.liveMatch,
    };
  }
}
