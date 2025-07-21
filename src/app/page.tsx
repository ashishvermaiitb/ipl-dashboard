// src/app/page.tsx
import DashboardLayout from "./dashboard-layout";
import LiveMatchCard from "@/components/dashboard/live-match-card";
import PointsTable from "@/components/dashboard/points-table";
import UpcomingMatches from "@/components/dashboard/upcoming-matches";
import MatchSchedule from "@/components/dashboard/match-schedule";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section id="live" className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h2 className="text-xl font-bold mb-4">Live Match</h2>
          <LiveMatchCard />
        </section>

        <section
          id="upcoming"
          className="bg-white rounded-lg shadow-sm p-4 md:p-6"
        >
          <h2 className="text-xl font-bold mb-4">Upcoming Matches</h2>
          <UpcomingMatches />
        </section>

        <section
          id="points"
          className="bg-white rounded-lg shadow-sm p-4 md:p-6"
        >
          <h2 className="text-xl font-bold mb-4">Points Table</h2>
          <PointsTable />
        </section>

        <section
          id="schedule"
          className="bg-white rounded-lg shadow-sm p-4 md:p-6"
        >
          <h2 className="text-xl font-bold mb-4">Match Schedule</h2>
          <MatchSchedule />
        </section>
      </div>
    </DashboardLayout>
  );
}
