import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const TopBettingRegionPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#171717",
        padding: 2,
        borderRadius: "10px",
      }}
    >
      <Box sx={{ display: "flex", mb: 1 }}>
        <Box sx={{ backgroundColor: "#2F2F2F" }}>
          <CasinoIcon sx={{ color: "#67ABEB" }} />
        </Box>
        <Typography sx={{ fontWeight: 300, fontSize: "16px", ml: 1 }}>
          Top Betting Region Today
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#303030", mb: "1rem" }} />

      {/* List of items */}
      <Box sx={{ mt: 2, width: "100%" }}>
        {[
          {
            rank: 9,
            region: "National Capital Region",
            bets: "673,998",
            trend: "up",
          },
          { rank: 8, region: "Central Luzon", bets: "502,134", trend: "down" },
          { rank: 7, region: "CALABARZON", bets: "489,765", trend: "up" },
          { rank: 8, region: "Central Luzon", bets: "502,134", trend: "down" },
          { rank: 7, region: "CALABARZON", bets: "489,765", trend: "up" },
          
        ].map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "5px 0",
            }}
          >
            {/* Rank with Dynamic Color & Icon */}
            <Box sx={{ display: "flex", alignItems: "center", width: "15%" }}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: item.trend === "up" ? "#3d8440" : "#894747",
                }}
              >
                {item.rank}
              </Typography>
              {item.trend === "up" ? (
                <ArrowUpwardIcon
                  sx={{ color: "#3d8440", ml: 0.5, fontSize: 18 }}
                />
              ) : (
                <ArrowDownwardIcon
                  sx={{ color: "#894747", ml: 0.5, fontSize: 18 }}
                />
              )}
            </Box>

            {/* Region */}
            <Typography sx={{ color: "#fff", flex: 1, ml: 2 }}>
              {item.region}
            </Typography>

            {/* Bets Centered */}
            <Typography
              sx={{
                color: "#67ABEB",
                fontWeight: "bold",
                textAlign: "center",
                flex: 1,
              }}
            >
              {item.bets}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TopBettingRegionPage;