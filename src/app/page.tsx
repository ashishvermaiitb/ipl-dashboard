import DashboardLayout from "./dashboard-layout";
import LiveMatchCard from "@/components/dashboard/live-match-card";
import PointsTable from "@/components/dashboard/points-table";
import UpcomingMatches from "@/components/dashboard/upcoming-matches";
import MatchSchedule from "@/components/dashboard/match-schedule";
import TeamStats from "@/components/dashboard/team-stats";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section
          id="live"
          className="bg-white rounded-lg shadow-sm p-4 md:p-6 dark:bg-gray-800"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Live Match
          </h2>
          <LiveMatchCard />
        </section>

        <section
          id="upcoming"
          className="bg-white rounded-lg shadow-sm p-4 md:p-6 dark:bg-gray-800"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Upcoming Matches
          </h2>
          <UpcomingMatches />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section
            id="points"
            className="bg-white rounded-lg shadow-sm p-4 md:p-6 dark:bg-gray-800"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Points Table
            </h2>
            <PointsTable />
          </section>

          <section
            id="team-stats"
            className="bg-white rounded-lg shadow-sm p-4 md:p-6 dark:bg-gray-800"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Team Statistics
            </h2>
            <TeamStats />
          </section>
        </div>

        <section
          id="schedule"
          className="bg-white rounded-lg shadow-sm p-4 md:p-6 dark:bg-gray-800"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Match Schedule
          </h2>
          <MatchSchedule />
        </section>
      </div>
    </DashboardLayout>
  );
}
