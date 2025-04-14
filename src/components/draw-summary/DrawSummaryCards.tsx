import React, { Suspense } from 'react';
import DrawSummaryPage from '~/pages/Protected/draw-summary';

const drawData = [
  { id: 1, title: "Ilocos Norte", hasLive: true },
  { id: 2, title: "Ilocos Sur", hasLive: false },
  { id: 3, title: "La Union", hasLive: true },
  { id: 4, title: "Pangasinan", hasLive: false },
  { id: 4, title: "Cagayan", hasLive: false },
];

const drawResults = [
  { title: "1st Draw", numbers1: [39], numbers2: [14] },
  { title: "2nd Draw", numbers1: [45], numbers2: [92] },
  { title: "3rd Draw", numbers1: [11], numbers2: [17] },
];

const DrawCardsPage: React.FC = () => {
  return (
    <>
      <Suspense fallback={<DrawSummaryPage />}>
        <h3 className="text-xl font-bold my-4">Region I - Ilocos Region</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {drawData.map((draw) => (
            <div key={draw.id}>
              <div className="relative w-full h-48 bg-[#D5D5D5] group overflow-hidden rounded-t-lg">
                {draw.hasLive && (
                  <div className="absolute top-2 right-2 bg-[#FF7A7A] text-[#171717] text-sm font-bold px-4 py-1 rounded-[16px] z-10">
                    Live
                  </div>
                )}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
                <a href="/draw-selected" className="absolute inset-0 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-00">
                  View Draw Feed
                </a>
              </div>
              <div className="p-4 pt-3 flex flex-col flex-grow justify-between bg-[#171717] rounded-b-lg">
                <h3 className="text-lg font-bold">{draw.title}</h3>
                {/* Draw Cards */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                  {drawResults.map((draw, index) => (
                    <div key={index}>
                      <h3 className="text-md mt-1">{draw.title}</h3>
                      <div className="flex gap-2">
                        {/* First set of numbers */}
                        <div className="flex gap-1">
                          {draw.numbers1.map((num, i) => (
                            <div key={`set1-${index}-${i}`} className="inline-flex items-center justify-center min-w-fit px-2 py-2 h-[40px] bg-[#2F2F2F] text-white text-xl rounded-lg">
                              {num}
                            </div>
                          ))}
                        </div>
                        {/* Second set of numbers */}
                        <div className="flex gap-1">
                          {draw.numbers2.map((num, i) => (
                            <div key={`set2-${index}-${i}`} className="inline-flex items-center justify-center min-w-fit px-2 py-2 h-[40px] bg-[#2F2F2F] text-white text-xl rounded-lg">
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Suspense>
    </>
  );
};

export default DrawCardsPage;
