import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Button
} from "@mui/material";
import MoneyIcon from "@mui/icons-material/Money";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const TableBettingActivityToday = () => {
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
          <MoneyIcon sx={{ color: "#67ABEB" }} />
        </Box>
        <Typography sx={{ fontWeight: 300, fontSize: "16px", ml: 1 }}>
          Betting Activity by Region Today
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#303030", mb: "1rem" }} />

      {/* List of items */}
      <Box sx={{ mt: 2, width: "100%" }}>
        {[
          {
            rank: 2,
            region: "National Capital Region",
            bets: "4,875,321",
            trend: "down",
          },
          {
            rank: 1,
            region: "Region IV-A - CALABARZON",
            bets: "3,965,210",
            trend: "down",
          },
          {
            rank: 1,
            region: "Region III - Central Luzon",
            bets: "3,456,789",
            trend: "up",
          },
          {
            rank: 1,
            region: "Region VI - Western Visayas",
            bets: "2,512,674",
            trend: "down",
          },
          {
            rank: 1,
            region: "Region VII - Central Visayas",
            bets: "2,198,543",
            trend: "down",
          },
          {
            rank: 2,
            region: "Region XI - Davao Region",
            bets: "1,789,654",
            trend: "up",
          },
          {
            rank: 1,
            region: "Region X - Northern Mindanao",
            bets: "1,523,876",
            trend: "down",
          },
          {
            rank: 1,
            region: "Region I - Ilocos Region",
            bets: "1,256,432",
            trend: "up",
          },
          {
            rank: 1,
            region: "Region V - Bicol Region",
            bets: "987,543",
            trend: "down",
          },
          {
            rank: 1,
            region: "Cordillera Administrative Region",
            bets: "876,321",
            trend: "down",
          },
          {
            rank: 1,
            region: "Region VIII - Eastern Visayas",
            bets: "765,432",
            trend: "up",
          },
          {
            rank: 1,
            region: "Region IX - Zamboanga Peninsula",
            bets: "654,321",
            trend: "down",
          },
          {
            rank: 1,
            region: "Region XII - SOCCSKSARGEN",
            bets: "543,789",
            trend: "up",
          },
          {
            rank: 1,
            region: "Region XIII - Caraga",
            bets: "432,567",
            trend: "down",
          },
          {
            rank: 1,
            region: "Region IV-B - MIMAROPA",
            bets: "321,876",
            trend: "down",
          },
          {
            rank: 1,
            region: "Bangsamoro Autonomous Region",
            bets: "219,654",
            trend: "down",
          },
          {
            rank: 1,
            region: "Region II - Cagayan Valley",
            bets: "123,430",
            trend: "no change",
          },
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

export default TableBettingActivityToday;
