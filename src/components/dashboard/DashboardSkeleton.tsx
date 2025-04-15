import { Box, Grid } from "@mui/material";
import { cardDashboardStyles } from "~/styles/theme";

interface SkeletonCardProps {
  height?: string | number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ height = "110px" }) => (
  <div
    className="flex-[1_1_200px] bg-[#171717] rounded-lg m-0"
    style={{ height }}
  />
);

export const DashboardSkeletonPage: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      {/* Top Line Skeletons */}
      {[...Array(2)].map((_, index) => (
        <div key={index} className="h-4 w-[15%] bg-[#171717] rounded-lg" />
      ))}

      {/* Horizontal Skeleton Cards */}
      <div className="flex flex-wrap gap-4">
        {[...Array(5)].map((_, index) => (
          <SkeletonCard key={index} height="99px" />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Column */}
        <div className="w-full md:w-1/2 flex flex-col space-y-4">
          <SkeletonCard height="350px" />
          <SkeletonCard height="350px" />
          <SkeletonCard height="350px" />
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 flex flex-col space-y-4">
          <SkeletonCard height="350px" />
          <SkeletonCard height="350px" />
        </div>
      </div>
    </div>
  );
};
