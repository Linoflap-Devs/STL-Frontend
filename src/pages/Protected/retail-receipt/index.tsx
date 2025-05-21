import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import AACTaxesPage from "~/components/retail-receipts/ACCSTaxes";
import GrossAACSharePage from "~/components/retail-receipts/GrossAACShare";
import GrossPSCOSharePage from "~/components/retail-receipts/GrossPSCOShare";
import NetAACIncomePage from "~/components/retail-receipts/NetAACIncome";
import NetPSCOIncomePage from "~/components/retail-receipts/NetPSCOIncome";
import PCSOTaxesPage from "~/components/retail-receipts/PCSOTaxes";
import Card from "~/components/ui/dashboardcards/Cards";
import { buttonStyles } from "~/styles/theme";
import { fetchRetailReceipts } from "~/utils/api/transactions";

const RetailReceiptPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [operationDate, setOperationDate] = useState<string>("2025-05"); // Default to May 2025
  const [receiptDataMetrics, setReceiptDataMetrics] = useState<null | {
    TotalBets: number;
    TotalBettors: number;
    TotalPayout: number;
    TotalRevenue: number;
    TotalWinners: number;
  }>(null);

  useEffect(() => {
    const [year, month] = operationDate.split("-");
    fetchRetailReceipts(Number(year), Number(month)).then((data) => {
      if (data?.success) {
        setReceiptDataMetrics(data.data);
      }
    });
  }, [operationDate]);

  const calculatedCardData = receiptDataMetrics
  ? [
      { label: "Total Bets", value: `₱ ${receiptDataMetrics.TotalBets.toLocaleString()}` },
      { label: "Total Bettors", value: receiptDataMetrics.TotalBettors.toLocaleString() },
      { label: "Total Payout", value: `₱ ${receiptDataMetrics.TotalPayout.toLocaleString()}` },
      { label: "Total Revenue", value: `₱ ${receiptDataMetrics.TotalRevenue.toLocaleString()}` },
      { label: "Total Winners", value: receiptDataMetrics.TotalWinners.toLocaleString() },
    ]
  : [];


  return (
    <div className="mx-auto px-0 py-1">
      <h1 className="text-3xl font-bold mb-3">STL Retail Receipt</h1>
      <div className="flex gap-4 mb-4">
        <div className="w-1/2">
          <div className="flex flex-col">
            <label
              htmlFor="operationDate"
              className="font-medium text-[#0038A8] text-sm mb-1"
            >
              Date of Report
            </label>
            <input
              id="operationDate"
              type="month"
              value={operationDate}
              onChange={(e) => setOperationDate(e.target.value)}
              className="w-64 border rounded px-3 py-2 text-sm bg-[#F8F0E3] border-[#0038A8]"
            />
          </div>
        </div>
        <div className="w-1/2 flex items-end justify-end">
          <div className="flex gap-2">
            <Button sx={buttonStyles} variant="contained">
              Export as CSV
            </Button>
            <Button sx={buttonStyles} variant="contained">
              Export as PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Cards */}
      {calculatedCardData.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-3">
          {calculatedCardData.map((item, index) => (
            <Card key={index} label={item.label} value={item.value} />
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-8 mb-3">
        <div className="w-1/2">
          <div className="w-full bg-[#F6BA12] p-2 rounded-md grid grid-cols-1 md:grid-cols-2 items-center gap-2 text-left">
            <div className="flex flex-col">
              <span className="text-sm font-bold">STL Collections</span>
            </div>
            <div className="flex justify-center md:justify-end text-base font-semibold">
              ₱ 20,927,344.00
            </div>
          </div>
        </div>
        <div className="w-1/2"></div>
      </div>

      {/* Accordion content below */}
      {!isOpen && (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Column */}
          <div className="w-full md:w-1/2">
            <GrossAACSharePage />
            <AACTaxesPage />
            <NetAACIncomePage />
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2">
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
