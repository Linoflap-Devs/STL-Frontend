import React from "react";
import dynamic from "next/dynamic";
import { FormControl, InputLabel, MenuItem, Select, styled } from "@mui/material";
import { selectDrawStyles } from "~/styles/theme";
import HotNumberPage from "~/components/draw-summary/HotNumbers";
import DrawResultsSummaryPage from "~/components/draw-summary/DrawResultsSummary";
import ColdNumberPage from "~/components/draw-summary/ColdNumbers";
import DrawCounterTablePage from "~/components/draw-summary/DrawCounterTable";

const DashboardSkeletonPage = dynamic(() =>
  import("~/components/dashboard/DashboardSkeleton").then((mod) => ({
    default: mod.DashboardSkeletonPage,
  }))
);

const DrawListSummaryPage = React.lazy(
  () => import("~/components/draw-summary/DrawListSummary")
);

const DrawSelectedPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row mb-3">
        <h1 className="text-3xl font-bold">
          STL Pares Provincial Draw Summary
        </h1>
      </div>

      {/* Input Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* First Select */}
        <FormControl sx={selectDrawStyles} fullWidth>
          <InputLabel id="select-1-label">Option 1</InputLabel>
          <Select
            labelId="select-1-label"
            id="select-1"
            label="Option 1"
          >
            <MenuItem value="apple">Apple</MenuItem>
            <MenuItem value="banana">Banana</MenuItem>
            <MenuItem value="orange">Orange</MenuItem>
          </Select>
        </FormControl>

        {/* Second Select */}
        <FormControl sx={selectDrawStyles} fullWidth>
          <InputLabel id="select-2-label">Option 2</InputLabel>
          <Select
            labelId="select-2-label"
            id="select-2"
            label="Option 2"
          >
            <MenuItem value="apple">Apple</MenuItem>
            <MenuItem value="banana">Banana</MenuItem>
            <MenuItem value="orange">Orange</MenuItem>
          </Select>
        </FormControl>

        {/* Third Select */}
        <FormControl sx={selectDrawStyles} fullWidth>
          <InputLabel id="select-3-label">Option 3</InputLabel>
          <Select
            labelId="select-3-label"
            id="select-3"
            label="Option 3"
          >
            <MenuItem value="apple">Apple</MenuItem>
            <MenuItem value="banana">Banana</MenuItem>
            <MenuItem value="orange">Orange</MenuItem>
          </Select>
        </FormControl>

        {/* Fourth Select */}
        <FormControl sx={selectDrawStyles} fullWidth>
          <InputLabel id="select-4-label">Option 4</InputLabel>
          <Select
            labelId="select-4-label"
            id="select-4"
            label="Option 4"
          >
            <MenuItem value="apple">Apple</MenuItem>
            <MenuItem value="banana">Banana</MenuItem>
            <MenuItem value="orange">Orange</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="flex flex-col items-center gap-4m mt-2">
        <div className="flex flex-col w-full gap-4">
          <h1 className="text-3xl font-bold">
            Ilocos Norte - STL Swer2
          </h1>
          <div className="flex flex-col md:flex-row w-full gap-2">
            <div className="flex flex-col w-full md:w-2/3">
            <div>
              <p className="text-md font-bold mb-1">
                Draw Results
              </p>
              <DrawResultsSummaryPage />
              <div className="flex gap-2">
                <HotNumberPage />
                <ColdNumberPage />
              </div>
              <div className="flex gap-2 mt-5">
                <DrawCounterTablePage />
              </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="flex flex-col gap-4 w-full md:w-1/3">
              <DrawListSummaryPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawSelectedPage;
