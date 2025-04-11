import React from "react";
import { Box } from "@mui/material";
import { cardDashboardStyles, skeletonRowStyles } from "~/styles/theme";

interface SkeletonCardProps {
  height?: string | number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ height = "110px" }) => (
  <Box
    sx={{
      ...cardDashboardStyles,
      flex: "1 1 200px",
      height: height,
      backgroundColor: "#171717",
      borderRadius: "8px",
      margin: 0,
    }}
  />
);

export const UsersSkeletonPage: React.FC = () => {
  return (
    <Box className="animate-pulse space-y-4">
      {[...Array(2)].map((_, index) => (
        <Box
          key={index}
          sx={{
            height: "1.2rem",
            backgroundColor: "#171717",
            borderRadius: "8px",
            width: "42%",
          }}
        />
      ))}

      <Box sx={skeletonRowStyles}>
        {[...Array(5)].map((_, index) => (
          <SkeletonCard key={index} height="110px" />
        ))}
      </Box>

      {[...Array(2)].map((_, index) => (
        <Box key={index} sx={skeletonRowStyles}>
          <SkeletonCard height="350px" />
        </Box>
      ))}
    </Box>
  );
}
