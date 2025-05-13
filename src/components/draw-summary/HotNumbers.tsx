import React from "react";

const HotNumberPage = (data: {number: number}) => {
  const hotNumbers = [40];

  return (
    <React.Fragment>
      <div className="flex gap-3 mt-5">
        <div>
          <p className="text-sm text-[#c6242b] font-light mb-1">
            Hot Number
          </p>
          <div className="flex gap-2">
            <div className="w-fi bg-[#c6242b] rounded-sm px-10 py-8 flex items-center justify-center" >
              <p className="text-white font-bold text-3xl lg:text-5xl">{data.number}</p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HotNumberPage;
