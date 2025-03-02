import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";

import { buttonDrawStyles, buttonNumberStyles } from "../../styles/theme";

interface DrawResultsProps {
  value1?: number | string | null;
  value2?: number | string | null;
}

const DrawResultsPage: React.FC<DrawResultsProps> = ({
  value1 = "04",
  value2 = "20",
}) => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const displayValue = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) {
      return <Typography sx={{ padding: "0.8rem" }}>{"\u00A0"}</Typography>;
    }
    if (typeof value === "string" && value.trim() === "") {
      return (
        <Typography sx={{ paddingY: "1rem", paddingX: "0.6rem" }}>
          {"\u00A0"}
        </Typography>
      );
    }
    return value;
  };

  return (
    <Box
      sx={{
        backgroundColor: "#171717",
        padding: 2,
        borderRadius: "10px",
      }}
    >
      <Box sx={{ display: "flex", mb: 1 }}>
        <Box sx={{ backgroundColor: "#2F2F2F" }}>
          <CasinoIcon sx={{ color: "#67ABEB" }} />
        </Box>
        <Typography sx={{ fontWeight: 300, fontSize: "16px", ml: 1 }}>
          Draw Results Today
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#303030", mb: "1rem" }} />

      <Box
        sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}
      >
        {/* Region Select */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Region</InputLabel>
            <Select
              name="Region"
              fullWidth
              displayEmpty
              sx={{ backgroundColor: "#171717", color: "#fff" }}
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    mt: 1.5,
                    backgroundColor: "#171717",
                    border: "1px solid white",
                  },
                },
              }}
            >
              <MenuItem value="option1" sx={{ py: 0.5 }}>
                Option 1
              </MenuItem>
              <MenuItem value="option2" sx={{ py: 0.5 }}>
                Option 2
              </MenuItem>
              <MenuItem value="option3" sx={{ py: 0.5 }}>
                Option 3
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Province Select */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Province</InputLabel>
            <Select
              name="Province"
              fullWidth
              displayEmpty
              sx={{ backgroundColor: "#171717", color: "#fff" }}
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    mt: 1.5,
                    backgroundColor: "#171717",
                    border: "1px solid white",
                  },
                },
              }}
            >
              <MenuItem value="option1" sx={{ py: 0.5 }}>
                Option 1
              </MenuItem>
              <MenuItem value="option2" sx={{ py: 0.5 }}>
                Option 2
              </MenuItem>
              <MenuItem value="option3" sx={{ py: 0.5 }}>
                Option 3
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ mt: 2, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {/* First Draw */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.2 }}
            >
              First Draw
            </Typography>
            <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
              <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                <Typography
                  sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}
                >
                  {displayValue(value1)}
                </Typography>
              </Box>
              <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                <Typography
                  sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}
                >
                  {displayValue(value2)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Second Draw */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.2 }}
            >
              Second Draw
            </Typography>
            <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
              <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                <Typography
                  sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}
                >
                  {displayValue(value1)}
                </Typography>
              </Box>
              <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                <Typography
                  sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}
                >
                  {displayValue(value2)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Third Draw */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.2 }}
            >
              Third Draw
            </Typography>
            <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
              <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                <Typography
                  sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}
                >
                  {displayValue(value1)}
                </Typography>
              </Box>
              <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                <Typography
                  sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}
                >
                  {displayValue(value2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DrawResultsPage;
