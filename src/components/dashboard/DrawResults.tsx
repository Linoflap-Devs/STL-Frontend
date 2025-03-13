import React, { useState, useEffect } from "react";
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
import getTodaysWinningCombination from "../../utils/api/winningcombinations";

const buttonNumberStyles = {
  backgroundColor: "#2F2F2F",
  borderRadius: "8px",
  textAlign: "center",
  padding: "8px 0",
};

const displayValue = (value: string | null) => (value ? value : "");

const DrawResultsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [regions, setRegions] = useState<{ RegionId: number; Region: string }[]>([]);
  const [provinces, setProvinces] = useState<{ ProvinceId: number; Province: string }[]>([]);
  const [winningCombinations, setWinningCombinations] = useState<
    {
      RegionId: number;
      Region: string;
      ProvinceId: number;
      Province: string;
      GameTypeId: number;
      GameType: string;
      WinningCombinationOne: string;
      WinningCombinationTwo: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchWinningCombinations = async () => {
      try {
        const response = await getTodaysWinningCombination();
        console.log("Raw API Response:", response.data);
        console.log("Response Keys:", Object.keys(response.data));

        const data = Array.isArray(response.data) ? response.data : response.data.data;

        if (!Array.isArray(data)) {
          console.error("Invalid data format:", data);
          return;
        }

        console.log("Fetched Data:", data);

        // Ensure missing WinningCombination values are replaced with "00"
        const processedData = data.map((item) => ({
          ...item,
          WinningCombinationOne: item.WinningCombinationOne || "==",
          WinningCombinationTwo: item.WinningCombinationTwo || "==",
        }));

        // Extract unique regions
        const uniqueRegions = Array.from(
          new Map(
            processedData.map((item) => [item.RegionId, { RegionId: item.RegionId, Region: item.Region }])
          ).values()
        );

        setRegions(uniqueRegions.length > 0 ? uniqueRegions : [{ RegionId: 0, Region: "Unknown Region" }]);

        // Extract unique provinces
        const filteredProvinces = selectedRegion
          ? processedData.filter((item) => item.RegionId === Number(selectedRegion))
          : processedData;

        const uniqueProvinces = Array.from(
          new Map(
            filteredProvinces.map((item) => [item.ProvinceId, { ProvinceId: item.ProvinceId, Province: item.Province }])
          ).values()
        );

        setProvinces(uniqueProvinces.length > 0 ? uniqueProvinces : [{ ProvinceId: 0, Province: "Unknown Province" }]);
        setWinningCombinations(processedData);
      } catch (error) {
        console.error("Error fetching winning combinations:", error);
      }
    };

    fetchWinningCombinations();
  }, [selectedRegion]);

  return (
    <Box sx={{ backgroundColor: "#171717", padding: 2, borderRadius: "10px" }}>
      <Box sx={{ display: "flex", mb: 1 }}>
        <Box sx={{ backgroundColor: "#2F2F2F" }}>
          <CasinoIcon sx={{ color: "#67ABEB" }} />
        </Box>
        <Typography sx={{ fontWeight: 300, fontSize: "16px", ml: 1 }}>
          Draw Results Today
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#303030", mb: "1rem" }} />

      {/* Region & Province Select Dropdowns */}
      <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
        <FormControl fullWidth>
          <InputLabel>Region</InputLabel>
          <Select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedProvince("");
            }}
          >
            <MenuItem value="">All Regions</MenuItem>
            {regions.map((region) => (
              <MenuItem key={region.RegionId} value={region.RegionId}>
                {region.Region}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Province</InputLabel>
          <Select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            disabled={!selectedRegion}
          >
            <MenuItem value="">All Provinces</MenuItem>
            {provinces.map((province) => (
              <MenuItem key={province.ProvinceId} value={province.ProvinceId}>
                {province.Province}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mt: 2, width: "100%" }}>
        {winningCombinations
          .filter(
            (item) =>
              (!selectedRegion || item.RegionId === Number(selectedRegion)) &&
              (!selectedProvince || item.ProvinceId === Number(selectedProvince))
          )
          .map((item, index) => (
            <Box key={index} sx={{ width: "100%", mt: 2 }}>
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
                {item.GameTypeId === 1 && (
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.2 }}>
                      First Draw
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                      <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}>
                          {displayValue(item.WinningCombinationOne)}
                        </Typography>
                      </Box>
                      <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}>
                          {displayValue(item.WinningCombinationTwo)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Second Draw */}
                {item.GameTypeId === 2 && (
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.2 }}>
                      Second Draw
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                      <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}>
                          {displayValue(item.WinningCombinationOne)}
                        </Typography>
                      </Box>
                      <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}>
                          {displayValue(item.WinningCombinationTwo)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Third Draw */}
                {item.GameTypeId === 3 && (
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.2 }}>
                      Third Draw
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                      <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}>
                          {displayValue(item.WinningCombinationOne)}
                        </Typography>
                      </Box>
                      <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}>
                          {displayValue(item.WinningCombinationTwo)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default DrawResultsPage;
