import {
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';

const CustomLegend = () => (
  <Stack
    direction="row"
    spacing={2}
    justifyContent="left"
    sx={{ mt: 0.5, mr: 4 }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#E5C7FF",
          mr: 1.5,
        }}
      />
        <Typography color="white" sx={{
          fontSize: "12x",
          fontWeight: 400,
          lineHeight: "14px",
        }}>
          Bettors - 02/07/2025
        </Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#D2A7FF",
          mr: 1.5,
        }}
      />
        <Typography color="white" sx={{
          fontSize: "12x",
          fontWeight: 400,
          lineHeight: "14px",
        }}>
          Bettors - 02/08/2025
        </Typography>
    </Box>
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
          <Typography color="white" sx={{
            fontSize: "12x",
            fontWeight: 400,
            lineHeight: "14px",
          }}>
            Bets - 02/07/2025
          </Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#A06FE6",
          mr: 1.5,
        }}
      />
        <Typography color="white" sx={{
            fontSize: "12x",
            fontWeight: 400,
            lineHeight: "14px",
          }}>
            Bets - 02/08/2025
        </Typography>
    </Box>
  </Stack>
);
const ChartBettorsAndBetsRegionalSummary = () => {
    const philippineRegions = [
        "I",
        "II",
        "III",
        "IV-A",
        "IV-B",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
        "X",
        "XI",
        "XII",
        "XIII",
        "BARMM",
        "CAR",
        "NCR"
      ];
    const yAxisTicks = [0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

return (
    <Box
    sx={{
        backgroundColor: "#171717",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "2rem",
        width: "100%",
        height: "585px"
    }}
    >
        <Typography color="#FFFFFF" 
        sx={{ 
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "18px",
            mb: "10px"
        }}>
            Regional Summary of Total Bettors and Bets
        </Typography>
        <CustomLegend />
        <Box
            sx={{
            height: "100%",
            // width: "100%",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
        }}
        >
        <BarChart
          height={500} 
          margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
          xAxis={[
            {
              scaleType: "band",
              data: philippineRegions, // Ensure this matches the number of data points
            },
          ]}
          yAxis={[
            {
              label: "Amount (in 100,000 units)",
              min: 0,
              max: 100, // Adjust max to fit your data range
              tickValues: yAxisTicks, // Ensure all ticks are displayed
              tickSpacing: 5, // Optional: Adjust spacing between ticks
            },
          ]}
          series={[
            {
              data: Array.from({ length: 17 }, (_, index) => index + 1), // 17 data points
              color: "#E5C7FF",
            },
            {
              data: Array.from({ length: 17 }, (_, index) => (index + 1) * 2), // 17 data points
              color: "#D2A7FF",
            },
            {
              data: Array.from({ length: 17 }, (_, index) => (index + 1) * 3), // 17 data points
              color: "#BB86FC",
            },
            {
              data: Array.from({ length: 17 }, (_, index) => (index + 1) * 4), // 17 data points
              color: "#A06FE6",
            },
          ]}
           // Optional: Increase width for better x-axis spacing
        />
        </Box>
        </Box>
  )
}
export default ChartBettorsAndBetsRegionalSummary;