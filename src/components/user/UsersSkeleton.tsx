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
        <div key={index} className="h-4 w-[43%] bg-[#171717] rounded-lg" />
      ))}

      <div className="flex flex-wrap gap-3">
        {[...Array(5)].map((_, index) => (
          <SkeletonCard key={index} height="99px" />
        ))}
      </div>

      {[...Array(2)].map((_, index) => (
        <div key={index} className="flex flex-wrap gap-3">
          <SkeletonCard height="345px" />
        </div>
      ))}
    </div>
  );
};
