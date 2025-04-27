import { useEffect, useState } from "react";
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Typography, Box, Stack, Divider, Button } from "@mui/material";

// Custom Legend
const CustomLegend = () => (
    <Stack direction="row" spacing={3} justifyContent="right" sx={{ mt: 2, mr: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#BB86FC", mr: 1.5 }} />
            <Typography color="white">Tumbok</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#5050A5", mr: 1.5 }} />
            <Typography color="white">Sahod</Typography>
        </Box>
    </Stack>
);

interface BettorsvsTotalWinningsPageProps {
    data: any []; 
}
const BetsPlacedvsTotalWinningsPage:React.FC<BettorsvsTotalWinningsPageProps> = ({ data }) => {
    console.log('Fetched Data from BetsPlacedvsTotalWinningsPage', JSON.stringify(data, null, 2))

    const [regions, setRegions] = useState<string[]>([]);
    const [tumbokData, setTumbokData] = useState<number[]>([]);
    const [sahodData, setSahodData] = useState<number[]>([]);

    const allRegions = [
        "I", "II", "III", "IV-A", "MIMAROPA", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "CARAGA", "BARMM", "CAR", "NCR", "Default"
    ];

    useEffect(() => {
        if (!data || !Array.isArray(data)) return;

        // Initialize region map
        const regionMap: Record<string, { tumbok: number; sahod: number }> = {};
        allRegions.forEach(region => {
            regionMap[region] = { tumbok: 0, sahod: 0 };
        });

        data.forEach((entry) => {
            let region = entry.Region || "Unknown";
            region = region.replace(/^Region\s/, "");
            
            if (regionMap[region]) {
                if (entry.BetTypeId === 1) {
                    regionMap[region].tumbok += entry.TotalBetAmount;
                } else if (entry.BetTypeId === 2) {
                    regionMap[region].sahod += entry.TotalBetAmount;
                }
            }
        });

        // Generate data arrays based on all 17 regions
        setRegions(allRegions);
        setTumbokData(allRegions.map(region => regionMap[region]?.tumbok || 0));
        setSahodData(allRegions.map(region => regionMap[region]?.sahod || 0));
    }, [data]);

    return (
        <>
            <Box sx={{ mt: 4, paddingTop: 7, paddingBottom: 4, paddingLeft: 2, backgroundColor: "#282828" }}>
                <Box sx={{ paddingX: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Box>
                            <Typography color="#B3B3B3" sx={{ fontSize: "17px", lineHeight: 1 }}>
                                Side by Side Comparison of
                            </Typography>
                            <Typography color="#FFFFFF" sx={{ fontSize: "21px", lineHeight: 1.3, fontWeight: "700" }}>
                                Regional Winner Report by Bet Types
                            </Typography>
                        </Box>
                        <CustomLegend />
                    </Box>
                    <Divider sx={{ backgroundColor: "#B3B3B3", opacity: 1, height: "2px", mt: 1 }} />
                </Box>

                <Box sx={{ height: 270, width: "100%", flexGrow: 0, minWidth: 0 }}>
                    <BarChart
                        borderRadius={20}
                        grid={{ horizontal: true }}
                        xAxis={[{ scaleType: "band", data: regions, label: "PHILIPPINE REGIONS" } as any]}
                        yAxis={[{ label: "AMOUNT" }]}
                        series={[
                            { data: tumbokData, label: "Tumbok", color: "#BB86FC" },
                            { data: sahodData, label: "Sahod", color: "#5050A5" },
                        ]}
                        slotProps={{
                            legend: { hidden: true },
                            bar: {
                                // className: "bar-container-hover", // Add custom class here
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
                            "& .MuiChartsHighlightElement-root": {
                                fill: "#E3E3E3", //This changes the hover rectangle color
                                transition: "fill 0.3s ease-in-out", // Smooth transition effect
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
        </>
    );
};

export default BetsPlacedvsTotalWinningsPage;
