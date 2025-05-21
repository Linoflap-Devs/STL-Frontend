import React, { useState } from "react";

const AACTaxesPage = () => {
  const [isAACShareOpen, setIsAACShareOpen] = useState(false);
  const [isTaxOpen, setIsTaxOpen] = useState(false);
  const [isNetIncomeTaxOpen, setNetIncomeTaxOpen] = useState(false);

  return (
    <div className="flex flex-col">

      <div className="mb-2">
        {/* Accordion Header */}
        <button
          onClick={() => setIsTaxOpen(!isTaxOpen)}
          className="w-full bg-[#F6BA12] p-2 rounded-md mt-2 grid grid-cols-1 md:grid-cols-2 items-center gap-2 text-left"
        >
          {/* Column 1 */}
          <div className="flex flex-col">
            <span className="text-sm font-bold">Taxes</span>
            <span className="text-sm font-medium">3.50%</span>
          </div>

          {/* Column 2 */}
          <div className="flex justify-center md:justify-end text-base font-semibold">
            ₱ 732,457.04 
            {/* {isTaxOpen ? "▲" : "▼"} */}
          </div>
        </button>

        {/* Accordion Content */}
        {!isTaxOpen && (
          <div className="bg-transparent border border-[#0038A8] p-2 rounded-md mt-3">
            <span className="text-sm font-bold">Tax Breakdown</span>

            {/* Breakdown Row 1 */}
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 items-center gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-bold">Gross AAC Share</span>
                <span className="text-sm font-medium">51.21%</span>
              </div>
              <div className="flex justify-center md:justify-end text-base font-semibold">
                ₱ 2,092,734.40
              </div>
            </div>

            {/* Breakdown Row 2 */}
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 items-center gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-bold">
                  Commission of Salesforce
                </span>
                <span className="text-sm font-medium">10%</span>
              </div>
              <div className="flex justify-center md:justify-end text-base font-semibold">
                ₱ 2,092,734.40
              </div>
            </div>

            {/* Breakdown Row 3 */}
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 items-center gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-bold">Net Prize Fund</span>
                <span className="text-sm font-medium">31.21%</span>
              </div>
              <div className="flex justify-center md:justify-end text-base font-semibold">
                ₱ 6,530,377.70
              </div>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default AACTaxesPage;
