// tailwind

import { IconButton, Tooltip } from "@mui/material";
import React, { Suspense } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dynamic from "next/dynamic";

const DashboardSkeletonPage = dynamic(() =>
  import("~/components/dashboard/DashboardSkeleton").then((mod) => ({
    default: mod.DashboardSkeletonPage,
  }))
);

const LiveFeedTodayPage = React.lazy(
() => import("~/components/draw-selected/LiveFeedToday")
);

const DrawListSummaryPage = React.lazy(
  () => import("~/components/draw-selected/DrawListSummary")
);

const DrawCounterPage = React.lazy(
  () => import("~/components/draw-selected/DrawCounter")
);

const DrawSelectedPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<DashboardSkeletonPage />}>
        <div className="flex flex-row mb-3">
          <Tooltip title={"Back"}>
            <IconButton
              aria-label="close"
              href="/draw-summary"
              sx={{
                color: "#D1D5D8"[300],
                backgroundColor: "#171717",
                fontWeight: "bold",
                mr: 2,
              }}
              size="small"
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 23, fontWeight: "bold" }} />
            </IconButton>
          </Tooltip>

          <h1 className="text-3xl font-bold">
            STL Pares Provincial Draw Summary
          </h1>
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Month"
            //defaultValue={dayjs("2022-04-17")}
            views={["year", "month"]}
            sx={{ width: 250 }}
          />
        </LocalizationProvider>

        <div className="flex flex-col items-center gap-4m mt-2">
          <div className="flex flex-col w-full gap-4">
            <div className="flex flex-col md:flex-row w-full gap-4">
              {/* Left Column */}
              <div className="flex flex-col gap-4 w-full md:w-2/3">
                <LiveFeedTodayPage />
                <DrawCounterPage />
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-4 w-full md:w-1/3">
                <DrawListSummaryPage />
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default DrawSelectedPage;
