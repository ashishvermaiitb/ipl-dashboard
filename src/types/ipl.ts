export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  color?: string;
}

export enum MatchStatus {
  UPCOMING = "upcoming",
  LIVE = "live",
  COMPLETED = "completed",
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  date: string;
  time: string;
  venue: string;
  status: MatchStatus;
  result?: string;
}

export interface Score {
  runs: number;
  wickets: number;
  overs: number;
}

export interface Batsman {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
}

export interface Bowler {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
}

export interface Over {
  over: number;
  runs: (number | string)[];
}

export interface CommentaryItem {
  time: string;
  text: string;
}

export interface LiveMatch extends Match {
  team1Score?: Score;
  team2Score?: Score;
  currentBatsmen?: Batsman[];
  currentBowler?: Bowler;
  recentOvers?: Over[];
  commentary?: CommentaryItem[];
  currentRunRate?: number;
  requiredRunRate?: number;
  lastWicket?: string;
}

export interface PointsTableEntry {
  team: Team;
  matches: number;
  won: number;
  lost: number;
  tied: number;
  points: number;
  netRunRate: number;
}

export interface IPLData {
  teams: Team[];
  upcomingMatches: Match[];
  liveMatch?: LiveMatch;
  pointsTable: PointsTableEntry[];
  completeSchedule: Match[];
}
