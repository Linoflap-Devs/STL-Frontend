// tailwind start

import React, { Suspense } from 'react';
import SearchIcon from "@mui/icons-material/Search";
import { searchContainerClass, searchInputClass } from "~/styles/tailwindClasses";

const DrawSummaryCardsPage = React.lazy(() => import("~/components/draw-summary/DrawSummaryCards"));

const DrawSummaryPage: React.FC = () => {
  return (
    <>
      <Suspense fallback={<DrawSummaryCardsPage />}>
        <div className="p-4">
          <div className="flex flex-row justify-between items-center mb-[1.5rem]">
            <h4 className="text-4xl font-bold">STL Pares Draw Summary</h4>
          </div>
          <div className={searchContainerClass}>
            <SearchIcon className="text-[#D5D5D5] mr-2" />
            <input
              type="text"
              placeholder="Search"
              className={searchInputClass}
            />
          </div>
          <div className="mt-[1.5rem]">
            <DrawSummaryCardsPage />
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default DrawSummaryPage;