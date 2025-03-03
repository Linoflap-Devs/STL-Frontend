import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Button, Menu, MenuItem } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FilterListIcon from '@mui/icons-material/FilterList';

import fetchHistoricalSummary from "~/utils/api/transactions";
import useBettingStore from "../../../../store/useBettingStore"; 
import BettorsvsBetsPlacedPage from "~/components/betting-summary/BettorsvsBetsPlaced";
import BetsPlacedvsTotalWinningsPage from "~/components/betting-summary/BetsPlacedvsTotalWinnings";
import BetTimePage from "~/components/betting-summary/BetTime";

const BettingSummaryPage = () => {
  const { selectedFilter, setSelectedFilter } = useBettingStore();

  // Default to "All" to fetch all data initially
  useEffect(() => {
    if (!selectedFilter) setSelectedFilter("All");
  }, [selectedFilter, setSelectedFilter]);

  // States for date selection
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dropdown Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (filter: string) => {
    setSelectedFilter(filter);
    setAnchorEl(null);
    setSelectedDate(null);
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let queryParams = {};

        if (selectedFilter === "Specific Day" && selectedDate) {
          queryParams = { date: selectedDate.toLocaleDateString("en-CA") };
        } else if (selectedFilter === "Date Duration" && startDate && endDate) {
          queryParams = { startDate: startDate.toLocaleDateString("en-CA"), endDate: endDate.toLocaleDateString("en-CA") };
        }

        console.log("Fetching Data with params:", queryParams);

        const response = await fetchHistoricalSummary(queryParams);

        if (response.success) {
          let filteredData = response.data;

          if (selectedFilter === "Specific Day" && selectedDate) {
            const selectedDateString = selectedDate.toLocaleDateString("en-CA");
            filteredData = response.data.filter(
              (item: any) => item.TransactionDate.split("T")[0] === selectedDateString
            );
          } else if (selectedFilter === "Date Duration" && startDate && endDate) {
            const start = startDate.toLocaleDateString("en-CA");
            const end = endDate.toLocaleDateString("en-CA");

            filteredData = response.data.filter((item: any) => {
              const transactionDate = item.TransactionDate.split("T")[0];
              return transactionDate >= start && transactionDate <= end;
            });
          }

          console.log("Filtered Data:", filteredData);
          setData(filteredData);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, startDate, endDate, selectedFilter]);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#E3C9FF' }}>
        Small Town Lottery Betting Summary
      </Typography>

      {/* Filter Button and Date Picker */}
      <Box sx={{ mt: 4, mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        {/* Filter Button */}
        <Button
            sx={{
              borderRadius: '8px',
              width: "150px",
              paddingY: 1,
              textAlign: "left",
              textTransform: 'none',
              backgroundColor: "#7266C9", // Default background color
              fontSize: '1.2rem',
              flexShrink: 0,
              color: '#FFFFFF', // Set text color to white for better contrast
              "&:hover": {
                backgroundColor: '#8A7DD6', // Slightly lighter shade for hover
              },
            }}
            variant="contained"
            onClick={handleClick}
            endIcon={<FilterListIcon />}
          >
            <Typography sx={{ fontWeight: 300, fontSize: '13px', textAlign: 'left', width: '100%' }}>
              {selectedFilter || "All"}
            </Typography>
          </Button>
        
        
        {/* Filter Options Menu */}
        <Menu
          sx={{ 
            mt: 1,
            "& .MuiPaper-root": { // Target the dropdown menu paper
              backgroundColor: "#7266C9", // Set background color for the dropdown
              borderRadius: "12px",
            },
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose(selectedFilter)}
        >
          {["All", "Specific Day", "Date Duration"].map((filter) => (
            <MenuItem
              key={filter}
              onClick={() => handleClose(filter)}
              sx={{
                textAlign: 'left',
                fontSize: '13px',
                backgroundColor: "#7266C9", // Set background color for each option
                color: '#FFFFFF', // Set text color to white for better contrast
                "&:hover": { 
                  backgroundColor: '#5A4FBF', // Slightly darker shade for hover
                },
              }}
            >
              {filter}
            </MenuItem>
          ))}
        </Menu>
        

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
  {/* Date Pickers Based on Filter Selection */}
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    {selectedFilter === "Specific Day" && (
      <DatePicker
        sx={{
          width: "220px",
          height: "35px",
          border: "1px solid #D1D5DB",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          "& .MuiInputBase-root": {
            paddingLeft: "15px",
            height: "100%",
          },
          "& .MuiOutlinedInput-input": {
            textAlign: "left",
            padding: "0",
            display: "flex",
            alignItems: "center",
            height: "100%",
            fontSize: "12px",
          },
          "& fieldset": {
            display: "none",
          },
          "& legend": {
            display: "none",
          },
        }}
        // label="Select Specific Date"
        value={selectedDate}
        onChange={(newValue) => {
          if (newValue) {
            console.log("New Selected Date:", newValue.toLocaleDateString("en-CA"));
            setSelectedDate(newValue);
          }
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            placeholder: "Select Specific Date",
            InputLabelProps: {
              shrink: true,
            },
          },
        }}
      />
    )}

    {selectedFilter === "Date Duration" && (
      <>
        <DatePicker
          sx={{
            width: "220px",
            height: "35px",
            border: "1px solid #D1D5DB",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            "& .MuiInputBase-root": {
              paddingLeft: "15px",
              height: "100%",
            },
            "& .MuiOutlinedInput-input": {
              textAlign: "left",
              padding: "0",
              display: "flex",
              alignItems: "center",
              height: "100%",
              fontSize: "12px",
            },
            "& fieldset": {
              display: "none",
            },
            "& legend": {
              display: "none",
            },
          }}
          // label="Select Start Date"
          value={startDate}
          onChange={(newValue) => {
            if (newValue) {
              console.log("New Start Date:", newValue.toISOString().split("T")[0]);
              setStartDate(newValue);
            }
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              placeholder: "Select Start Date",
              InputLabelProps: {
                shrink: true,
              },
            },
          }}
        />

        {/* Hyphen Separator */}
        <Typography sx={{ fontSize: "20px", fontWeight: "bold", color: "#6B7280" }}>
          -
        </Typography>

        <DatePicker
          sx={{
            width: "220px",
            height: "35px",
            border: "1px solid #D1D5DB",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            "& .MuiInputBase-root": {
              paddingLeft: "15px",
              height: "100%",
            },
            "& .MuiOutlinedInput-input": {
              textAlign: "left",
              padding: "0",
              display: "flex",
              alignItems: "center",
              height: "100%",
              fontSize: "12px",
            },
            "& fieldset": {
              display: "none",
            },
            "& legend": {
              display: "none",
            },
          }}
          // label="Select End Date"
          value={endDate}
          onChange={(newValue) => {
            if (newValue) {
              console.log("New End Date:", newValue.toISOString().split("T")[0]);
              setEndDate(newValue);
            }
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              placeholder: "Select End Date",
              InputLabelProps: {
                shrink: true,
              },
            },
          }}
        />
      </>
    )}
  </LocalizationProvider>
</Box>


              {/* Export All as CSV Button */}
              <Button
          sx={{
            borderRadius: '8px',
            paddingY: 1,
            paddingX: 2,
            textTransform: 'none',
            backgroundColor: "#CCA1FD",
            color: '#181A1B',
            fontSize: '12px', 
            fontWeight: 400,
            lineHeight: '14.63px',
            "&:hover": {
              backgroundColor: '#B183E8',
            },
            marginLeft: 'auto',
            width: '145px',
            height: '34px',
          }}
          variant="contained"
          onClick={() => console.log("Exporting All as CSV")}
        >
          Export All as CSV
        </Button>
      </Box>

      {/* Loading & Error Handling */}
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Typography color="error">{error}</Typography>}

      {/* Render charts only when data is available */}
      {data && !loading && !error && (
        <>
          {/* Debugging */}
          {/* <Typography sx={{ fontSize: 14, color: "#666", textAlign: "center" }}>
            Data loaded successfully. Check console for debugging.
          </Typography> */}
          <BettorsvsBetsPlacedPage data={data}/>
          <BetsPlacedvsTotalWinningsPage data={data}/>
          <BetTimePage data={data} />
        </>
      )}
    </Box>
  );
};

export default BettingSummaryPage;