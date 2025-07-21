export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  color?: string;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  date: string;
  time: string;
  venue: string;
  status: "upcoming" | "live" | "completed";
  result?: string;
  isLive?: boolean;
  liveScore?: {
    team1Score?: string;
    team2Score?: string;
    overs?: string;
    currentBatsman?: string[];
    currentBowler?: string;
    lastBalls?: string[];
  };
}

export interface PointsTableEntry {
  position: number;
  team: Team;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  netRunRate: number;
  form?: string[];
}

export interface Schedule {
  matches: Match[];
  lastUpdated: string;
}

export interface LiveMatch extends Match {
  isLive: true;
  liveScore: NonNullable<Match["liveScore"]>;
  commentary?: string[];
  currentOver?: string;
  target?: number;
  required?: {
    runs: number;
    balls: number;
    runRate: number;
  };
}

export interface DashboardData {
  liveMatch?: LiveMatch;
  upcomingMatches: Match[];
  pointsTable: PointsTableEntry[];
  schedule: Schedule;
  lastUpdated: string;
}
