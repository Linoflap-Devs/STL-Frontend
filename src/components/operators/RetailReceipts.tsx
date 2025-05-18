import React, { useState } from "react";
import GrossAACSharePage from "../retail-receipts/GrossAACShare";

const RetailReceiptOperatorsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <div className="text-base font-bold mb-2">Retail Receipts</div>
      {/* Date of Report */}
      <div className="flex flex-col gap-1 mb-4">
        <label
          htmlFor="dateofReport"
          className="font-medium text-sm text-gray-700"
        >
          Date of Report
        </label>
        <input
          id="dateofReport"
          type="date"
          className={`w-full border rounded px-3 py-1.5 text-sm bg-[#F8F0E3] border-[#0038A8]`}
        />
      </div>

      {/* Start Accordion */}
      {/* this will be the main component, all will open if clicked */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#F6BA12] p-2 text-sm font-bold rounded-md w-full text-left"
      >
        STL COLLECTIONS
        {/* {isOpen ? "▲" : "▼"} */}
      </button>

      {isOpen && <GrossAACSharePage />}
    </div>
  );
};

export default RetailReceiptOperatorsPage;
