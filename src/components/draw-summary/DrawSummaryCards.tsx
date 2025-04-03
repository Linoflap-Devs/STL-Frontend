import React, { Suspense } from 'react';
import { drawResultCard, oneLineCode, blackOpacityHover, visibleOnHover, secondPartCard, firstPartCard, badgeLiveStyle } from "../../styles/tailwindClasses";

const UsersSkeletonPage = React.lazy(() => import("~/components/user/UsersSkeleton"));

const drawData = [
  { id: 1, title: "Ilocos Norte", hasLive: true },
  { id: 2, title: "Ilocos Sur", hasLive: false },
  { id: 3, title: "La Union", hasLive: true },
  { id: 4, title: "Pangasinan", hasLive: false },
];

const drawResults = [
  { title: "1st Draw", numbers1: [39], numbers2: [14] },
  { title: "2nd Draw", numbers1: [45], numbers2: [92] },
  { title: "3rd Draw", numbers1: [11], numbers2: [17] },
];

const DrawCardsPage: React.FC = () => {
  return (
    <>
      <Suspense fallback={<UsersSkeletonPage />}>
        <h3 className="text-xl font-bold my-4">Region I - Ilocos Region</h3>
        <div className={oneLineCode}>
          {drawData.map((draw) => (
            <div key={draw.id}>
              <div className={firstPartCard}>
                {/* Conditionally render Live Badge */}
                {draw.hasLive && (
                  <div className={badgeLiveStyle}>
                    Live
                  </div>
                )}
                <div className={blackOpacityHover}></div>
                <a href="#" className={visibleOnHover}>
                  View Draw Feed
                </a>
              </div>
              <div className={secondPartCard}>
                <h3 className="text-lg font-bold">{draw.title}</h3>
                {/* Draw Cards */}
                <div className={oneLineCode}>
                  {drawResults.map((draw, index) => (
                    <div key={index}>
                      <h3 className="text-md mt-1">{draw.title}</h3>
                      <div className="flex gap-2">
                        {/* First set of numbers */}
                        <div className="flex gap-1">
                          {draw.numbers1.map((num, i) => (
                            <div key={`set1-${index}-${i}`} className={drawResultCard}>
                              {num}
                            </div>
                          ))}
                        </div>
                        {/* Second set of numbers */}
                        <div className="flex gap-1">
                          {draw.numbers2.map((num, i) => (
                            <div key={`set2-${index}-${i}`} className={drawResultCard}>
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
