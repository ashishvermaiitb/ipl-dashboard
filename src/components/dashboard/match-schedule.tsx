"use client";

import { useState } from "react";
import { useIPLDataContext } from "@/components/data-provider";
import { TeamBadge } from "@/components/ui/team-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils";
import { MatchStatus } from "@/types/ipl";

export default function MatchSchedule() {
  const { data, isLoading, error, refetch } = useIPLDataContext();
  const [filter, setFilter] = useState<MatchStatus | "all">("all");

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-full mb-4 dark:bg-gray-700"></div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 rounded w-full mb-3 dark:bg-gray-700"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
        <p className="text-red-500 mb-4 dark:text-red-400">{error.message}</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  if (!data || !data.completeSchedule || data.completeSchedule.length === 0) {
    return (
      <div className="text-gray-600 dark:text-gray-300">
        Schedule data is not available at the moment.
      </div>
    );
  }

  // Filter matches based on selected status
  const filteredMatches =
    filter === "all"
      ? data.completeSchedule
      : data.completeSchedule.filter((match) => match.status === filter);

  // Group matches by date
  const matchesByDate = filteredMatches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {} as Record<string, typeof filteredMatches>);

  // Sort dates
  const sortedDates = Object.keys(matchesByDate).sort();

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Matches
        </Button>
        <Button
          variant={filter === MatchStatus.UPCOMING ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter(MatchStatus.UPCOMING)}
        >
          Upcoming
        </Button>
        <Button
          variant={filter === MatchStatus.LIVE ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter(MatchStatus.LIVE)}
        >
          Live
        </Button>
        <Button
          variant={filter === MatchStatus.COMPLETED ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter(MatchStatus.COMPLETED)}
        >
          Completed
        </Button>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="text-gray-600 p-4 text-center border rounded-md dark:text-gray-300 dark:border-gray-700">
          No matches found for the selected filter.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="match-date-header text-sm font-semibold mb-2 sticky top-0 bg-white py-2 text-gray-900 dark:text-white dark:bg-gray-900">
                {formatDate(date)}
              </h3>
              <div className="space-y-3">
                {matchesByDate[date].map((match) => (
                  <div
                    key={match.id}
                    className={`border rounded-lg p-3 match-card ${
                      match.status === MatchStatus.LIVE
                        ? "border-blue-500 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                        : match.status === MatchStatus.COMPLETED
                        ? "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium match-time text-gray-800 dark:text-gray-200">
                        {match.time}
                      </div>
                      <div
                        className={`text-xs px-2 py-0.5 rounded-full status-badge ${
                          match.status === MatchStatus.LIVE
                            ? "status-live"
                            : match.status === MatchStatus.COMPLETED
                            ? "status-completed"
                            : "status-upcoming"
                        }`}
                      >
                        {match.status === MatchStatus.LIVE
                          ? "Live"
                          : match.status === MatchStatus.COMPLETED
                          ? "Completed"
                          : "Upcoming"}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <div className="team-name">
                        <TeamBadge team={match.team1} showName />
                      </div>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                        VS
                      </span>
                      <div className="team-name">
                        <TeamBadge team={match.team2} showName />
                      </div>
                    </div>

                    <div className="text-xs match-venue text-gray-600 dark:text-gray-400">
                      {match.venue}
                    </div>

                    {match.result && (
                      <div className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-300">
                        {match.result}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
