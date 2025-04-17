import React from "react";

const HotNumberPage = () => {
  const hotNumbers = [40, 42, 32, 4, 23];

  return (
    <React.Fragment>
      <div className="bg-[#FF7A7A] p-4 rounded-xl text-start">
        <h6 className="text-[#171717] text-sm font-bold mb-1">Hot Numbers</h6>
        <div className="flex flex-wrap gap-2">
          {hotNumbers.map((item, index) => (
            <div key={index} className="text-[#171717] text-2xl font-bold bg-transparent px-1 rounded">
              {item}
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default HotNumberPage;
