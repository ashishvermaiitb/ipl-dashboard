"use client";

import { useState, useEffect } from "react";
import { LiveMatch, Score } from "@/types/ipl";
import { TeamBadge } from "@/components/ui/team-badge";
import { Loading } from "@/components/ui/loading";

interface RealTimeScoreProps {
  match: LiveMatch;
  refreshInterval?: number;
}

export default function RealTimeScore({
  match,
  refreshInterval = 15000, // 15 seconds by default
}: RealTimeScoreProps) {
  const [liveData, setLiveData] = useState(match);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState(refreshInterval / 1000);

  const fetchLatestScore = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/scrape");

      if (!response.ok) {
        throw new Error("Failed to fetch latest score");
      }

      const data = await response.json();

      if (data.liveMatch) {
        setLiveData(data.liveMatch);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error fetching live score:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Reset countdown and trigger fetch
          fetchLatestScore();
          return refreshInterval / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval]);

  // Format score display
  const formatScore = (score?: Score) => {
    if (!score) return "-";

    const oversDisplay =
      score.overs % 1 === 0 ? score.overs.toFixed(0) : score.overs.toFixed(1);

    return `${score.runs}/${score.wickets} (${oversDisplay})`;
  };

  const isTeam1Batting =
    !!liveData.team1Score &&
    (!liveData.team2Score || liveData.team2Score.overs < 20);

  const isTeam2Batting = !!liveData.team2Score;

  return (
    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800/50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          LIVE SCORE
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
          <span>Refreshing in {countdown}s</span>
          {loading && <Loading size="sm" />}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TeamBadge team={liveData.team1} size="md" showName />
            {isTeam1Batting && (
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </div>
          <div className="font-bold text-gray-900 dark:text-white">
            {formatScore(liveData.team1Score)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TeamBadge team={liveData.team2} size="md" showName />
            {isTeam2Batting && (
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </div>
          <div className="font-bold text-gray-900 dark:text-white">
            {formatScore(liveData.team2Score)}
          </div>
        </div>
      </div>

      {/* Recent Overs */}
      {liveData.recentOvers && liveData.recentOvers.length > 0 && (
        <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-800/50">
          <h4 className="text-xs font-semibold mb-1 text-gray-800 dark:text-gray-200">
            RECENT OVERS
          </h4>
          <div className="flex flex-wrap gap-1">
            {liveData.recentOvers.flatMap((over, idx) =>
              over.runs.map((run, i) => (
                <span
                  key={`${idx}-${i}`}
                  className={`w-5 h-5 flex items-center justify-center rounded-full text-xs
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
              ))
            )}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-3 text-xs text-gray-700 dark:text-gray-400 text-right">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
}
