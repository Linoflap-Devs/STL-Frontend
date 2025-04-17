import React from "react";

const LiveFeedTodayPage = () => {
  return (
    <React.Fragment>
      <h2 className="text-xl font-semibold">Ilocos Norte Live Feed Today</h2>
      <div className="relative bg-[#D5D5D5] rounded-lg text-white p-4 h-80">
        <div className="absolute top-3 right-3 bg-[#FF7A7A] text-[#171717] text-sm font-bold px-5 py-1 rounded-[16px] z-10">
          Live
        </div>
      </div>
    </React.Fragment>
  );
};

export default LiveFeedTodayPage;
