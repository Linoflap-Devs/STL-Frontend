import React, { useState } from "react";

const NetAACIncomePage = () => {
  const [isNetIncomeTaxOpen, setNetIncomeTaxOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="mb-2">
        {/* Accordion Header */}
        <div
          className="w-full bg-[#E97451] text-white p-2 rounded-md mt-2 grid grid-cols-1 md:grid-cols-2 items-center gap-2 text-left"
        >
          {/* Column 1 */}
          <div className="flex flex-col">
            <span className="text-sm font-bold">Net AAC Income</span>
            <span className="text-sm font-medium">47.71%</span>
          </div>

          {/* Column 2 */}
          <div className="flex justify-center md:justify-end text-base font-semibold">
            ₱ 9,983,389.46
            {/* {isNetIncomeTaxOpen ? "▲" : "▼"} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetAACIncomePage;
