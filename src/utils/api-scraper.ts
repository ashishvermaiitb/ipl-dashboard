import { IPLData } from "@/types/ipl";
import { dummyData } from "./dummy-data";

/**
 * Temporary implementation that returns dummy data
 * This ensures the application works while we implement proper data fetching
 */
export async function getIPLData(): Promise<IPLData> {
  try {
    console.log("Fetching IPL data...");

    // For now, just return the dummy data
    // This ensures the application works immediately

    // Simulate a delay to make it feel like real fetching
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In a production environment, we would implement proper
    // data fetching from IPL sources here

    return dummyData;
  } catch (error) {
    console.error("Error fetching IPL data:", error);

    // Always fall back to dummy data if there's an error
    return dummyData;
  }
}

/**
 * This is a placeholder for future implementation
 * We'll implement proper scraping in the next iteration
 */
export async function scrapeIPLData(): Promise<IPLData> {
  // This will be implemented later
  // For now, return dummy data
  return dummyData;
}
