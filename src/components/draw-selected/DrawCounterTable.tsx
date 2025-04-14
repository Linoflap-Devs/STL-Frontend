import React, { useState, useEffect } from "react";

// random number for now
const generateRandomNumbers = (length: number, min = 1, max = 100) => {
  const numbers = new Set<number>();
  while (numbers.size < length) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(num);
  }
  return Array.from(numbers);
};

const DrawCounterTablePage = () => {
  const [counterDraw, setCounterDraw] = useState<number[]>([]);

  useEffect(() => {
    const randomNumbers = generateRandomNumbers(32, 1, 100);
    setCounterDraw(randomNumbers);
  }, []);

  const isRightEdge = (index: number) => (index + 1) % 8 === 0;
  const isBottomEdge = (index: number) => index >= 24;

  return (
    <div className="bg-[#171717] rounded-xl text-white w-auto inline-block">
      <div className="grid grid-cols-8">
        {counterDraw.map((num, index) => (
          <div
            key={index}
            className={`relative p-6 flex flex-col items-center justify-center text-sm aspect-square
              ${!isRightEdge(index) ? "border-r" : ""}
              ${!isBottomEdge(index) ? "border-b" : ""}
              border-[#D5D5D5]`}
          >
            <div className="absolute top-1 left-1 text-xs text-gray-300 font-semibold p-[0.8px]">{index + 1}</div>
            <div className="text-white-400 font-bold text-2xl">{num}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawCounterTablePage;
