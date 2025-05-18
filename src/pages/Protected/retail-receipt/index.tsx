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

      {/* STL COLLECTIONS REPORT */}
      <div className="flex gap-4 mb-4 mt-4">
        {/* Left column - 50% width */}
        <div className="flex flex-col w-1/2">
          <label
            htmlFor="operationDate"
            className="font-medium text-sm text-gray-700"
          >
            Date of Report
          </label>
          <input
            id="operationDate"
            type="date"
            className="w-full border rounded px-3 py-2 text-sm bg-[#F8F0E3] border-[#0038A8]"
          />
        </div>

        {/* Right column - 50% width */}
        <div className="flex items-end w-1/2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-[#F6BA12] p-2 pb-3 text-sm font-bold rounded-md w-full"
          >
            STL COLLECTIONS
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
