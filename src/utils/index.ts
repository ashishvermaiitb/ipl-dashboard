import { format, isToday, isTomorrow, parseISO } from "date-fns";

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return "Today";
  }

  if (isTomorrow(date)) {
    return "Tomorrow";
  }

  return format(date, "MMM dd, yyyy");
};

/**
 * Format time for display
 */
export const formatTime = (timeString: string): string => {
  return timeString;
};

/**
 * Get team color by team name
 */
export const getTeamColor = (teamName: string): string => {
  const teamColors: Record<string, string> = {
    "Mumbai Indians": "#004BA0",
    "Chennai Super Kings": "#F9CD05",
    "Royal Challengers Bangalore": "#EC1C24",
    "Kolkata Knight Riders": "#3A225D",
    "Sunrisers Hyderabad": "#FF822A",
    "Delhi Capitals": "#282968",
    "Punjab Kings": "#ED1B24",
    "Rajasthan Royals": "#254AA5",
    "Gujarat Titans": "#1B2951",
    "Lucknow Super Giants": "#1B5099",
  };

  return teamColors[teamName] || "#6B7280";
};

/**
 * Get short team name
 */
export const getShortTeamName = (teamName: string): string => {
  const shortNames: Record<string, string> = {
    "Mumbai Indians": "MI",
    "Chennai Super Kings": "CSK",
    "Royal Challengers Bangalore": "RCB",
    "Kolkata Knight Riders": "KKR",
    "Sunrisers Hyderabad": "SRH",
    "Delhi Capitals": "DC",
    "Punjab Kings": "PBKS",
    "Rajasthan Royals": "RR",
    "Gujarat Titans": "GT",
    "Lucknow Super Giants": "LSG",
  };

  return shortNames[teamName] || teamName.substring(0, 3).toUpperCase();
};

/**
 * Calculate win percentage
 */
export const calculateWinPercentage = (won: number, played: number): number => {
  if (played === 0) return 0;
  return Math.round((won / played) * 100);
};

/**
 * Format net run rate
 */
export const formatNetRunRate = (nrr: number): string => {
  return nrr >= 0 ? `+${nrr.toFixed(3)}` : nrr.toFixed(3);
};

/**
 * Check if match is today
 */
export const isMatchToday = (matchDate: string): boolean => {
  return isToday(parseISO(matchDate));
};

/**
 * Get match status color
 */
export const getMatchStatusColor = (status: string): string => {
  switch (status) {
    case "live":
      return "text-red-500";
    case "upcoming":
      return "text-blue-500";
    case "completed":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};
