import React, { useState } from "react";
import { AACShare } from "./calculateShareTotals ";

interface GrossAACSharePageProps {
  totalPercentage: number;
  totalShareAmount: number;
  breakdown: AACShare[];
}

const GrossAACSharePage: React.FC<GrossAACSharePageProps> = ({
  totalPercentage,
  totalShareAmount,
  breakdown,
}) => {
  const [isAACShareOpen, setIsAACShareOpen] = useState(false);
  //console.log("HIIIELLOOO", breakdown);

const defaultBreakdown = [
  { ShareTitle: "Authorized Agent Share", Percentage: 0, ShareAmount: 0 },
  { ShareTitle: "Commission of Salesforce", Percentage: 0, ShareAmount: 0 },
  { ShareTitle: "Net Prize fund", Percentage: 0, ShareAmount: 0 },
];

const breakdownToShow = breakdown && breakdown.length > 0 ? breakdown : defaultBreakdown;
  return (
    <div className="flex flex-col">
      <div className="mb-2">
        <button
          onClick={() => setIsAACShareOpen(!isAACShareOpen)}
          className="w-full bg-[#F6BA12] p-2 rounded-md grid grid-cols-1 md:grid-cols-2 items-center gap-2 text-left">
          <div className="flex flex-col">
            <span className="text-sm font-bold">Gross AAC Share</span>
            <span className="text-sm font-medium">
              {totalPercentage.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-center md:justify-end text-base font-semibold">
            ₱{" "}
            {totalShareAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            {/* {isAACShareOpen ? "▲" : "▼"} */}
          </div>
        </button>

        {/* Accordion Content */}
        {!isAACShareOpen && (
          <div className="bg-transparent border border-[#0038A8] p-2 rounded-md mt-3">
            <span className="text-sm font-bold">AAC Share Breakdown</span>

            {/* Breakdown List */}
              {breakdownToShow.map((item, index) => (
                <div
                  key={index}
                  className="mt-2 grid grid-cols-1 md:grid-cols-2 items-center gap-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{item.ShareTitle ?? "N/A"}</span>
                    <span className="text-sm font-medium">{item.Percentage ?? 0}%</span>
                  </div>
                  <div className="flex justify-center md:justify-end text-base font-semibold">
                    ₱{" "}
                    {(item.ShareAmount ?? 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              ))} 

          </div>
        )}
      </div>
    </div>
  );
};

export default GrossAACSharePage;
