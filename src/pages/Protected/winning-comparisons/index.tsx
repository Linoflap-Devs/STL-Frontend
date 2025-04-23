import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
// Components
import ChartWinnersandWinningsSummary from "~/components/winning-summary/wins-comparison/SummaryWinners&Winnings";
import ChartWinnersandWinningsRegionalSummary from "~/components/winning-summary/wins-comparison/RegionalSummaryWinners&Winnings";

import { useWinningStore, categoryType } from "../../../../store/useWinningStore";
import { useSideBarStore } from "../../../../store/useSideBarStore";

const WinningComparison = () => {
  const {
    // loading,
    activeGameType,
    categoryFilter,
    dateFilter,
    firstDateSpecific,
    secondDateSpecific,
    firstDateDuration,
    secondDateDuration,
    // setLoading,
    setGameType,
    setCategoryFilter,
    setDateFilter,
    setFirstDateSpecific,
    setSecondDateSpecific,
    setFirstDateDuration,
    setSecondDateDuration
  } = useWinningStore();

  // Format dates to MM/DD/YYYY
  const formattedFirstDateSpecific = firstDateSpecific
  ? dayjs(firstDateSpecific).format("MM/DD/YYYY")
  : null;

const formattedSecondDateSpecific = secondDateSpecific
  ? dayjs(secondDateSpecific).format("MM/DD/YYYY")
  : null;

const formattedFirstDateDuration = firstDateDuration
  ? dayjs(firstDateDuration).format("MM/DD/YYYY")
  : null;

const formattedSecondDateDuration = secondDateDuration
  ? dayjs(secondDateDuration).format("MM/DD/YYYY")
  : null;

  const { 
    SideBarActiveGameType,
  } = useSideBarStore();

  useEffect(() => {
    if (SideBarActiveGameType !== activeGameType) {
      setGameType(SideBarActiveGameType); // Update useWinningStore's activeGameType
    }
  }, [SideBarActiveGameType, activeGameType, setGameType]);

  const categoryTypes: categoryType[] = [
    "Total Winners and Winnings",
    "Total Winnings by Bet Type",
    "Total Winners by Bet Type",
    "Total Winnings by Game Type",
    "Total Winners by Game Type",
    "Top Winning Region by Winnings Comparison",
    "Top Winner Region by Winners Comparison",
  ];

    // Debugging: Log all states whenever they change
    useEffect(() => {
      console.log("Active Sidebar State:", activeGameType)
      console.log("State values:");
      console.log("categoryFilter:", categoryFilter);
      console.log("dateFilter:", dateFilter);
      console.log("firstDateSpecific:", firstDateSpecific);
      console.log("secondDateSpecific:", secondDateSpecific);
      console.log("firstDateDuration:", firstDateDuration);
      console.log("secondDateDuration:", secondDateDuration);
    }, [
      activeGameType,
      categoryFilter,
      dateFilter,
      firstDateSpecific,
      secondDateSpecific,
      firstDateDuration,
      secondDateDuration,
    ]);

  return (
    <Box>
      <Typography sx={{ fontWeight: 700 }} variant="h4">
        STL Winning Summary Overview
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          width: "100%",
          mt: 4,
        }}
      >
        <Grid container spacing={2}>

          { dateFilter === "Specific Date" &&
          <Grid
            item
            xs={12}
            sm={8}
            md={8}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            {/* Left Side */}
            <Grid
              item
              xs={12}
              sm={4}
              md={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <FormControl>
                <InputLabel id="category-label">Filter by Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  value={categoryFilter}
                  label="Filter by Category"
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as categoryType)
                  } // Cast value to categoryType
                  IconComponent={() => (
                    <FilterListIcon style={{ pointerEvents: "none" }} /> // Prevent flipping
                  )}
                  sx={{ pr: 2 }}
                >
                  {categoryTypes.map((gameType) => (
                    <MenuItem key={gameType} value={gameType}>
                      {gameType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="First Date"
                  value={firstDateSpecific ? dayjs(firstDateSpecific) : null}
                  onChange={(newValue) =>
                    setFirstDateSpecific(newValue.toDate())
                  } // Correct setter function
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            {/* Right Side */}
            <Grid
              item
              xs={12}
              sm={4}
              md={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <FormControl>
                <InputLabel id="date-filter-label">Filter by Date</InputLabel>
                <Select
                  labelId="date-filter-label"
                  id="date-filter"
                  value={dateFilter}
                  label="Filter by Date"
                  onChange={(e) => setDateFilter(e.target.value as dateType)} // Cast value to dateType
                  IconComponent={() => (
                    <FilterListIcon style={{ pointerEvents: "none" }} /> // Prevent flipping
                  )}
                  sx={{ pr: 2 }}
                >
                  <MenuItem value="Specific Date">Specific Date</MenuItem>
                  <MenuItem value="Date Duration">Date Duration</MenuItem>
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Second Date"
                  value={secondDateSpecific ? dayjs(secondDateSpecific) : null}
                  onChange={(newValue) =>
                    setSecondDateSpecific(newValue.toDate())
                  } // Correct setter function
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          }

          { dateFilter === "Date Duration" &&
            <Grid
            item
            xs={12}
            sm={12}
            md={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            {/* Column 1 */}
            <Grid
              item
              xs={12}
              sm={3}
              md={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <FormControl>
                <InputLabel id="category-label">Filter by Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  value={categoryFilter}
                  label="Filter by Category"
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as categoryType)
                  } // Cast value to categoryType
                  IconComponent={() => (
                    <FilterListIcon style={{ pointerEvents: "none" }} /> // Prevent flipping
                  )}
                  sx={{ pr: 2 }}
                >
                  {categoryTypes.map((gameType) => (
                    <MenuItem key={gameType} value={gameType}>
                      {gameType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="First Date"
                  value={firstDateSpecific ? dayjs(firstDateSpecific) : null}
                  onChange={(newValue) =>
                    setFirstDateSpecific(newValue.toDate())
                  } // Correct setter function
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            {/* Column 2 */}
            <Grid
              item
              xs={12}
              sm={3}
              md={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <FormControl>
                <InputLabel id="date-filter-label">Filter by Date</InputLabel>
                <Select
                  labelId="date-filter-label"
                  id="date-filter"
                  value={dateFilter}
                  label="Filter by Date"
                  onChange={(e) => setDateFilter(e.target.value as dateType)} // Cast value to dateType
                  IconComponent={() => (
                    <FilterListIcon style={{ pointerEvents: "none" }} /> // Prevent flipping
                  )}
                  sx={{ pr: 2 }}
                >
                  <MenuItem value="Specific Date">Specific Date</MenuItem>
                  <MenuItem value="Date Duration">Date Duration</MenuItem>
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Second Date"
                  value={secondDateSpecific ? dayjs(secondDateSpecific) : null}
                  onChange={(newValue) =>
                    setSecondDateSpecific(newValue.toDate())
                  } // Correct setter function
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            {/* Column 3 */}
            <Grid
              item
              xs={12}
              sm={3}
              md={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Spacer Box */}
              <Box
                sx={{
                  height: "56px", // Adjust height to match the height of the Select component
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="First Date"
                  value={firstDateDuration ? dayjs(firstDateDuration) : null}
                  onChange={(newValue) =>
                    setFirstDateDuration(newValue.toDate())
                  } // Correct setter function
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            {/* Column 4 */}
            <Grid
              item
              xs={12}
              sm={3}
              md={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Spacer Box */}
              <Box
                sx={{
                  height: "56px", // Adjust height to match the height of the Select component
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Second Date"
                  value={secondDateDuration ? dayjs(secondDateDuration) : null}
                  onChange={(newValue) =>
                    setSecondDateDuration(newValue.toDate())
                  } // Correct setter function
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>       
          }
        </Grid>

        {/* Summary of Total Bettors and Bets Barchart */}
        <ChartWinnersandWinningsSummary 
          categoryFilter = { categoryFilter }
          dateFilter = { dateFilter }
          firstDateSpecific={ formattedFirstDateSpecific }
          secondDateSpecific={ formattedSecondDateSpecific }
          firstDateDuration={ formattedFirstDateDuration }
          secondDateDuration = { formattedSecondDateDuration }
        />
        {/* Regional Summary of Total Bettors and Bets Barchart */}
        <ChartWinnersandWinningsRegionalSummary 
          categoryFilter = { categoryFilter }
          dateFilter = { dateFilter }
          firstDateSpecific={ formattedFirstDateSpecific }
          secondDateSpecific={ formattedSecondDateSpecific }
          firstDateDuration={ formattedFirstDateDuration }
          secondDateDuration = { formattedSecondDateDuration }
        />
      </Box>
    </Box>
  );
};

export default WinningComparison;