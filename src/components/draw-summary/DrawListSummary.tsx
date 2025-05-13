import React from "react";

const MonthSummaryPage = React.lazy(
  () => import("~/components/draw-summary/MonthSummary")
);

const FirstSummaryPage = React.lazy(
  () => import("~/components/draw-summary/FirstSumarry")
);

const DrawListSummaryPage = () => {
  return (
    <React.Fragment>
      <h2 className="text-xl font-semibold">Ilocos Norte Draw List Summary</h2>
      <div className="min-h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MonthSummaryPage />
        <FirstSummaryPage />
        <FirstSummaryPage />
        <FirstSummaryPage />
      </div>
    </React.Fragment>
  );
};

export default DrawListSummaryPage;
