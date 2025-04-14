import React from "react";

const ColdNumberPage = () => {
  const coldNumbers = [36, 39, 32, 4, 23];

  return (
    <>
      <div className="bg-[#67ABEB] p-4 rounded-xl text-start">
        <h6 className="text-[#171717] text-sm font-bold mb-1">Cold Numbers</h6>
        <div className="flex flex-wrap gap-2">
          {coldNumbers.map((item, index) => (
            <div key={index} className="text-[#171717] text-2xl font-bold bg-transparent px-1 rounded">
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ColdNumberPage;
