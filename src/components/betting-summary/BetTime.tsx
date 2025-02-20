import { useEffect, useState } from "react";
import fetchHistoricalSummary from "~/utils/api/transactions";
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Typography, Box, Stack, Divider, Button, Menu, MenuItem, TextField, } from "@mui/material";

// Custom Legend
const CustomLegend = () => (
    <Stack direction="row" spacing={3} justifyContent="right" sx={{ mt: 2, mr: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#BB86FC", mr: 1.5 }} />
            <Typography color="white">10:30 AM</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#5050A5", mr: 1.5 }} />
            <Typography color="white">3:00 PM</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#7266C9", mr: 1.5 }} />
            <Typography color="white">7:00 PM</Typography>
        </Box>
    </Stack>
);

const BetTimePage = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [regions, setRegions] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");

    const [selectedGame, setSelectedGame] = useState<string>(""); // Add state for game filtering
    const [selectedTime, setSelectedTime] = useState<string>(""); // Add state for time filtering

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
    
                const queryParams = { 
                    filter: selectedFilter, 
                    gameName: selectedGame, 
                    time: selectedTime 
                };
    
                const response = await fetchHistoricalSummary(queryParams);
                console.log("API Response:", response);
    
                if (response.success) {
                    const apiData = response.data;
                    console.log("Fetched Data:", apiData);
    
                    // Define types properly
                    type TimeSlots = "10:30 AM" | "3:00 PM" | "7:00 PM";
    
                    const regionMap: Record<string, Record<TimeSlots, number>> = {};
    
                    // Initialize all regions with zero values for each time slot
                    allRegions.forEach(region => {
                        regionMap[region] = { "10:30 AM": 0, "3:00 PM": 0, "7:00 PM": 0 };
                    });
    
                    // Process API Data
                    apiData.forEach((entry: any) => {
                        let region = entry.Region || "Unknown";
                        region = region.replace(/^Region\s/, "");
    
                        // Extract time from `GameName` (Assumes format: "STL Pares 10:30AM")
                        const timeMatch = entry.GameName.match(/(10:30AM|3:00PM|7:00PM)/);
                        if (!timeMatch) return;
                        
                        const betTime = timeMatch[0] as TimeSlots; // Explicitly set type
    
                        if (regionMap[region]) {
                            regionMap[region][betTime] += entry.TotalBetAmount;
                        }
                    });
    
                    // Prepare data for the BarChart
                    const updatedBettorsData = allRegions.map(region => regionMap[region]["10:30 AM"] || 0);
                    const updatedBetsPlacedData_3PM = allRegions.map(region => regionMap[region]["3:00 PM"] || 0);
                    const updatedBetsPlacedData_7PM = allRegions.map(region => regionMap[region]["7:00 PM"] || 0);
    
                    console.log("Updated 10:30 AM Data:", updatedBettorsData);
                    console.log("Updated 3:00 PM Data:", updatedBetsPlacedData_3PM);
                    console.log("Updated 7:00 PM Data:", updatedBetsPlacedData_7PM);
    
                    setRegions(allRegions);
                    setBettorsData(updatedBettorsData);
                    setBetsPlacedData([...updatedBetsPlacedData_3PM, ...updatedBetsPlacedData_7PM]); // Flatten array
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
    }, [selectedFilter, selectedGame, selectedTime]);
    
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
                                Regional Winner Report by Bet Time
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
                            { data: bettorsData, label: "10:30 AM", color: "#BB86FC", },
                            { data: betsPlacedData, label: "3:00 PM", color: "#5050A5" },
                            { data: betsPlacedData, label: "7:00 PM", color: "#5050A5" },
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
                                backgroundColor: '#B389E0', fontWeight: '700',
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

export default BetTimePage;
