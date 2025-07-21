import {
  LiveMatch,
  Match,
  MatchStatus,
  PointsTableEntry,
  Team,
} from "@/types/ipl";

// Team data
export const teams: Team[] = [
  {
    id: "csk",
    name: "Chennai Super Kings",
    shortName: "CSK",
    logo: "/teams/csk.png",
    color: "#FFFF3C",
  },
  {
    id: "mi",
    name: "Mumbai Indians",
    shortName: "MI",
    logo: "/teams/mi.png",
    color: "#004BA0",
  },
  {
    id: "rcb",
    name: "Royal Challengers Bangalore",
    shortName: "RCB",
    logo: "/teams/rcb.png",
    color: "#FF0000",
  },
  {
    id: "srh",
    name: "Sunrisers Hyderabad",
    shortName: "SRH",
    logo: "/teams/srh.png",
    color: "#FF822A",
  },
  {
    id: "dc",
    name: "Delhi Capitals",
    shortName: "DC",
    logo: "/teams/dc.png",
    color: "#0078BC",
  },
  {
    id: "kkr",
    name: "Kolkata Knight Riders",
    shortName: "KKR",
    logo: "/teams/kkr.png",
    color: "#3A225D",
  },
  {
    id: "rr",
    name: "Rajasthan Royals",
    shortName: "RR",
    logo: "/teams/rr.png",
    color: "#EA1A85",
  },
  {
    id: "pbks",
    name: "Punjab Kings",
    shortName: "PBKS",
    logo: "/teams/pbks.png",
    color: "#D11D9B",
  },
  {
    id: "gt",
    name: "Gujarat Titans",
    shortName: "GT",
    logo: "/teams/gt.png",
    color: "#1C1C1C",
  },
  {
    id: "lsg",
    name: "Lucknow Super Giants",
    shortName: "LSG",
    logo: "/teams/lsg.png",
    color: "#A72056",
  },
];

// Get team by ID
const getTeam = (id: string): Team => {
  return (
    teams.find((team) => team.id === id) || {
      id,
      name: id.toUpperCase(),
      shortName: id.toUpperCase(),
      color: "#888888",
    }
  );
};

// Generate dates for upcoming matches
const generateUpcomingDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 20; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};

const upcomingDates = generateUpcomingDates();

// Create upcoming matches
export const upcomingMatches: Match[] = [
  {
    id: "match-1",
    team1: getTeam("csk"),
    team2: getTeam("mi"),
    date: upcomingDates[0],
    time: "19:30",
    venue: "MA Chidambaram Stadium, Chennai",
    status: MatchStatus.UPCOMING,
  },
  {
    id: "match-2",
    team1: getTeam("rcb"),
    team2: getTeam("kkr"),
    date: upcomingDates[1],
    time: "15:30",
    venue: "M.Chinnaswamy Stadium, Bangalore",
    status: MatchStatus.UPCOMING,
  },
  {
    id: "match-3",
    team1: getTeam("dc"),
    team2: getTeam("pbks"),
    date: upcomingDates[2],
    time: "19:30",
    venue: "Arun Jaitley Stadium, Delhi",
    status: MatchStatus.UPCOMING,
  },
  {
    id: "match-4",
    team1: getTeam("gt"),
    team2: getTeam("rr"),
    date: upcomingDates[3],
    time: "19:30",
    venue: "Narendra Modi Stadium, Ahmedabad",
    status: MatchStatus.UPCOMING,
  },
  {
    id: "match-5",
    team1: getTeam("srh"),
    team2: getTeam("lsg"),
    date: upcomingDates[4],
    time: "15:30",
    venue: "Rajiv Gandhi Intl. Stadium, Hyderabad",
    status: MatchStatus.UPCOMING,
  },
];

// Live match data
export const liveMatch: LiveMatch = {
  id: "live-match-1",
  team1: getTeam("kkr"),
  team2: getTeam("rcb"),
  date: new Date().toISOString().split("T")[0],
  time: "19:30",
  venue: "Eden Gardens, Kolkata",
  status: MatchStatus.LIVE,
  team1Score: {
    runs: 187,
    wickets: 6,
    overs: 20,
  },
  team2Score: {
    runs: 156,
    wickets: 4,
    overs: 16.2,
  },
  currentBatsmen: [
    { name: "Virat Kohli", runs: 73, balls: 42, fours: 8, sixes: 3 },
    { name: "Glenn Maxwell", runs: 24, balls: 14, fours: 2, sixes: 2 },
  ],
  currentBowler: {
    name: "Andre Russell",
    overs: 3.2,
    maidens: 0,
    runs: 36,
    wickets: 2,
  },
  recentOvers: [
    { over: 15, runs: [1, 4, 6, 0, 1, 1] },
    { over: 16, runs: [4, 1, 0, "W", 2, 1] },
  ],
  commentary: [
    { time: "19:45", text: "Kohli smashes a huge six over long-on!" },
    { time: "19:43", text: "Russell gets the important wicket of Finch." },
    {
      time: "19:40",
      text: "RCB need 32 runs from 22 balls with 6 wickets remaining.",
    },
  ],
  requiredRunRate: 8.64,
  currentRunRate: 9.5,
  lastWicket: "Aaron Finch b Andre Russell 34(21)",
};

// Points table
export const pointsTable: PointsTableEntry[] = [
  {
    team: getTeam("gt"),
    matches: 14,
    won: 10,
    lost: 4,
    tied: 0,
    points: 20,
    netRunRate: +0.809,
  },
  {
    team: getTeam("csk"),
    matches: 14,
    won: 9,
    lost: 5,
    tied: 0,
    points: 18,
    netRunRate: +0.652,
  },
  {
    team: getTeam("srh"),
    matches: 14,
    won: 8,
    lost: 6,
    tied: 0,
    points: 16,
    netRunRate: +0.484,
  },
  {
    team: getTeam("lsg"),
    matches: 14,
    won: 8,
    lost: 6,
    tied: 0,
    points: 16,
    netRunRate: +0.284,
  },
  {
    team: getTeam("rcb"),
    matches: 14,
    won: 8,
    lost: 6,
    tied: 0,
    points: 16,
    netRunRate: +0.24,
  },
  {
    team: getTeam("kkr"),
    matches: 14,
    won: 7,
    lost: 7,
    tied: 0,
    points: 14,
    netRunRate: +0.217,
  },
  {
    team: getTeam("mi"),
    matches: 14,
    won: 6,
    lost: 8,
    tied: 0,
    points: 12,
    netRunRate: -0.212,
  },
  {
    team: getTeam("dc"),
    matches: 14,
    won: 5,
    lost: 9,
    tied: 0,
    points: 10,
    netRunRate: -0.505,
  },
  {
    team: getTeam("pbks"),
    matches: 14,
    won: 5,
    lost: 9,
    tied: 0,
    points: 10,
    netRunRate: -0.375,
  },
  {
    team: getTeam("rr"),
    matches: 14,
    won: 4,
    lost: 10,
    tied: 0,
    points: 8,
    netRunRate: -1.01,
  },
];

// Create complete schedule
export const completeSchedule: Match[] = [
  ...Array(40)
    .fill(null)
    .map((_, i) => {
      const dateIndex = Math.min(i, upcomingDates.length - 1);
      const team1Index = i % teams.length;
      const team2Index = (i + 1) % teams.length;

      return {
        id: `schedule-match-${i + 1}`,
        team1: teams[team1Index],
        team2: teams[team2Index],
        date: upcomingDates[dateIndex],
        time: i % 2 === 0 ? "15:30" : "19:30",
        venue: `${teams[team1Index].name} Stadium, ${teams[team1Index].name
          .split(" ")
          .pop()}`,
        status:
          i < 3
            ? MatchStatus.COMPLETED
            : i === 3
            ? MatchStatus.LIVE
            : MatchStatus.UPCOMING,
      };
    }),
];

// Export all dummy data
export const dummyData = {
  teams,
  upcomingMatches: upcomingMatches.slice(0, 5),
  liveMatch,
  pointsTable,
  completeSchedule,
};
