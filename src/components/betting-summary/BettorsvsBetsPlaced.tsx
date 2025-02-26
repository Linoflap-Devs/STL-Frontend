import { useEffect, useState } from "react";
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Typography, Box, Stack, Divider, Button, Menu, MenuItem, TextField } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

// Custom Legend
const CustomLegend = () => (
    <Stack direction="row" spacing={3} justifyContent="right" sx={{ mt: 2, mr: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#BB86FC", mr: 1.5 }} />
            <Typography color="white">Bettors</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#5050A5", mr: 1.5 }} />
            <Typography color="white">Bets Placed</Typography>
        </Box>
    </Stack>
);

interface BettorsvsBetsPlacedPageProps {
    selectedDate: string;
    data: any[];
    accumulatedBettors: number;
    accumulatedBets: number;
}
  

const BettorsvsBetsPlacedPage: React.FC<BettorsvsBetsPlacedPageProps> = ({ selectedDate, data }) => {
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [regions, setRegions] = useState<string[]>([]);
    const [bettorsData, setBettorsData] = useState<number[]>([]);
    const [betsPlacedData, setBetsPlacedData] = useState<number[]>([]);

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
        const processData = () => {
            const regionMap: Record<string, { bettors: number; bets: number }> = {};
            allRegions.forEach(region => {
                regionMap[region] = { bettors: 0, bets: 0 };
            });

            data.forEach((entry) => {
                let region = entry.Region || "Unknown";
                region = region.replace(/^Region\s/, ""); // Remove "Region" prefix

                if (regionMap[region]) {
                    regionMap[region].bettors += entry.TotalBettors;
                    regionMap[region].bets += entry.TotalBetAmount;
                }
            });

            setRegions(allRegions);
            setBettorsData(allRegions.map(region => regionMap[region]?.bettors || 0));
            setBetsPlacedData(allRegions.map(region => regionMap[region]?.bets || 0));
        };

        if (data) {
            processData();
        }
    }, [data]);

    return (
        <>
            {/* <Box sx={{ mt: 4, mb: 1.5, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}> */}
                {/* Filter Button */}
                {/* <Button
                    sx={{
                        borderRadius: '8px',
                        width: "150px",
                        paddingY: 1,
                        textAlign: "left",
                        textTransform: 'none',
                        backgroundColor: "#CCA1FD",
                        fontSize: '1.2rem',
                        flexShrink: 0,
                        color: '#3F3F3F',
                    }}
                    variant="contained"
                    onClick={handleClick}
                    endIcon={<FilterListIcon />}
                >
                    <Typography sx={{ fontWeight: 300, fontSize: '13px', textAlign: 'left', width: '100%' }}>
                        Filter By
                    </Typography>
                </Button> */}

                {/* Filter Options Menu */}
                {/* <Menu sx={{ mt: 1 }} anchorEl={anchorEl} open={open} onClose={() => handleClose(selectedFilter)}>
                    {["Specific Day", "Date Duration"].map((filter) => (
                        <MenuItem
                            key={filter}
                            onClick={() => handleClose(filter)}
                            sx={{
                                display: 'flex',
                                textAlign: 'left',
                                fontSize: '13px',
                                height: 'auto',
                                backgroundColor: '#2563EB',
                                color: 'inherit',
                                "&:hover": { backgroundColor: '#1D4ED8' },
                            }}
                        >
                            {filter}
                        </MenuItem>
                    ))}
                </Menu> */}

                {/* Conditionally Show Date Inputs */}
                {/* {selectedFilter === "Specific Day" && (
                    <TextField
                        label="Select Date"
                        type="date"
                        value={selectedDate}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            backgroundColor: "white",
                            borderRadius: "4px",
                            width: "200px",
                        }}
                    />
                )}  
            </Box> */}

            <Box sx={{ paddingTop: 7, paddingBottom: 4, paddingLeft: 2, backgroundColor: "#282828" }}>
                <Box sx={{ paddingX: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Box>
                            <Typography color="#B3B3B3" sx={{ fontSize: "17px", lineHeight: 1 }}>
                                Side by Side Comparison of
                            </Typography>
                            <Typography color="#FFFFFF" sx={{ fontSize: "21px", lineHeight: 1.3, fontWeight: "700" }}>
                                Regional Report of Bettors and Bets Placed
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
                        xAxis={[{ scaleType: "band", data: regions, label: "PHILIPPINE REGIONS" }]}
    // barCategoryGapRatio={0.8}

                        yAxis={[{ label: "AMOUNT" }]}
                        series={[
                            { data: bettorsData, label: "Bettors", color: "#BB86FC" },
                            { data: betsPlacedData, label: "Bets Placed", color: "#5050A5" },
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
                        }}
                    />
                </Box>
            </Box>
        </>
    );
};

export default BettorsvsBetsPlacedPage;
