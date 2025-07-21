import { NextResponse } from "next/server";
import { MatchStatus, PointsTableEntry, Match, LiveMatch } from "@/types/ipl";
import { dummyData } from "@/utils/dummy-data";

/**
 * GET handler for the scrape API route
 * Fetches IPL data from iplt20.com or returns dummy data
 */
export async function GET() {
  try {
    // TODO: Implement actual web scraping logic here
    // For now, we'll use dummy data

    // In a real implementation, you would:
    // 1. Use a library like cheerio or puppeteer to scrape iplt20.com
    // 2. Parse the HTML to extract match data, points table, etc.
    // 3. Format the data according to our defined types
    // 4. Cache the results to minimize unnecessary scraping

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(dummyData, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch IPL data:", error);
    return NextResponse.json(
      { error: "Failed to fetch IPL data" },
      { status: 500 }
    );
  }
}

// Revalidate data every 5 minutes
export const revalidate = 300;
