"use client";

import { useIPLDataContext } from "@/components/data-provider";
import { TeamBadge } from "@/components/ui/team-badge";
import { Button } from "@/components/ui/button";

export default function PointsTable() {
  const { data, isLoading, error, refetch } = useIPLDataContext();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-full mb-4 dark:bg-gray-700"></div>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-200 rounded w-full mb-2 dark:bg-gray-700"
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

  if (!data || !data.pointsTable || data.pointsTable.length === 0) {
    return (
      <div className="text-gray-600 dark:text-gray-300">
        Points table data is not available at the moment.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 points-table">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider dark:text-gray-300"
            >
              Pos
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider dark:text-gray-300"
            >
              Team
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider dark:text-gray-300"
            >
              P
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider dark:text-gray-300"
            >
              W
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider dark:text-gray-300"
            >
              L
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider dark:text-gray-300"
            >
              T
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider dark:text-gray-300"
            >
              Pts
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider dark:text-gray-300"
            >
              NRR
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
          {data.pointsTable.map((entry, index) => (
            <tr
              key={entry.team.id}
              className={
                index < 4 ? "bg-blue-50 dark:bg-blue-900/20 playoff-zone" : ""
              }
            >
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {index + 1}
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <TeamBadge team={entry.team} showName />
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 text-center dark:text-gray-300">
                {entry.matches}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 text-center dark:text-gray-300">
                {entry.won}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 text-center dark:text-gray-300">
                {entry.lost}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 text-center dark:text-gray-300">
                {entry.tied}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-bold text-center text-gray-900 dark:text-white">
                {entry.points}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                <span
                  className={
                    entry.netRunRate > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {entry.netRunRate > 0 ? "+" : ""}
                  {entry.netRunRate.toFixed(3)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
        <span className="inline-block w-3 h-3 bg-blue-50 mr-1 border border-gray-200 dark:bg-blue-900/20 dark:border-gray-700"></span>
        Playoff Qualification Zone
      </div>
    </div>
  );
}
