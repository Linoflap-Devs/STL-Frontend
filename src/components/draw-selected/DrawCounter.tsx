import React from "react";
import dayjs from "dayjs";
import { Divider } from "@mui/material";

const DrawCounterPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-4 mt-2">
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col md:flex-row w-full gap-4">
            {/* Left Column with 60% width */}
            <div className="flex flex-col gap-4 w-full md:w-3/5">
              <div className="bg-[#171717] p-4 rounded-xl flex items-center justify-center"></div>
            </div>

            {/* Right Column with 40% width */}
            <div className="flex flex-col gap-4 w-full md:w-2/5">
              <div className="bg-[#FF7A7A] p-4 rounded-xl flex items-center justify-center"></div>
              <div className="bg-[#67ABEB] p-4 rounded-xl flex items-center justify-center"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawCounterPage;
