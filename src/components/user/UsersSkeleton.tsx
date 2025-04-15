import React from "react";

interface SkeletonCardProps {
  height?: string | number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ height = "110px" }) => (
  <div
    className="flex-[1_1_200px] bg-[#171717] rounded-lg m-0"
    style={{ height }}
  />
);

export const UsersSkeletonPage: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="h-5 w-[42%] bg-[#171717] rounded-lg" />
      ))}

      <div className="flex flex-wrap gap-4">
        {[...Array(5)].map((_, index) => (
          <SkeletonCard key={index} height="110px" />
        ))}
      </div>

      {[...Array(2)].map((_, index) => (
        <div key={index} className="flex flex-wrap gap-4">
          <SkeletonCard height="350px" />
        </div>
      ))}
    </div>
  );
};
