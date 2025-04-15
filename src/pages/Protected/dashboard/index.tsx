import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const DashboardSkeletonPage = dynamic(() =>
  import("~/components/dashboard/DashboardSkeleton").then((mod) => ({
    default: mod.DashboardSkeletonPage,
  }))
);

const DashboardCardsPage = React.lazy(() => import("~/components/dashboard/DashboardCards"));
const DrawResultsPage = React.lazy(() => import("~/components/dashboard/DrawResults"));
const TopBettingRegionPage = React.lazy(() => import("~/components/dashboard/TopBettingRegion"));
const TopWinningRegionPage = React.lazy(() => import("~/components/dashboard/TopWinningRegion"));
const SummaryBettorsBetsPlacedPage = React.lazy(() => import("~/components/dashboard/SummaryBettorsBetsPlaced"));
const SummaryWinnersDrawTimePage = React.lazy(() => import("~/components/dashboard/SummaryWinnersDrawTime"));

const DashboardPage = () => {
  return (
    <div className="space-y-4">
      <Suspense fallback={<DashboardSkeletonPage />}>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DashboardCardsPage />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full space-y-4">
            <div className="w-full flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              {/* Left Column */}
              <div className="flex-1 space-y-6">
                <DrawResultsPage />
                <TopBettingRegionPage />
                <TopWinningRegionPage />
              </div>

              {/* Right Column */}
              <div className="flex-2 space-y-6">
                <SummaryBettorsBetsPlacedPage />
                <SummaryWinnersDrawTimePage />
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default DashboardPage;
