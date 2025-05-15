// reusable card component for the dashboard
// This component is used to display the cards in the dashboard

import React from "react";
import { CardProps } from "~/types/interfaces"; // Import the CardProps type

export const Card = <T extends React.ReactNode>({ label, value, color, style }: CardProps<T>) => {
  return (
    <div
      className="px-4 py-[1.4rem] flex-[1_1_200px] rounded-lg border border-[#0038A8]"
      style={{
        backgroundColor: "transparent",
        ...style,
      }}
    >
      <p className="text-xs opacity-70">{label}</p>
      <p className="text-3xl font-bold leading-[1.1]">{value}</p>
    </div>
  );
};

export default Card;