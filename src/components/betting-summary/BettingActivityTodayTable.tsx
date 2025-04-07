import { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';

interface RegionData {
  Region: string;
  totalBetAmount: number;
  trend?: number;
}

const TableBettingActivityToday = () => {
  // Hardcoded data for all Philippine regions
  const [regionData] = useState<RegionData[]>([
    { Region: "National Capital Region (NCR)", totalBetAmount: 1850000, trend: 3 },
    { Region: "Cordillera Administrative Region (CAR)", totalBetAmount: 320000, trend: 1 },
    { Region: "Ilocos Region (Region I)", totalBetAmount: 450000, trend: -1 },
    { Region: "Cagayan Valley (Region II)", totalBetAmount: 380000, trend: 2 },
    { Region: "Central Luzon (Region III)", totalBetAmount: 920000, trend: 1 },
    { Region: "Calabarzon (Region IV-A)", totalBetAmount: 1150000, trend: 2 },
    { Region: "Mimaropa (Region IV-B)", totalBetAmount: 280000, trend: 0 },
    { Region: "Bicol Region (Region V)", totalBetAmount: 350000, trend: -1 },
    { Region: "Western Visayas (Region VI)", totalBetAmount: 510000, trend: 1 },
    { Region: "Central Visayas (Region VII)", totalBetAmount: 680000, trend: 3 },
    { Region: "Eastern Visayas (Region VIII)", totalBetAmount: 290000, trend: -2 },
    { Region: "Zamboanga Peninsula (Region IX)", totalBetAmount: 310000, trend: 0 },
    { Region: "Northern Mindanao (Region X)", totalBetAmount: 390000, trend: 1 },
    { Region: "Davao Region (Region XI)", totalBetAmount: 550000, trend: 2 },
    { Region: "Soccsksargen (Region XII)", totalBetAmount: 330000, trend: -1 },
    { Region: "Caraga (Region XIII)", totalBetAmount: 270000, trend: 0 },
    { Region: "Bangsamoro Autonomous Region (BARMM)", totalBetAmount: 210000, trend: 1 },
  ]);

  return (
    <Box sx={{ backgroundColor: "#171717", padding: 2, borderRadius: "10px" }}>
      <Box sx={{ display: "flex", mb: 1 }}>
        <Box
          sx={{
            backgroundColor: "#2F2F2F",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          <CasinoIcon sx={{ color: "#67ABEB" }} />
        </Box>
        <Typography
          sx={{ fontWeight: 300, fontSize: "16px", ml: 1, color: "#fff" }}
        >
          Today's Total Bets Placed by Region
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#303030", mb: "1rem" }} />

      <Box sx={{ mt: 2, width: "100%", maxHeight: "400px", overflowY: "auto" }}>
        {regionData.map((item, index) => (
          <Box
            key={index}
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              padding: "8px 0",
              borderBottom: "1px solid #303030",
              '&:last-child': {
                borderBottom: "none"
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "15%" }}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  color:
                    item.trend! > 0
                      ? "#3d8440"
                      : item.trend! < 0
                        ? "#894747"
                        : "#aaa",
                }}
              >
                {item.trend! > 0
                  ? `↑${item.trend}`
                  : item.trend! < 0
                    ? `↓${Math.abs(item.trend)}`
                    : "→"}
              </Typography>
            </Box>
            <Typography sx={{ 
              color: "#fff", 
              flex: 1, 
              ml: 2, 
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {item.Region}
            </Typography>
            <Typography
              sx={{
                color: "#67ABEB",
                fontWeight: "bold",
                textAlign: "right",
                flex: 1,
                fontSize: "0.95rem",
              }}
            >
              ₱{item.totalBetAmount.toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TableBettingActivityToday;