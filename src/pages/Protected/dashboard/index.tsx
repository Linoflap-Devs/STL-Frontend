import React from "react";
import DrawResultsPage from "~/components/dashboard/DrawResults";
import BetSummaryTodayPage from "~/components/dashboard/BetSummaryToday";

const DashboardPage = () => {
  return (
    <div>
      <DrawResultsPage />
      <BetSummaryTodayPage/>
    </div>
  );
};

export default DashboardPage;