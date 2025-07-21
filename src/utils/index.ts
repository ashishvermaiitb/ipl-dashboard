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

  return format(date, "EEE, d MMM yyyy");
};

/**
 * Get team color based on team ID or use fallback
 */
export const getTeamColor = (teamId: string, fallback = "#ccc"): string => {
  const teamColors: Record<string, string> = {
    csk: "#FFFF3C",
    mi: "#004BA0",
    rcb: "#FF0000",
    srh: "#FF822A",
    dc: "#0078BC",
    kkr: "#3A225D",
    rr: "#EA1A85",
    pbks: "#D11D9B",
    gt: "#1C1C1C",
    lsg: "#A72056",
  };

  return teamColors[teamId] || fallback;
};

/**
 * Calculate required run rate
 */
export const calculateRequiredRunRate = (
  targetScore: number,
  currentScore: number,
  totalOvers: number,
  oversCompleted: number
): number => {
  const runsRequired = targetScore - currentScore;
  const oversRemaining = totalOvers - oversCompleted;

  if (oversRemaining <= 0 || runsRequired <= 0) {
    return 0;
  }

  return runsRequired / oversRemaining;
};
