import React from "react";

const HotNumberPage = React.lazy(
  () => import("~/components/draw-selected/HotNumbers")
);
const ColdNumberPage = React.lazy(
  () => import("~/components/draw-selected/ColdNumbers")
);
const DrawCounterTablePage = React.lazy(
  () => import("~/components/draw-selected/DrawCounterTable")
);

const DrawCounterPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-4 mt-2">
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col md:flex-row w-full gap-4">
            {/* Left Column with 60% width */}
            <div className="flex flex-col gap-4 w-full md:w-3/5">
              <DrawCounterTablePage />
            </div>
            {/* Right Column with 40% width */}
            <div className="flex flex-col gap-4 w-full md:w-2/5">
              <HotNumberPage />
              <ColdNumberPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawCounterPage;
