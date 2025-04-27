import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Typography, Box, Stack, Divider, Button } from "@mui/material";

// Custom Legend
const CustomLegend = () => (
    <Stack direction="row" spacing={3} justifyContent="right" sx={{ mt: 2, mr: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#BB86FC", mr: 1.5 }} />
            <Typography color="white">Total Bets</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#5050A5", mr: 1.5 }} />
            <Typography color="white">Total Payout</Typography>
        </Box>
    </Stack>
);

interface BetsPlacedvsTotalWinningsPageProps {
    data: any[]; // Filtered data passed from parent
}

const BetsPlacedvsTotalWinningsPage: React.FC<BetsPlacedvsTotalWinningsPageProps> = ({ data }) => {
    console.log('Fetched Data from BettorsvsBetsPlaced:', JSON.stringify(data, null, 2));

    const [regions, setRegions] = useState<string[]>([]);
    const [totalBetsData, setTotalBetsData] = useState<number[]>([]);
    const [totalPayoutData, setTotalPayoutData] = useState<number[]>([]);

    // List of Philippine Regions
    const allRegions = [
        "I", "II", "III", "IV-A", "MIMAROPA", "V",
        "VI", "VII", "VIII", "IX", "X", "XI",
        "XII", "CARAGA", "BARMM", "CAR", "NCR", "Default"
    ];

    // Process Data from Props
    useEffect(() => {

        // Aggregates Data per Region
        const processData = () => {
            const regionMap: Record<string, { totalBets: number; totalPayout: number }> = {};

            // Initialize all regions with 0 values
            allRegions.forEach(region => {
                regionMap[region] = { totalBets: 0, totalPayout: 0 };
            });

            // Aggregate data based on region
            data.forEach((entry) => {
                let region = entry.Region || "Unknown";
                region = region.replace(/^Region\s/, ""); // Normalize region name

                if (regionMap[region]) {
                    regionMap[region].totalBets += entry.TotalBets;
                    regionMap[region].totalPayout += entry.TotalPayout;
                }
            });

            // Update state for chart rendering
            setRegions(allRegions);
            setTotalBetsData(allRegions.map(region => regionMap[region]?.totalBets || 0));
            setTotalPayoutData(allRegions.map(region => regionMap[region]?.totalPayout || 0));
        };

        if (data && data.length > 0) {
            processData();
        } else {
            // Clear chart if no data
            setRegions([]);
            setTotalBetsData([]);
            setTotalPayoutData([]);
        }
    }, [data]); // Re-run when `data` changes

    return (
        <Box sx={{ paddingTop: 7, paddingBottom: 4, paddingLeft: 2, backgroundColor: "#282828" }}>
            <Box sx={{ paddingX: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box>
                        <Typography color="#B3B3B3" sx={{ fontSize: "17px", lineHeight: 1 }}>
                            Side by Side Comparison of
                        </Typography>
                        <Typography color="#FFFFFF" sx={{ fontSize: "21px", lineHeight: 1.3, fontWeight: "700" }}>
                        Regional Report on Bets Placed and Total Winnings of Bettors
                        </Typography>
                    </Box>
                    <CustomLegend />
                </Box>
                <Divider sx={{ backgroundColor: "#B3B3B3", opacity: 1, height: "2px", mt: 1 }} />
            </Box>

            {/* Chart Rendering */}
            <Box sx={{ height: 270, width: "100%", flexGrow: 0, minWidth: 0 }}>
                <BarChart
                    borderRadius={20}
                    grid={{ horizontal: true }}
                    xAxis={[{ scaleType: "band", data: regions, label: "PHILIPPINE REGIONS" }]}
                    yAxis={[{ label: "AMOUNT" }]}
                    series={[
                        { data: totalBetsData, label: "Total Bets", color: "#BB86FC" },
                        { data: totalPayoutData, label: "Total Payout", color: "#5050A5" },
                    ]}
                    slotProps={{
                        legend: { hidden: true },
                        bar: {
                            className: "bar-hover-effect",
                            style: {
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                                transition: "fill 0.3s ease-in-out",
                                cursor: "pointer",
                            },
                        },
                        axisLabel: {
                            style: {
                                fontSize: 12,
                                fontWeight: "bold",
                                fill: "#B3B3B3",
                            },
                        },
                        axisTickLabel: {
                            style: {
                                fontSize: 12,
                                fill: "#B3B3B3",
                            },
                        },
                    }}
                    sx={{
                        "& .MuiChartsGrid-root line": {
                            stroke: "white",
                            strokeDasharray: "4 4",
                        },
                        "& .MuiChartsAxis-line": {
                            stroke: "none !important",
                        },
                    }}
                />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 3, mt: 2 }}>
                <Button
                    sx={{
                        borderRadius: '8px',
                        paddingY: 1,
                        paddingX: 2,
                        textTransform: 'none',
                        fontWeight: 400,
                        lineHeight: '14.63px',
                        "&:hover": {
                            backgroundColor: '#B183E8',
                        },
                        width: '145px',
                        height: '34px',
                        color: '#1b1b1b'
                    }}
                    variant="contained"
                    onClick={() => console.log("Exporting All as CSV")}
                >
                    Export as CSV
                </Button>
            </Box>
        </Box>
    );
};

export default BetsPlacedvsTotalWinningsPage;
