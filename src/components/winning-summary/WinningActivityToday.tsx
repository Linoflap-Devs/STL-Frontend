import { useState, useEffect, useRef } from "react";
import { Box, Typography, Divider } from "@mui/material";
import MoneyIcon from "@mui/icons-material/AttachMoney";
import fetchHistoricalRegion from "~/utils/api/GetHistoricalRegion";

// Define types
interface RegionData {
  Region: string;
  totalBetAmount: number;
  trend?: number;
}

const WinningActivityToday = () => {
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevRegionDataRef = useRef<RegionData[]>([]); // Use ref to store previous data

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching historical region data...");
      const response = await fetchHistoricalRegion({});

      console.log("Raw API Response:", response);

      // Validate response
      if (!response || typeof response !== "object" || !Array.isArray(response.data)) {
        throw new Error("Invalid API response format.");
      }

      // Aggregate totalBetAmount per Region
      const aggregatedData: Record<string, number> = {};
      response.data.forEach((item:any) => {
        if (!item.Region) return;
        const region = item.Region;
        const betAmount = Number(item.TotalBetAmount) || 0; // Ensure it's a number

        aggregatedData[region] = (aggregatedData[region] || 0) + betAmount;
      });

      console.log("Aggregated Data:", aggregatedData);

      // Convert to array and sort
      const data: RegionData[] = Object.entries(aggregatedData).map(([Region, totalBetAmount]) => ({
        Region,
        totalBetAmount,
      }));

      const sortedData = data.sort((a, b) => b.totalBetAmount - a.totalBetAmount);
      console.log("Sorted Data:", sortedData);

      // Optimize trend calculation using a Map for fast lookup
      const prevDataMap = new Map(prevRegionDataRef.current.map((r, index) => [r.Region, index]));

      const updatedData = sortedData.map((region, index) => {
        const prevIndex = prevDataMap.get(region.Region);
        const trend = prevIndex === undefined ? 0 : prevIndex - index;
        return { ...region, trend };
      });

      console.log("Final Data with Trends:", updatedData);

      // Update state and store previous data
      prevRegionDataRef.current = updatedData;
      setRegionData(updatedData);
    } catch (error: any) {
      console.error("Error fetching data:", error.message || error);
      setError(`Failed to load data: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#171717", padding: 2, borderRadius: "10px" }}>
      <Box sx={{ display: "flex", mb: 1 }}>
        <Box sx={{ backgroundColor: "#2F2F2F", padding: "5px", borderRadius: "5px" }}>
          <MoneyIcon sx={{ color: "#67ABEB" }} />
        </Box>
        <Typography sx={{ fontWeight: 300, fontSize: "16px", ml: 1, color: "#fff" }}>
          Winning Activity by Region Today
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#303030", mb: "1rem" }} />

      {loading ? (
        <Typography sx={{ color: "#fff", textAlign: "center" }}>Loading betting activity...</Typography>
      ) : error ? (
        <Typography sx={{ color: "red", textAlign: "center" }}>{error}</Typography>
      ) : (
        <Box sx={{ mt: 2, width: "100%" }}>
          {regionData.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", padding: "5px 0" }}>
              <Box sx={{ display: "flex", alignItems: "center", width: "15%" }}>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: item.trend! > 0 ? "#3d8440" : item.trend! < 0 ? "#894747" : "#aaa",
                  }}
                >
                  {item.trend! > 0 ? `+${item.trend}` : item.trend! < 0 ? `${item.trend}` : "0"}
                </Typography>
              </Box>
              <Typography sx={{ color: "#fff", flex: 1, ml: 2 }}>{item.Region}</Typography>
              <Typography
                sx={{
                  color: "#67ABEB",
                  fontWeight: "bold",
                  textAlign: "center",
                  flex: 1,
                }}
              >
                ₱{item.totalBetAmount.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default WinningActivityToday;
