import React, { useState } from "react";
import AACTaxesPage from "~/components/retail-receipts/ACCSTaxes";
import GrossAACSharePage from "~/components/retail-receipts/GrossAACShare";
import GrossPSCOSharePage from "~/components/retail-receipts/GrossPSCOShare";
import NetAACIncomePage from "~/components/retail-receipts/NetAACIncome";
import NetPSCOIncomePage from "~/components/retail-receipts/NetPSCOIncome";
import PCSOTaxesPage from "~/components/retail-receipts/PCSOTaxes";
import CardsPage from "~/components/ui/dashboardcards/CardsData";

const RetailReceiptPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mx-auto px-0 py-1">
      <h1 className="text-3xl font-bold mb-3">STL Retail Receipt</h1>

      {/* Cards */}
      <CardsPage roleLabel={""} textlabel={""} dashboardData={[]} />

      <div className="flex gap-4 mb-4 mt-4">
        {/* Left column - 50% width */}
        <div className="flex flex-col w-1/2">
          <label
            htmlFor="operationDate"
            className="font-medium text-sm text-gray-700 mb-1"
          >
            Date of Report
          </label>
          <input
            id="operationDate"
            type="month"
            className="w-full border rounded px-3 py-2 text-sm bg-[#F8F0E3] border-[#0038A8]"
          />
        </div>

        {/* Right column - 50% width */}
        <div className="flex items-end w-1/2">
          <button className="w-full bg-[#F6BA12] p-2 rounded-md grid grid-cols-1 md:grid-cols-2 items-center gap-2 text-left">
            {/* Column 1 */}
            <div className="flex flex-col">
              <span className="text-sm font-bold">STL Collections</span>
            </div>

            {/* Column 2 */}
            <div className="flex justify-center md:justify-end text-base font-semibold">
              ₱ 20,927,344.00
            </div>
          </button>
        </div>
      </div>

      {/* Accordion content below */}
      {!isOpen && (
        <div className="flex gap-4">
          <div className="w-1/2">
            <GrossAACSharePage />
            <AACTaxesPage />
            <NetAACIncomePage />
          </div>
          <div className="w-1/2">
            <GrossPSCOSharePage />
            <PCSOTaxesPage />
            <NetPSCOIncomePage />
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailReceiptPage;
