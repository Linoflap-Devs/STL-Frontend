import React, { useState } from "react";
import { Box, Button, Typography, Select, MenuItem } from "@mui/material";

import DrawResultsPage from "~/components/dashboard/DrawResults";
import SummaryBetsPlacedTimePage from "~/components/dashboard/SummaryBetsPlacedTime";
import SummaryBettorsTimePage from "~/components/dashboard/SummaryBettorsTime";
import SummaryBettorsWinPage from "~/components/dashboard/SummaryBettorsWin";
import SummaryWinnersDrawTimePage from "~/components/dashboard/SummaryWinnersDrawTime";

const DashboardPage = () => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

  return (
    <Box>
      <Typography sx={{ color: "#E3C9FF", fontWeight: 700 }} variant="h6">
        Official Draw Result
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, }}>
        {/* Region Select */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle1">Region</Typography>
          <Select
            name="Region"
            fullWidth
            displayEmpty
            sx={{ width: "315px !important" }}
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            renderValue={(selected) =>
              selected ? (selected as string) : "Select Region"
            }
            MenuProps={{
              PaperProps: {
                sx: {
                  mt: 1.5,
                  border: "1px solid white",
                },
              },
            }}
          >
            <MenuItem value="option1" sx={{ py: 1.3 }}>
              Option 1
            </MenuItem>
            <MenuItem value="option2" sx={{ py: 1.3 }}>
              Option 2
            </MenuItem>
            <MenuItem value="option3" sx={{ py: 1.3 }}>
              Option 3
            </MenuItem>
          </Select>
        </Box>

        {/* Province Select */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography variant="subtitle1">Province</Typography>
          <Select
            name="Province"
            fullWidth
            displayEmpty
            sx={{ width: "315px !important" }}
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            renderValue={(selected) =>
              selected ? (selected as string) : "Select Province"
            }
            MenuProps={{
              PaperProps: {
                sx: {
                  mt: 1.5,
                  border: "1px solid white",
                },
              },
            }}
          >
            <MenuItem value="option1" sx={{ py: 1.3 }}>
              Option 1
            </MenuItem>
            <MenuItem value="option2" sx={{ py: 1.3 }}>
              Option 2
            </MenuItem>
            <MenuItem value="option3" sx={{ py: 1.3 }}>
              Option 3
            </MenuItem>
          </Select>
        </Box>

      </Box>
      {/* Draw Results Component */}
      <DrawResultsPage />

      {/* Bet Summary Section */}
      <Box sx={{ marginTop: "2rem" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              color: "#E3C9FF",
              fontWeight: 700,
              marginBottom: "1rem",
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            variant="h6"
          >
            Bet Summary Today
          </Typography>

          <Button
            sx={{
              fontSize: "12px",
              textAlign: "left",
              color: "#3F3F3F",
              textTransform: "none",
              backgroundColor: "#CCA1FD",
              mb: 0.7,
              paddingX: 3,
              paddingY: 0.9,
              width: "auto",
              "&:hover": {
                backgroundColor: "#B389E0",
              },
            }}
            variant="contained"
          >
            View Bet Summary
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: "1rem", flexGrow: 1, mt: 1.3, }}>
          <SummaryBetsPlacedTimePage />
          <SummaryBettorsTimePage />
        </Box>
      </Box>

      {/* Win Summary Section */}
      <Box sx={{ marginTop: "2rem" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              color: "#E3C9FF",
              fontWeight: 700,
              marginBottom: "1rem",
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            variant="h6"
          >
            Win Summary Today
          </Typography>

          <Button
            sx={{
              fontSize: "12px",
              textAlign: "left",
              color: "#3F3F3F",
              textTransform: "none",
              backgroundColor: "#CCA1FD",
              mb: 0.7,
              paddingX: 3,
              paddingY: 0.9,
              width: "auto",
              "&:hover": {
                backgroundColor: "#B389E0",
              },
            }}
            variant="contained"
          >
            View Win Summary
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: "1rem", flexGrow: 1, mt: 1.3, }}>
          <SummaryBettorsWinPage />
          <SummaryWinnersDrawTimePage />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
