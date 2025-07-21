"use client";

import { useState } from "react";
import { useIPLData } from "@/hooks/use-ipl-data";
import { TeamBadge } from "@/components/ui/team-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils";
import { MatchStatus } from "@/types/ipl";

export default function MatchSchedule() {
  const { data, isLoading, error, refetch } = useIPLData();
  const [filter, setFilter] = useState<MatchStatus | "all">("all");

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded w-full mb-3"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-500 mb-4">{error.message}</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  if (!data || !data.completeSchedule || data.completeSchedule.length === 0) {
    return (
      <div className="text-gray-500">
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
        <div className="text-gray-500 p-4 text-center border rounded-md">
          No matches found for the selected filter.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-sm font-semibold mb-2 sticky top-0 bg-white py-2">
                {formatDate(date)}
              </h3>
              <div className="space-y-3">
                {matchesByDate[date].map((match) => (
                  <div
                    key={match.id}
                    className={`border rounded-lg p-3 ${
                      match.status === MatchStatus.LIVE
                        ? "border-blue-500 bg-blue-50"
                        : match.status === MatchStatus.COMPLETED
                        ? "border-gray-300 bg-gray-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">{match.time}</div>
                      <div
                        className={`text-xs px-2 py-0.5 rounded-full 
                        ${
                          match.status === MatchStatus.LIVE
                            ? "bg-blue-100 text-blue-800"
                            : match.status === MatchStatus.COMPLETED
                            ? "bg-gray-100 text-gray-800"
                            : "bg-green-100 text-green-800"
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
                      <TeamBadge team={match.team1} showName />
                      <span className="text-xs font-bold text-gray-400">
                        VS
                      </span>
                      <TeamBadge team={match.team2} showName />
                    </div>

                    <div className="text-xs text-gray-500">{match.venue}</div>

                    {match.result && (
                      <div className="mt-2 text-sm font-medium">
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
