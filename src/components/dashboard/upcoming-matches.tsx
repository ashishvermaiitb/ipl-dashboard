"use client";

import { useIPLDataContext } from "@/components/data-provider";
import { Card, CardContent } from "@/components/ui/card";
import { TeamBadge } from "@/components/ui/team-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils";

export default function UpcomingMatches() {
  const { data, isLoading, error, refetch } = useIPLDataContext();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-40 bg-gray-200 rounded dark:bg-gray-700"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
        <CardContent className="pt-4">
          <p className="text-red-500 mb-4 dark:text-red-400">{error.message}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.upcomingMatches || data.upcomingMatches.length === 0) {
    return (
      <Card>
        <CardContent className="pt-4">
          <p className="text-gray-600 dark:text-gray-300">
            No upcoming matches scheduled at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.upcomingMatches.map((match) => (
        <Card
          key={match.id}
          className="hover:shadow-md transition-shadow border-gray-200 dark:border-gray-700"
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {formatDate(match.date)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {match.time}
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <TeamBadge team={match.team1} showName />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                VS
              </span>
              <TeamBadge team={match.team2} showName />
            </div>

            <div className="text-xs text-gray-600 text-center dark:text-gray-400">
              {match.venue}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
