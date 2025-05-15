import React from "react";
import { Divider } from "@mui/material";

const FirstSummaryPage = (data: {
    drawOrder: number, 
    values: string[][]
  }) => {
  const firstDraw = [1, 2, 3, 4, 45];
  const secondDraw = [1, 2, 3, 4, 23];

  return (
    <div className="bg-[#0038A8] py-5 px-3 rounded-xl text-white w-full max-w-2xl mx-auto text-center">
      <h2 className="text-md font-semibold text-center">{
        data.drawOrder === 1 ? "FIRST" : data.drawOrder === 2 ? "SECOND" : "THIRD"  
      }</h2>
      <Divider
        sx={{ backgroundColor: "#B3B3B3", opacity: 1, height: "2px", my: 0.5 }}
      />
      <div className="mt-4 space-y-2 text-center">
        {data.values.map((item, index) => (
          <div key={index}>
            <div className="flex justify-center gap-x-8 text-lg text-gray-300">
              {
                item.map((item, index) => (
                  <span key={index}>{item}</span>
                ))
              }
              {/* <span>{item}</span>
              <span>{secondDraw[index]}</span> */}
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
