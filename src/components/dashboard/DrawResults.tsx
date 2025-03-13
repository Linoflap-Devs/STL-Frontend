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

const displayValue = (value: string | null) => (value ? value : "\u00A0");

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
        const data = Array.isArray(response.data) ? response.data : response.data.data;

        if (!Array.isArray(data)) {
          console.error("Invalid data format:", data);
          return;
        }

        const processedData = data.map((item) => ({
          ...item,
          WinningCombinationOne: item.WinningCombinationOne || "\u00A0",
          WinningCombinationTwo: item.WinningCombinationTwo || "\u00A0",
        }));

        const uniqueRegions = Array.from(
          new Map(
            processedData.map((item) => [item.RegionId, { RegionId: item.RegionId, Region: item.Region }])
          ).values()
        );
        setRegions(uniqueRegions);

        setWinningCombinations(processedData);
      } catch (error) {
        console.error("Error fetching winning combinations:", error);
      }
    };

    fetchWinningCombinations();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const filteredProvinces = winningCombinations.filter((item) => item.RegionId === Number(selectedRegion));
      const uniqueProvinces = Array.from(
        new Map(
          filteredProvinces.map((item) => [item.ProvinceId, { ProvinceId: item.ProvinceId, Province: item.Province }])
        ).values()
      );
      setProvinces(uniqueProvinces);
    } else {
      setProvinces([]);
    }
  }, [selectedRegion, winningCombinations]);

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

      <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
        <FormControl fullWidth>
          <InputLabel>Select a Region</InputLabel>
          <Select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedProvince("");
            }}
          >
            {regions.map((region) => (
              <MenuItem key={region.RegionId} value={region.RegionId}>
                {region.Region}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedRegion}>
          <InputLabel>Select a Province</InputLabel>
          <Select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
            {provinces.map((province) => (
              <MenuItem key={province.ProvinceId} value={province.ProvinceId}>
                {province.Province}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mt: 2, width: "100%" }}>
        {selectedRegion && !selectedProvince ? (
          <Typography sx={{ color: "#fff", textAlign: "center", fontSize: "16px" }}>
            Please select a province
          </Typography>
        ) : (
          <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", width: "100%" }}>
            {[1, 2, 3].map((gameTypeId) => (
              <Box key={gameTypeId} sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: "14px", fontWeight: 300, mb: 0.5 }}>
                  {gameTypeId === 1 ? "First Draw" : gameTypeId === 2 ? "Second Draw" : "Third Draw"}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                  {/* First Winning Number */}
                  <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                    <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}>
                      {displayValue(
                        winningCombinations.find(
                          (item) => item.GameTypeId === gameTypeId && item.RegionId === Number(selectedRegion)
                            && item.ProvinceId === Number(selectedProvince)
                        )?.WinningCombinationOne || "\u00A0"
                      )}
                    </Typography>
                  </Box>
                  {/* Second Winning Number */}
                  <Box sx={{ ...buttonNumberStyles, flex: 1 }}>
                    <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "36px" }}>
                      {displayValue(
                        winningCombinations.find(
                          (item) => item.GameTypeId === gameTypeId && item.RegionId === Number(selectedRegion)
                            && item.ProvinceId === Number(selectedProvince)
                        )?.WinningCombinationTwo || "\u00A0"
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DrawResultsPage;
