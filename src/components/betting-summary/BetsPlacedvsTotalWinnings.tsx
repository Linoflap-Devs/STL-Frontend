import { useEffect, useState } from "react";
import fetchHistoricalSummary from "~/utils/api/transactions";
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Typography, Box, Stack, Divider, Button, Menu, MenuItem, TextField, } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';

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

const BetsPlacedvsTotalWinningsPage = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [regions, setRegions] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");

    const [bettorsData, setBettorsData] = useState<number[]>([]);
    const [betsPlacedData, setBetsPlacedData] = useState<number[]>([]);

    // Dropdown Menu State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (filter: string) => {
        setSelectedFilter(filter);
        setAnchorEl(null);
    };

    const allRegions = [
        "I", "II", "III", "IV-A", "MIMAROPA", "V",
        "VI", "VII", "VIII", "IX", "X", "XI",
        "XII", "CARAGA", "BARMM", "CAR", "NCR"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
    
                const queryParams = { filter: selectedFilter };
                const response = await fetchHistoricalSummary(queryParams);
    
                console.log("API Response:", response);
    
                if (response.success) {
                    let apiData = response.data.map((entry: any) => ({
                        ...entry,
                        GameType: entry.GameTypeId === 1 ? "Tumbok" : entry.GameTypeId === 2 ? "Sahod" : "Unknown",
                    }));
    
                    console.log("Modified Data:", apiData);
    
                    // Initialize with all regions, defaulting to 0 bettors & bets
                    const regionMap: Record<string, { bettors: number; bets: number }> = {};
                    allRegions.forEach(region => {
                        regionMap[region] = { bettors: 0, bets: 0 };
                    });
    
                    apiData.forEach((entry: any) => {
                        let region = entry.Region || "Unknown";
                        region = region.replace(/^Region\s/, "");
    
                        if (regionMap[region]) {
                            regionMap[region].bettors += entry.TotalBettors;
                            regionMap[region].bets += entry.TotalBetAmount;
                        }
                    });
    
                    // Generate data arrays based on all 17 regions
                    const updatedBettorsData = allRegions.map(region => regionMap[region]?.bettors || 0);
                    const updatedBetsPlacedData = allRegions.map(region => regionMap[region]?.bets || 0);
    
                    console.log("Updated Bettors Data:", updatedBettorsData);
                    console.log("Updated Bets Placed Data:", updatedBetsPlacedData);
    
                    // Ensure all 17 regions are displayed without "Region"
                    setRegions(allRegions);
                    setBettorsData(updatedBettorsData);
                    setBetsPlacedData(updatedBetsPlacedData);
                    setData(apiData);
                } else {
                    setError(response.message || "Failed to fetch data.");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [selectedFilter]);
    

    return (
        <>
            <Box sx={{ mt: 4, paddingTop: 7, paddingBottom: 4, paddingLeft: 2, backgroundColor: "#282828" }}>
                <Box sx={{ paddingX: 3, }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, }}>
                        <Box>
                            <Typography color="#B3B3B3" sx={{ fontSize: "17px", lineHeight: 1 }}>
                                Side by Side Comparison of
                            </Typography>
                            <Typography color="#FFFFFF" sx={{ fontSize: "21px", lineHeight: 1.3, fontWeight: "700" }}>
                                Regional Winner Report by Bet Type
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
                        xAxis={[{ scaleType: "band", data: regions, label: "PHILIPPINE REGIONS", categoryGapRatio: 0.8 } as any]}
                        yAxis={[{ label: "AMOUNT" }]}
                        series={[
                            { data: bettorsData, label: "Tumbok", color: "#BB86FC", },
                            { data: betsPlacedData, label: "Sahod", color: "#5050A5" },
                        ]}
                        slotProps={{
                            legend: { hidden: true },
                            bar: {
                                style: {
                                    borderTopLeftRadius: 5,
                                    borderTopRightRadius: 5,
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
                            "& .MuiChartsYAxis-root": {
                                marginTop: 3,
                            },
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'right', marginRight: 4, borderRadius: '8px' }}>
                    <Button
                        sx={{
                            fontSize: '12px', textAlign: "left", color: '#3F3F3F', textTransform: 'none', backgroundColor: "#CCA1FD", mb: 0.7, paddingX: 4, paddingY: 0.9, width: 'auto', "&:hover": {
                                backgroundColor: '#B389E0',
                            },
                        }}
                        variant="contained"
                        onClick={handleClick}
                    >
                        Export as CSV
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default BetsPlacedvsTotalWinningsPage;
