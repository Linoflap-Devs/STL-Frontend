import React from "react";

const ColdNumberPage = () => {
  const coldNumbers = [36, 39, 32, 4, 23];

  return (
    <div className="flex gap-3 mt-5">
      <div>
        <p className="text-sm text-[#0038A8] font-light mb-1">
          Cold Number
        </p>
        <div className="flex gap-2">
          <div className="w-fi bg-[#0038A8] rounded-sm px-10 py-8 flex items-center justify-center" >
            <p className="text-white font-bold text-3xl lg:text-5xl">6</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdNumberPage;
