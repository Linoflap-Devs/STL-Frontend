import React from "react";
import { Box, Typography, Select, MenuItem, } from "@mui/material";

const DrawResults = () => {
  return (
    <Box>
      <Typography sx={{ fontColor: '#E3C9FF', fontWeight: 700, }} variant="h6">
        Official Draw Result
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="subtitle1">Select a Region</Typography>
        <Select
          name="Region"


          fullWidth
        >
          <MenuItem value="" disabled>
            Select Region
          </MenuItem>
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
          <MenuItem value="option3">Option 3</MenuItem>
        </Select>
      </Box>

    </Box>
  );
};

export default DrawResults;
