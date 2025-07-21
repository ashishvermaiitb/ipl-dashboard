import { NextResponse } from "next/server";
import { getIPLData } from "@/utils/api-scraper";
import { dummyData } from "@/utils/dummy-data";
import type { IPLData } from "@/types/ipl";

// In-memory cache
let cachedData: IPLData | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * GET handler for the scrape API route
 * Fetches IPL data or returns cached/dummy data
 */
export async function GET() {
  try {
    const now = Date.now();

    // Check if we have valid cached data
    if (cachedData && now - lastFetchTime < CACHE_TTL) {
      return NextResponse.json(cachedData, {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300",
          "X-Cache": "HIT",
        },
      });
    }

    // Fetch IPL data
    try {
      const data = await getIPLData();

      // Update cache
      cachedData = data;
      lastFetchTime = now;

      return NextResponse.json(data, {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300",
          "X-Cache": "MISS",
        },
      });
    } catch (error) {
      console.error("Data fetching failed, falling back to dummy data:", error);

      // If fetching fails, fall back to dummy data
      return NextResponse.json(dummyData, {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300",
          "X-Cache": "FALLBACK",
        },
      });
    }
  } catch (error) {
    console.error("Failed to fetch IPL data:", error);
    return NextResponse.json(
      { error: "Failed to fetch IPL data" },
      { status: 500 }
    );
  }
}

// Cache control using Next.js config
export const revalidate = 300;
