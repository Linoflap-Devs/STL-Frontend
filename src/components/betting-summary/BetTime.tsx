import { useEffect, useState } from "react";
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Typography, Box, Stack, Divider, Button } from "@mui/material";

// Custom Legend
const CustomLegend = () => (
  <Stack
    direction="row"
    spacing={3}
    justifyContent="right"
    sx={{ mt: 2, mr: 4 }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#BB86FC",
          mr: 1.5,
        }}
      />
      <Typography color="white">10:30 AM</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#5050A5",
          mr: 1.5,
        }}
      />
      <Typography color="white">03:00 PM</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#7266C9",
          mr: 1.5,
        }}
      />
      <Typography color="white">07:00 PM</Typography>
    </Box>
  </Stack>
);

interface BetTimePageProps {
  data: any[];
}
const BetTimePage: React.FC<BetTimePageProps> = ({ data }) => {
  const [regions, setRegions] = useState<string[]>([]);
  const [gameType1, setGameType1] = useState<number[]>([]);
  const [gameType2, setGameType2] = useState<number[]>([]);
  const [gameType3, setGameType3] = useState<number[]>([]);

  const allRegions = [
    "I",
    "II",
    "III",
    "IV-A",
    "MIMAROPA",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
    "CARAGA",
    "BARMM",
    "CAR",
    "NCR",
    "Default",
  ];

  useEffect(() => {
    const regionMap: Record<
      string,
      { GameType1: number; GameType2: number; GameType3: number }
    > = {};

    allRegions.forEach((region) => {
      regionMap[region] = { GameType1: 0, GameType2: 0, GameType3: 0 };
    });

    data.forEach((entry) => {
      let region = entry.Region || "Unknown";
      region = region.replace(/^Region\s/, "");
      const gameTypeId = entry.GameTypeId;

      if (regionMap[region]) {
        if (gameTypeId === 1) {
          regionMap[region].GameType1 += entry.TotalBetAmount;
        } else if (gameTypeId === 2) {
          regionMap[region].GameType2 += entry.TotalBetAmount;
        } else if (gameTypeId === 3) {
          regionMap[region].GameType3 += entry.TotalBetAmount;
        }
      }
    });

    setRegions(allRegions);
    setGameType1(allRegions.map((region) => regionMap[region].GameType1));
    setGameType2(allRegions.map((region) => regionMap[region].GameType2));
    setGameType3(allRegions.map((region) => regionMap[region].GameType3));
  }, [data]);

  return (
    <>
      <Box
        sx={{
          mt: 4,
          paddingTop: 7,
          paddingBottom: 4,
          paddingLeft: 2,
          backgroundColor: "#282828",
        }}
      >
        <Box sx={{ paddingX: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                color="#B3B3B3"
                sx={{ fontSize: "17px", lineHeight: 1 }}
              >
                Side by Side Comparison of
              </Typography>
              <Typography
                color="#FFFFFF"
                sx={{ fontSize: "21px", lineHeight: 1.3, fontWeight: "700" }}
              >
                Regional Winner Report by Bet Time
              </Typography>
            </Box>
            <CustomLegend />
          </Box>
          <Divider
            sx={{
              backgroundColor: "#B3B3B3",
              opacity: 1,
              height: "2px",
              mt: 1,
            }}
          />
        </Box>

        <Box sx={{ height: 270, width: "100%" }}>
          <BarChart
            borderRadius={20}
            grid={{ horizontal: true }}
            xAxis={[
              {
                scaleType: "band",
                data: regions,
                label: "PHILIPPINE REGIONS",
              } as any,
            ]}
            yAxis={[{ label: "AMOUNT" }]}
            series={[
              { data: gameType1, label: "10:30 AM", color: "#BB86FC" },
              { data: gameType2, label: "03:00 PM", color: "#5050A5" },
              { data: gameType3, label: "07:00 PM", color: "#7266C9" },
            ]}
            slotProps={{
              legend: { hidden: true },
              axisLabel: {
                style: { fontSize: 12, fontWeight: "bold", fill: "#B3B3B3" },
              },
              axisTickLabel: { style: { fontSize: 12, fill: "#B3B3B3" } },
            }}
            sx={{
              "& .MuiChartsBar-root": {
                transition: "fill 0.3s ease-in-out", // Smooth effect
                "&:hover": {
                  fill: "#E3E3E3", // Hover background color
                  cursor: "pointer", // Optional: Pointer cursor
                },
              },
              "& .MuiChartsGrid-root line": {
                stroke: "white",
                strokeDasharray: "4 4",
              },
              "& .MuiChartsAxis-line": {
                stroke: "none !important",
              },
              "& .MuiChartsYAxis-root": {
                marginTop: 3,
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 3, mt: 2 }}>
          <Button
            sx={{
              borderRadius: "8px",
              paddingY: 1,
              paddingX: 2,
              textTransform: "none",
              fontWeight: 400,
              lineHeight: "14.63px",
              "&:hover": {
                backgroundColor: "#B183E8",
              },
              width: "145px",
              height: "34px",
              color: "#1b1b1b",
            }}
            variant="contained"
            onClick={() => console.log("Exporting All as CSV")}
          >
            Export as CSV
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default BetTimePage;
