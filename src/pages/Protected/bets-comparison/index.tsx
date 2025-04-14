import React from "react";
import {useState} from "react"
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
import FilterListIcon from '@mui/icons-material/FilterList';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const BettingComparison = () => {

  const [categoryFilter, setCategoryFilter] = useState("STL Pares")
  const [dateFilter, setDateFilter] = useState("Specific Date");
  const [firstDate, setFirstDate] = useState(dayjs("2025-02-07"));
  const [secondDate, setSecondDate] = useState(dayjs("2025-02-08"));


  return (
    <Box>
      <Typography sx={{ fontWeight: 700 }} variant="h4">
        STL Betting Summary Overview
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          width: "100%",
          mt: 2,
        }}
      >
        <Grid container spacing={2}>
          {/*Left Side*/}
          <Grid 
            item
            xs={12}
            sm={8}
            md={8}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}>
                <Grid 
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}>
                      <FormControl>
                        <InputLabel id="category-label">Filter by Category</InputLabel>
                        <Select
                          labelId="category-label"
                          id="category"
                          value={categoryFilter}
                          label="Filter by Category"
                          onChange={(e) => setCategoryFilter(e.target.value)} // Update state with selected value
                          IconComponent={() => (
                            <FilterListIcon style={{ pointerEvents: "none" }} /> // Prevent flipping
                          )}
                          sx={{pr: 2}}
                        >
                          <MenuItem value="STL Pares">STL Pares</MenuItem>
                          <MenuItem value="STL Swer2">STL Swer2</MenuItem>
                          <MenuItem value="STL Swer3">STL Swer3</MenuItem>
                          <MenuItem value="STL Swer4">STL Swer4</MenuItem>
                        </Select>
                      </FormControl>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="First Date"
                          value={secondDate}
                          onChange={(newValue) => setSecondDate(newValue)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                </Grid>
                <Grid 
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}>
                      <FormControl>
                          <InputLabel id="date-filter-label">Filter by Date</InputLabel>
                          <Select
                            labelId="date-filter-label"
                            id="date-filter"
                            value={dateFilter}
                            label="Filter by Date"
                            IconComponent={() => (
                              <FilterListIcon style={{ pointerEvents: "none" }} /> // Prevent flipping
                            )}
                            onChange={(e) => setDateFilter(e.target.value)}
                            sx={{pr: 2}}
                          >
                            <MenuItem value="Specific Date">Specific Date</MenuItem>
                            {/* Add more date filter options if needed */}
                          </Select>
                      </FormControl>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="First Date"
                          value={secondDate}
                          onChange={(newValue) => setSecondDate(newValue)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider> 
                </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BettingComparison;
