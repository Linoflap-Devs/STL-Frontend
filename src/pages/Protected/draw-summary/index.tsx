// tailwind start

import React, { Suspense } from 'react';
import SearchIcon from "@mui/icons-material/Search";

const DrawSummaryCardsPage = React.lazy(() => import("~/components/draw-summary/DrawSummaryCards"));

const DrawSummaryPage: React.FC<{gameCategoryId?:number}> = ({ gameCategoryId }) => {
  console.log('Game Category: ', gameCategoryId)

  const gameCategoryMapping: Record<number, string> = {
    1: 'STL Pares',
    2: 'STL Swer2',
    3: 'STL Swer3',
    4: 'STL Swer4',
  }

  const gameCategoryName = gameCategoryId ? gameCategoryMapping[gameCategoryId] : 'Unknown'
  return (
    <>
      <Suspense fallback={<DrawSummaryCardsPage />}>
        <div>
          <div className="flex flex-row justify-between items-center mb-[1.5rem]">
            <h4 className="text-3xl font-bold">{gameCategoryName} Draw Summary</h4>
          </div>
          <div className="flex items-center w-80 border border-[#D5D5D5] bg-[#212121] rounded-lg px-3 py-2">
            <SearchIcon className="text-[#D5D5D5] mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-white w-full focus:outline-none"
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