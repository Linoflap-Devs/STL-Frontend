import React from "react";
import dayjs from "dayjs";
import { Divider } from "@mui/material";

const MonthSummaryPage = () => {
  const currentMonth = dayjs();
  const daysInMonth = currentMonth.daysInMonth();
  const monthName = currentMonth.format("MMMM");

  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-[#171717] py-5 px-3 rounded-xl text-white w-full max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-semibold">{monthName.toUpperCase()}</h2>
      <Divider
        sx={{ backgroundColor: "#B3B3B3", opacity: 1, height: "2px", my: 0.5 }}
      />
      <ul className="space-y-2 mt-4">
        {dayNumbers.map((day, index) => (
          <li key={index} className="text-lg text-gray-300">
            {day}
            <Divider
              sx={{
                backgroundColor: "#B3B3B3", 
                opacity: 1,
                height: "2px",
                my: 0.5,
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthSummaryPage;
