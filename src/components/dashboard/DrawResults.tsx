import React from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { buttonDrawStyles, buttonNumberStyles } from "../../styles/theme";

interface DrawResultsProps {
  value1?: number | string | null;
  value2?: number | string | null;
}

const DrawResultsPage: React.FC<DrawResultsProps> = ({
  value1 = "4",
  value2 = "20",
}) => {
  const displayValue = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) {
      return (
        <Typography sx={{ padding: '0.8rem' }}>
          {"\u00A0"}
        </Typography>
      );
    }
    if (typeof value === "string" && value.trim() === "") {
      return (
        <Typography sx={{ paddingY: '1rem', paddingX: '0.6rem' }}>
          {"\u00A0"}
        </Typography>
      );
    }
    return value;
  };

  return (
    <Box sx={{ mt: 2, textAlign: "left" }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ ...buttonDrawStyles }}>
          <Typography
            sx={{ fontSize: "14px", fontWeight: 700, lineHeight: 1.2 }}
          >
            First Draw
          </Typography>
          <Typography
            sx={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.1 }}
          >
            10:30 AM
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box sx={{ ...buttonNumberStyles }}>
              <Typography
                sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}
              >
                {displayValue(value1)}
              </Typography>
            </Box>
            <Box sx={{ ...buttonNumberStyles }}>
              <Typography
                sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}
              >
                {displayValue(value2)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ ...buttonDrawStyles }}>
          <Typography
            sx={{ fontSize: "14px", fontWeight: 700, lineHeight: 1.2 }}
          >
            Second Draw
          </Typography>
          <Typography
            sx={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.1 }}
          >
            3:00 AM
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box sx={{ ...buttonNumberStyles }}>
              <Typography
                sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}
              >
                {displayValue(value1)}
              </Typography>
            </Box>
            <Box sx={{ ...buttonNumberStyles }}>
              <Typography
                sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}
              >
                {displayValue(value2)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ ...buttonDrawStyles }}>
          <Typography
            sx={{ fontSize: "14px", fontWeight: 700, lineHeight: 1.2 }}
          >
            Third Draw
          </Typography>
          <Typography
            sx={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.1 }}
          >
            7:00 PM
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box sx={{ ...buttonNumberStyles, display: "flex", gap: 1 }}>
              <Typography
                sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}
              >
                {displayValue(value1)}
              </Typography>
            </Box>
            <Box sx={{ ...buttonNumberStyles, display: "flex", gap: 1 }}>
              <Typography
                sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}
              >
                {displayValue(value2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DrawResultsPage;