import React from "react";
import { NetIncomePageProps } from "~/types/types";

const NetAACIncomePage: React.FC<NetIncomePageProps> = ({
  netAmount,
  netPercentage,
}) => {
  return (
    <div className="flex flex-col">
      <div className="mb-2">
        <div
          className="w-full bg-[#E97451] text-white p-2 rounded-md mt-2 grid grid-cols-1 md:grid-cols-2 items-center gap-2 text-left"
        >
          <div className="flex flex-col">
            <span className="text-sm font-bold">Net AAC Income</span>
            <span className="text-sm font-medium">{netPercentage.toFixed(2)}%</span>
          </div>
          <div className="flex justify-center md:justify-end text-base font-semibold">
            ₱ {netAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            {/* {isNetIncomeTaxOpen ? "▲" : "▼"} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetAACIncomePage;
