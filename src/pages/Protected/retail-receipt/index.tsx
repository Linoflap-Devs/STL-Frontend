import { Button } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import AACTaxesPage from "~/components/retail-receipts/ACCSTaxes";
import { processShares } from "~/components/retail-receipts/calculateShareTotals";
import GrossAACSharePage from "~/components/retail-receipts/GrossAACShare";
import GrossPSCOSharePage from "~/components/retail-receipts/GrossPSCOShare";
import NetAACIncomePage from "~/components/retail-receipts/NetAACIncome";
import NetPSCOIncomePage from "~/components/retail-receipts/NetPSCOIncome";
import PCSOTaxesPage from "~/components/retail-receipts/PCSOTaxes";
import Card from "~/components/ui/dashboardcards/Cards";
import { buttonStyles } from "~/styles/theme";
import { Share } from "~/types/types";
import { fetchRetailReceiptsDashboard, fetchRetailReceipts } from "~/utils/api/transactions";

const RetailReceiptPage = () => {
  const [aacTotalPercentage, setAacTotalPercentage] = useState(0);
  const [aacTotalShareAmount, setAacTotalShareAmount] = useState(0);
  const [aacBreakdown, setAacBreakdown] = useState<Share[]>([]);

  const [pcsoTotalPercentage, setPcsoTotalPercentage] = useState(0);
  const [pcsoTotalShareAmount, setPcsoTotalShareAmount] = useState(0);
  const [pcsoBreakdown, setPcsoBreakdown] = useState<Share[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  // set default current month
  const [operationDate, setOperationDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  const AAC_TITLES = [
    "Authorized Agent Share",
    "Commission of Salesforce",
    "Net Prize fund",
  ];

  const PCSO_TITLES = [
    "PCSO Share",
    "Printing cost to PCSO",
    "PCSO Charity fund",
    "PCSO Operating fund",
  ];

  const [receiptDataMetrics, setReceiptDataMetrics] = useState<{
    TotalBets: number;
    TotalBettors: number;
    TotalPayout: number;
    TotalRevenue: number;
    TotalWinners: number;
  } | null>(null);

  const [receiptData, setReceiptData] = useState<any | null>(null);

  // Fetch dashboard metrics on operationDate change
  useEffect(() => {
    const [year, month] = operationDate.split("-");
    fetchRetailReceiptsDashboard(Number(year), Number(month)).then((res) => {
      if (res?.success) {
        setReceiptDataMetrics(res.data);
      }
    });
  }, [operationDate]);

  // calculated total month
  const calculatedReceipt = useMemo(() => {
    if (!receiptDataMetrics) return [];

    const formatPeso = (amount: number) => `₱ ${amount.toLocaleString()}`;
    const formatNumber = (value: number) => value.toLocaleString();

    return [
      { label: "Total Bets", value: formatPeso(receiptDataMetrics.TotalBets) },
      {
        label: "Total Bettors",
        value: formatNumber(receiptDataMetrics.TotalBettors),
      },
      {
        label: "Total Payout",
        value: formatPeso(receiptDataMetrics.TotalPayout),
      },
      {
        label: "Total Revenue",
        value: formatPeso(receiptDataMetrics.TotalRevenue),
      },
      {
        label: "Total Winners",
        value: formatNumber(receiptDataMetrics.TotalWinners),
      },
    ];
  }, [receiptDataMetrics]);

  // /transactions/getRetailReceipts/:year/:month for AAC and PCSO receipts
  useEffect(() => {
    const [year, month] = operationDate.split("-");
    fetchRetailReceipts(Number(year), Number(month)).then((data) => {
      if (data?.success) {
        console.log("[RetailReceipts] Full data:", data.data);
        setReceiptData(data.data);
      }
    });
  }, [operationDate]);

  useEffect(() => {
    const [year, month] = operationDate.split("-").map(Number);

    fetchRetailReceipts(year, month).then((response) => {
      if (response?.success) {
        // Process AAC shares (ShareType = 1)
        const aac = processShares(
          response?.data?.Receipts?.AAC,
          AAC_TITLES,
          year,
          month,
          1
        );
        setAacBreakdown(aac.breakdown);
        setAacTotalPercentage(aac.totalPercentage);
        setAacTotalShareAmount(aac.totalShareAmount);

        // Process PCSO shares (ShareType = 2)
        const pcso = processShares(
          response?.data?.Receipts?.PCSO,
          PCSO_TITLES,
          year,
          month,
          1
        );
        setPcsoBreakdown(pcso.breakdown);
        setPcsoTotalPercentage(pcso.totalPercentage);
        setPcsoTotalShareAmount(pcso.totalShareAmount);
      }
    });
  }, [operationDate]);

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
      {calculatedReceipt.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-3">
          {calculatedReceipt.map((item, index) => (
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
              ₱ {receiptData?.Collections?.toLocaleString() || "0.00"}
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
            <GrossAACSharePage
              totalPercentage={aacTotalPercentage}
              totalShareAmount={aacTotalShareAmount}
              breakdown={aacBreakdown}
            />
            <AACTaxesPage />
            <NetAACIncomePage />
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2">
            <GrossPSCOSharePage
              totalPercentage={pcsoTotalPercentage}
              totalShareAmount={pcsoTotalShareAmount}
              breakdown={pcsoBreakdown}
            />
            <PCSOTaxesPage />
            <NetPSCOIncomePage />
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailReceiptPage;
