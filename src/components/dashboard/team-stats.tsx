"use client";

import { useState } from "react";
import { useIPLDataContext } from "@/components/data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamBadge } from "@/components/ui/team-badge";
import { Button } from "@/components/ui/button";

export default function TeamStats() {
  const { data, isLoading, error } = useIPLDataContext();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-60 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  // Get team stats from points table
  const teams = data.teams;
  const pointsTable = data.pointsTable;

  // Calculate win percentage for each team
  const teamStats = pointsTable.map((entry) => {
    const winPercentage =
      entry.matches > 0 ? (entry.won / entry.matches) * 100 : 0;

    return {
      team: entry.team,
      matches: entry.matches,
      won: entry.won,
      lost: entry.lost,
      tied: entry.tied,
      winPercentage: Math.round(winPercentage * 100) / 100,
      points: entry.points,
      netRunRate: entry.netRunRate,
    };
  });

  const selectedTeamStats = selectedTeam
    ? teamStats.find((stats) => stats.team.id === selectedTeam)
    : null;

  // Get matches for selected team
  const teamMatches =
    selectedTeam && data.completeSchedule
      ? data.completeSchedule
          .filter(
            (match) =>
              match.team1.id === selectedTeam || match.team2.id === selectedTeam
          )
          .slice(0, 5)
      : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {teams.map((team) => (
            <Button
              key={team.id}
              variant={selectedTeam === team.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTeam(team.id)}
              className="min-w-[4rem]"
            >
              <TeamBadge team={team} size="sm" />
            </Button>
          ))}
        </div>

        {selectedTeamStats ? (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <TeamBadge team={selectedTeamStats.team} size="lg" showName />
              <div className="text-lg font-bold">
                {selectedTeamStats.points} pts
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-md text-center">
                <div className="text-xs text-gray-500 mb-1">MATCHES</div>
                <div className="font-bold text-gray-500">
                  {selectedTeamStats.matches}
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-md text-center">
                <div className="text-xs text-gray-500 mb-1">WON</div>
                <div className="font-bold text-blue-600">
                  {selectedTeamStats.won}
                </div>
              </div>
              <div className="p-3 bg-red-50 rounded-md text-center">
                <div className="text-xs text-gray-500 mb-1">LOST</div>
                <div className="font-bold text-red-600">
                  {selectedTeamStats.lost}
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-md text-center">
                <div className="text-xs text-gray-500 mb-1">WIN %</div>
                <div className="font-bold text-purple-600">
                  {selectedTeamStats.winPercentage}%
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">NET RUN RATE</h4>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    selectedTeamStats.netRunRate > 0
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      Math.abs(selectedTeamStats.netRunRate) * 20,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-1 text-right text-sm">
                <span
                  className={
                    selectedTeamStats.netRunRate > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {selectedTeamStats.netRunRate > 0 ? "+" : ""}
                  {selectedTeamStats.netRunRate.toFixed(3)}
                </span>
              </div>
            </div>

            {teamMatches.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">
                  RECENT & UPCOMING MATCHES
                </h4>
                <div className="space-y-2">
                  {teamMatches.map((match) => (
                    <div
                      key={match.id}
                      className="text-xs p-2 border rounded-md"
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          {match.date} • {match.time}
                        </span>
                        <span className="text-gray-500">{match.status}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <TeamBadge team={match.team1} size="sm" showName />
                        <span className="font-bold text-gray-500">VS</span>
                        <TeamBadge team={match.team2} size="sm" showName />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            Select a team to view statistics
          </div>
        )}
      </CardContent>
    </Card>
  );
}
