import React, { useState, useEffect } from "react";
import { FaBroadcastTower } from "react-icons/fa";
import { getTodaysWinningCombination } from "../../utils/api/winningcombinations";
import { fetchRegions, fetchProvinces } from "../../utils/api/location";
import Select from "react-select";
import { fetchGameCategories } from "~/utils/api/gamecategories";

const DrawResultsPage = () => {
  // States for filters
  const [selectedRegion, setSelectedRegion] = useState<number | "">("");
  const [selectedProvince, setSelectedProvince] = useState<number | "">("");
  const [selectedGameCategory, setSelectedGameCategory] = useState<number | "">(
    ""
  );
  const [filteredWinningCombinations, setFilteredWinningCombinations] =
    useState<any[]>([]);

  // Data states
  const [regions, setRegions] = useState<
    { RegionName: string; RegionId: number; Region: string }[]
  >([]);
  const [provinces, setProvinces] = useState<
    {
      ProvinceName: string;
      ProvinceId: number;
      Province: string;
      RegionId: number;
    }[]
  >([]);
  const [gameCategories, setGameCategories] = useState<
    { GameCategoryId: number; GameCategory: string }[]
  >([]);
  const [winningCombinations, setWinningCombinations] = useState<
    {
      RegionId: number;
      RegionName: string;
      ProvinceId: number;
      ProvinceName: string;
      GameTypeId: number;
      GameType: string;
      GameCategoryId: number;
      GameCategory: string;
      GameScheduleID: number;
      WinningCombinationOne: string;
      WinningCombinationTwo: string;
      WinningCombinationThree?: string;
      WinningCombinationFour?: string;
    }[]
  >([]);

  // Prepare options for selects
  const gameCategoryOptions = gameCategories.map((cat) => ({
    value: cat.GameCategoryId,
    label: cat.GameCategory,
  }));

  const regionOptions = regions.map((region) => ({
    value: region.RegionId,
    label: region.RegionName,
  }));

  // Filter provinces based on selectedRegion
  const filteredProvinceOptions = provinces
    .filter((p) => selectedRegion === "" || p.RegionId === selectedRegion)
    .map((province) => ({
      value: province.ProvinceId,
      label: province.ProvinceName,
    }));

  // Find selected options
  const selectedGameCategoryOption = gameCategoryOptions.find(
    (option) => option.value === Number(selectedGameCategory)
  );
  const selectedRegionOption = regionOptions.find(
    (option) => option.value === Number(selectedRegion)
  );
  const selectedProvinceOption = filteredProvinceOptions.find(
    (option) => option.value === Number(selectedProvince)
  );

  // Load regions on mount
  useEffect(() => {
    const loadRegions = async () => {
      const response = await fetchRegions();
      if (response.success) {
        setRegions(response.data);
      } else {
        console.error("Failed to fetch regions:", response.message);
      }
    };
    loadRegions();
  }, []);

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      const response = await fetchProvinces();
      if (response.success) {
        // Filter out RegionId === 0 (as your original code did)
        const filtered = response.data.filter((p: any) => p.RegionId !== 0);
        setProvinces(filtered);
      } else {
        console.error("Failed to fetch provinces:", response.message);
      }
    };
    loadProvinces();
  }, []);

  // Load game categories on mount
  useEffect(() => {
    const loadGameCategories = async () => {
      const response = await fetchGameCategories();
      if (response.success) {
        setGameCategories(response.data);
      } else {
        console.error("Failed to fetch game categories:", response.message);
      }
    };
    loadGameCategories();
  }, []);

  // Load winning combinations only when provinces, regions, and gameCategories are loaded
  useEffect(() => {
    const loadWinningCombinations = async () => {
      const response = await getTodaysWinningCombination();
      if (response.success) {
        // Enrich data with names from provinces, regions, and gameCategories
        const enrichedCombinations = response.data.map((combination: any) => {
          const matchedProvince = provinces.find(
            (prov) => Number(prov.ProvinceId) === Number(combination.ProvinceId)
          );
          const matchedRegion = regions.find(
            (reg) => Number(reg.RegionId) === Number(combination.RegionId)
          );
          const matchedGameCategory = gameCategories.find(
            (cat) =>
              Number(cat.GameCategoryId) === Number(combination.GameCategoryId)
          );

          return {
            ...combination,
            ProvinceName: matchedProvince?.ProvinceName || "Unknown Province",
            RegionName: matchedRegion?.RegionName || "Unknown Region",
            GameCategory:
              matchedGameCategory?.GameCategory || "Unknown Game Category",
          };
        });
        setWinningCombinations(enrichedCombinations);
      } else {
        console.error(
          "Failed to fetch winning combinations:",
          response.message
        );
      }
    };

    if (
      provinces.length > 0 &&
      regions.length > 0 &&
      gameCategories.length > 0
    ) {
      loadWinningCombinations();
    }
  }, [provinces, regions, gameCategories]);

  useEffect(() => {
    console.log("🔍 useEffect triggered with:");
    console.log("Selected Region:", selectedRegion);
    console.log("Selected Province:", selectedProvince);
    console.log("Selected Game Category:", selectedGameCategory);
    console.log("Original winningCombinations:", winningCombinations);

    let filtered = winningCombinations;

    const regionId = selectedRegion ? Number(selectedRegion) : null;
    const provinceId = selectedProvince ? Number(selectedProvince) : null;
    const gameCategoryId = selectedGameCategory
      ? Number(selectedGameCategory)
      : null;

    console.log("Parsed filter values:", {
      regionId,
      provinceId,
      gameCategoryId,
    });

    if (regionId !== null) {
      filtered = filtered.filter((c) => c.RegionId === regionId);
      console.log(`✅ Filtered by RegionId (${regionId}):`, filtered);
    }

    if (provinceId !== null) {
      filtered = filtered.filter((c) => c.ProvinceId === provinceId);
      console.log(`✅ Filtered by ProvinceId (${provinceId}):`, filtered);
    }

    if (gameCategoryId !== null) {
      filtered = filtered.filter((c) => c.GameCategoryId === gameCategoryId);
      console.log(
        `✅ Filtered by GameCategoryId (${gameCategoryId}):`,
        filtered
      );
    }

    setFilteredWinningCombinations(filtered);
    console.log("✅ Final filtered combinations set:", filtered);
  }, [
    selectedRegion,
    selectedProvince,
    selectedGameCategory,
    winningCombinations,
  ]);

  // Helper
  const displayValue = (value: string | number) => {
    return value === 0 || value === "0" ? "0" : value || "\u00A0";
  };

  const displayInGrid = true;
  const totalBoxes = 4;

  return (
    <div className="bg-transparent p-4 rounded-xl border border-[#0038A8]">
      <div className="flex mb-2 items-center">
        <div className="bg-[#0038A8] p-1 rounded-lg">
          <FaBroadcastTower size={24} color={"#F6BA12"} />
        </div>
        <p className="text-base ml-4">Draw Results Today</p>
      </div>
      <div className="h-px bg-[#303030] mb-4" />

      <div className="flex gap-4 w-full mt-2 mb-4">
        {/* Game Category Select */}
        <div className="w-full relative">
          <label
            htmlFor="gamecategory-select"
            className="block text-sm font-medium mb-1"
          >
            Select a Game Category
          </label>
          <Select
            id="gamecategory-select"
            value={selectedGameCategoryOption ?? null}
            onChange={(option) => setSelectedGameCategory(option?.value || "")}
            options={gameCategoryOptions}
            placeholder="Select a Game Category"
            classNamePrefix="react-select"
            styles={{
              control: (provided, state) => ({
                ...provided,
                backgroundColor: "#F6BA12",
                borderRadius: "0.5rem",
                padding: "0.25rem",
                borderColor: state.isFocused ? "#555" : provided.borderColor,
                boxShadow: state.isFocused
                  ? "0 0 0 1px #555"
                  : provided.boxShadow,
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 10,
              }),
            }}
          />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        {/* Region Select */}
        <div className="w-full relative">
          <label
            htmlFor="region-select"
            className="block text-sm font-medium mb-1"
          >
            Select a Region
          </label>
          <Select
            id="region-select"
            value={selectedRegionOption ?? null}
            onChange={(option) => {
              setSelectedRegion(option?.value ?? "");
              setSelectedProvince("");
            }}
            options={regionOptions}
            placeholder="Select a Region"
            classNamePrefix="react-select"
            styles={{
              control: (provided, state) => ({
                ...provided,
                backgroundColor: "#F6BA12",
                borderRadius: "0.5rem",
                padding: "0.25rem",
                borderColor: state.isFocused ? "#555" : provided.borderColor,
                boxShadow: state.isFocused
                  ? "0 0 0 1px #555"
                  : provided.boxShadow,
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 10,
              }),
            }}
          />
        </div>

        {/* Province Select */}
        <div className="w-full relative">
          <label
            htmlFor="province-select"
            className="block text-sm font-medium mb-1"
          >
            Select a Province
          </label>
          <Select
            id="province-select"
            value={selectedProvinceOption ?? null}
            onChange={(option) => setSelectedProvince(option?.value || "")}
            options={filteredProvinceOptions}
            placeholder="Select a Province"
            isDisabled={!selectedRegion}
            classNamePrefix="react-select"
            styles={{
              control: (provided, state) => ({
                ...provided,
                backgroundColor: "#F6BA12",
                borderRadius: "0.5rem",
                padding: "0.25rem",
                borderColor: state.isFocused ? "#555" : provided.borderColor,
                boxShadow: state.isFocused
                  ? "0 0 0 1px #555"
                  : provided.boxShadow,
                opacity: !selectedRegion ? 0.5 : 1,
                cursor: !selectedRegion ? "not-allowed" : "default",
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 10,
              }),
            }}
          />
        </div>
      </div>

      <div className="mt-4 w-full">
        {(!selectedRegion || !selectedProvince) ? (
          <div className="bg-[#F6BA12] border border-[#F6BA12] p-8 rounded-lg">
            <p className="text-center text-base">Please select from the filter</p>
          </div>
        ) : (
          <div className="flex gap-4 justify-between w-full">
            {[1, 2, 3].map((gameTypeId) => {
              const item = filteredWinningCombinations.find(
                (combo) => combo.GameScheduleID === gameTypeId
              );

              // Determine boxes count fallback to 2 if no item
              const gameCategoryId = item?.GameCategoryId ?? 0;
              const totalBoxes =
                gameCategoryId >= 4 ? 4 : gameCategoryId >= 3 ? 3 : 2;
              const displayInGrid = totalBoxes > 2;

              return (
                <div key={gameTypeId} className="flex-1">
                  <p className="text-sm font-light mb-1">
                    {gameTypeId === 1
                      ? "First Draw"
                      : gameTypeId === 2
                      ? "Second Draw"
                      : "Third Draw"}
                  </p>
                  <div
                    className={`flex ${displayInGrid ? "flex-wrap" : "flex-nowrap"} gap-2 w-full`}
                  >
                    {/* Box 1 */}
                    <div
                      className={`bg-transparent border border-[#0038A8] rounded-lg p-2 flex items-center justify-center ${
                        displayInGrid ? "w-[calc(50%-4px)]" : "flex-1"
                      }`}
                    >
                      <p className="font-bold text-2xl">
                        {displayValue(item?.WinningCombinationOne ?? "-")}
                      </p>
                    </div>

                    {/* Box 2 */}
                    <div
                      className={`bg-transparent border border-[#0038A8] rounded-lg p-2 flex items-center justify-center ${
                        displayInGrid ? "w-[calc(50%-4px)]" : "flex-1"
                      }`}
                    >
                      <p className="font-bold text-2xl">
                        {displayValue(item?.WinningCombinationTwo ?? "-")}
                      </p>
                    </div>

                    {/* Box 3 */}
                    {totalBoxes >= 3 && (
                      <div className="bg-transparent border border-[#0038A8] rounded-lg p-2 flex items-center justify-center w-[calc(50%-4px)] mt-1">
                        <p className="font-bold text-2xl">
                          {displayValue(item?.WinningCombinationThree ?? "-")}
                        </p>
                      </div>
                    )}

                    {/* Box 4 */}
                    {totalBoxes >= 4 && (
                      <div className="bg-transparent border border-[#0038A8] rounded-lg p-2 flex items-center justify-center w-[calc(50%-4px)] mt-1">
                        <p className="font-bold text-2xl">
                          {displayValue(item?.WinningCombinationFour ?? "-")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default DrawResultsPage;
