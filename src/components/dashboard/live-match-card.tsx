"use client";

import { useIPLDataContext } from "@/components/data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamBadge } from "@/components/ui/team-badge";
import { MatchStatus } from "@/types/ipl";
import { formatDate } from "@/utils";
import { Button } from "../ui/button";
import RealTimeScore from "./real-time-score";

export default function LiveMatchCard() {
  const { data, isLoading, error, refetch } = useIPLDataContext();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-7 bg-gray-200 rounded w-1/3 dark:bg-gray-700"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-40 bg-gray-200 rounded dark:bg-gray-700"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">
            Error Loading Match Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 mb-4 dark:text-red-400">{error.message}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.liveMatch) {
    // No live match, show upcoming match instead
    if (data?.upcomingMatches && data.upcomingMatches.length > 0) {
      const nextMatch = data.upcomingMatches[0];
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">Next Match</span>
              <span className="text-sm font-normal text-gray-600 dark:text-gray-300">
                {formatDate(nextMatch.date)} • {nextMatch.time}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center justify-between w-full max-w-md">
                <TeamBadge team={nextMatch.team1} size="lg" showName />
                <div className="text-gray-700 font-bold dark:text-gray-300">
                  VS
                </div>
                <TeamBadge team={nextMatch.team2} size="lg" showName />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {nextMatch.venue}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>No Live Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            There are no matches in progress at the moment. Check back later for
            live updates.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { liveMatch } = data;
  const isTeam1Batting =
    !!liveMatch.team1Score &&
    (!liveMatch.team2Score || liveMatch.team2Score.overs < 20);

  return (
    <Card className="overflow-hidden border-2 border-blue-500 dark:border-blue-600">
      <div className="bg-blue-600 text-white py-2 px-4 flex flex-col md:flex-row md:items-center md:justify-between dark:bg-blue-700">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="font-bold">LIVE</span>
          </div>
          <span className="text-xs text-white mt-1">
            (Data shown may be dummy if live fetch fails)
          </span>
        </div>

        <div className="text-sm mt-2 md:mt-0">
          {formatDate(liveMatch.date)} • {liveMatch.time}
        </div>
      </div>

      <CardContent className="pt-4">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Teams and Scores */}
          <div className="flex-1">
            {/* Add real-time score component for mobile view */}
            <div className="block md:hidden mb-4">
              <RealTimeScore match={liveMatch} />
            </div>

            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <TeamBadge team={liveMatch.team1} size="lg" showName />
                {liveMatch.team1Score && (
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {liveMatch.team1Score.runs}/{liveMatch.team1Score.wickets}
                    <span className="text-sm font-normal ml-2 text-gray-600 dark:text-gray-300">
                      ({Math.floor(liveMatch.team1Score.overs)}.
                      {(liveMatch.team1Score.overs % 1) * 10})
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <TeamBadge team={liveMatch.team2} size="lg" showName />
                {liveMatch.team2Score && (
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {liveMatch.team2Score.runs}/{liveMatch.team2Score.wickets}
                    <span className="text-sm font-normal ml-2 text-gray-600 dark:text-gray-300">
                      ({Math.floor(liveMatch.team2Score.overs)}.
                      {(liveMatch.team2Score.overs % 1) * 10})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Venue */}
            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
              {liveMatch.venue}
            </div>

            {/* Required Run Rate */}
            {liveMatch.requiredRunRate && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      CURRENT RR
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {liveMatch.currentRunRate?.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      REQUIRED RR
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {liveMatch.requiredRunRate.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add real-time score component for desktop view */}
            <div className="hidden md:block mt-6">
              <RealTimeScore match={liveMatch} />
            </div>
          </div>

          {/* Live Match Info */}
          <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-4 md:pt-0 md:pl-6">
            {/* Current Batsmen */}
            {liveMatch.currentBatsmen &&
              liveMatch.currentBatsmen.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                    BATSMEN
                  </h3>
                  <div className="space-y-2">
                    {liveMatch.currentBatsmen.map((batsman, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="font-medium text-gray-800 dark:text-gray-300">
                          {batsman.name}
                          {index === 0 && <span className="ml-1">*</span>}
                        </div>
                        <div className="text-gray-800 dark:text-gray-300">
                          {batsman.runs}
                          <span className="text-gray-600 dark:text-gray-400">
                            ({batsman.balls})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Current Bowler */}
            {liveMatch.currentBowler && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                  BOWLER
                </h3>
                <div className="flex justify-between text-sm">
                  <div className="font-medium text-gray-800 dark:text-gray-300">
                    {liveMatch.currentBowler.name}
                  </div>
                  <div className="text-gray-800 dark:text-gray-300">
                    {liveMatch.currentBowler.wickets}/
                    {liveMatch.currentBowler.runs}
                    <span className="text-gray-600 dark:text-gray-400">
                      ({Math.floor(liveMatch.currentBowler.overs)}.
                      {(liveMatch.currentBowler.overs % 1) * 10})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Overs */}
            {liveMatch.recentOvers && liveMatch.recentOvers.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                  RECENT OVERS
                </h3>
                <div className="space-y-2">
                  {liveMatch.recentOvers.map((over, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 text-xs"
                    >
                      <span className="font-medium text-gray-800 dark:text-gray-300">
                        Over {over.over}:
                      </span>
                      <div className="flex space-x-1">
                        {over.runs.map((run, idx) => (
                          <span
                            key={idx}
                            className={`w-6 h-6 flex items-center justify-center rounded-full
                              ${
                                run === "W"
                                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                  : run === 4
                                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                  : run === 6
                                  ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                          >
                            {run}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Last Wicket */}
            {liveMatch.lastWicket && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                  LAST WICKET
                </h3>
                <div className="text-sm text-red-600 dark:text-red-400">
                  {liveMatch.lastWicket}
                </div>
              </div>
            )}

            {/* Commentary */}
            {liveMatch.commentary && liveMatch.commentary.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-200">
                  COMMENTARY
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {liveMatch.commentary.map((comment, index) => (
                    <div key={index} className="text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
                        {comment.time}:
                      </span>{" "}
                      <span className="text-gray-800 dark:text-gray-300">
                        {comment.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
