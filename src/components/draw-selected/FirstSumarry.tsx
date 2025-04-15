import React from "react";
import { Divider } from "@mui/material";

const FirstSummaryPage = () => {
  const firstDraw = [1, 2, 3, 4, 45];
  const secondDraw = [1, 2, 3, 4, 23];

  return (
    <div className="bg-[#171717] py-5 px-3 rounded-xl text-white w-full max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-semibold text-center">FIRST</h2>
      <Divider
        sx={{ backgroundColor: "#B3B3B3", opacity: 1, height: "2px", my: 0.5 }}
      />
      <div className="mt-4 space-y-2 text-center">
        {firstDraw.map((item, index) => (
          <div key={index}>
            <div className="flex justify-center gap-x-8 text-lg text-gray-300">
              <span>{item}</span>
              <span>{secondDraw[index]}</span>
            </div>
            <Divider
              sx={{
                backgroundColor: "#B3B3B3",
                opacity: 1,
                height: "2px",
                my: 0.5,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FirstSummaryPage;
