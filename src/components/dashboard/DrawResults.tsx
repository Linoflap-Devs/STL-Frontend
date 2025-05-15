import React, { useState, useEffect } from "react";
import { FaBroadcastTower } from "react-icons/fa";
import { getTodaysWinningCombination } from "../../utils/api/winningcombinations";

const displayValue = (value: string | null) => (value ? value : "\u00A0");

const DrawResultsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedGameType, setSelectedGameType] = useState("");
  const [regions, setRegions] = useState<
    { RegionId: number; Region: string }[]
  >([]);
  const [provinces, setProvinces] = useState<
    { ProvinceId: number; Province: string }[]
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

  useEffect(() => {
    const fetchWinningCombinations = async () => {
      try {
        const response = await getTodaysWinningCombination();
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data;

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
            processedData.map((item) => [
              item.RegionId,
              { RegionId: item.RegionId, Region: item.RegionName },
            ])
          ).values()
        );
        console.log(uniqueRegions);
        setRegions(uniqueRegions);

        setWinningCombinations(processedData);
        console.log(winningCombinations);
      } catch (error) {
        console.error("Error fetching winning combinations:", error);
      }
    };

    fetchWinningCombinations();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const filteredProvinces = winningCombinations.filter(
        (item) => item.RegionId === Number(selectedRegion)
      );
      const uniqueProvinces = Array.from(
        new Map(
          filteredProvinces.map((item) => [
            item.ProvinceId,
            { ProvinceId: item.ProvinceId, Province: item.ProvinceName },
          ])
        ).values()
      );
      setProvinces(uniqueProvinces);
    } else {
      setProvinces([]);
    }
  }, [selectedRegion, winningCombinations]);

  useEffect(() => {
    if (selectedProvince) {
      const filteredProvinces = winningCombinations.filter(
        (item) => item.ProvinceId === Number(selectedProvince)
      );
      const gameCategories = Array.from(
        new Map(
          filteredProvinces.map((item) => [
            item.GameCategoryId,
            {
              GameCategoryId: item.GameCategoryId,
              GameCategory: item.GameCategory,
            },
          ])
        ).values()
      );
      setGameCategories(gameCategories);
    } else {
      setGameCategories([]);
    }
  }, [selectedProvince, winningCombinations]);

  return (
  <div className="bg-transparent p-4 rounded-xl border border-[#0038A8]">
      <div className="flex mb-2 items-center">
        <div className="bg-[#2F2F2F] p-1 rounded-lg">
          <FaBroadcastTower size={24} color={"#67ABEB"}/>
        </div>
        <p className="text-base ml-2">Draw Results Today</p>
      </div>
      <div className="h-px bg-[#303030] mb-4" />

      <div className="flex gap-4 w-full">
        <div className="w-full relative">
          <label
            htmlFor="region-select"
            className="block text-sm font-medium mb-1"
          >
            Select a Region
          </label>

          <div className="relative">
            <select
              id="region-select"
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedProvince("");
              }}
              className="w-full appearance-none p-2 pr-10 rounded-lg bg-transparent border border-[#404040] focus:outline-none focus:ring-1 focus:ring-[#555]"
            >
              <option className="bg-[#2F2F2F]" value="">
                Select a Region
              </option>
              {regions.map((region) => (
                <option
                  key={region.RegionId}
                  value={region.RegionId}
                  className="bg-[#2F2F2F] text-white"
                >
                  {region.Region}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-white">
              <svg
                className="w-3 h-3 fill-current"
                viewBox="0 0 10 6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0l5 6 5-6H0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <div className="w-full relative">
            <label
              htmlFor="province-select"
              className="block text-sm font-medium mb-1"
            >
              Select a Province
            </label>
            <div className="relative">
              <select
                id="province-select"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                disabled={!selectedRegion}
                className="w-full appearance-none p-2 pr-10 rounded-lg bg-transparent border border-[#404040] focus:outline-none focus:ring-1 focus:ring-[#555] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option className="bg-[#2F2F2F]" value="">
                  Select a Province
                </option>
                {provinces.map((province) => (
                  <option
                    key={province.ProvinceId}
                    value={province.ProvinceId}
                    className="bg-[#2F2F2F]"
                  >
                    {province.Province}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                <svg
                  className="w-3 h-3 fill-current"
                  viewBox="0 0 10 6"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0l5 6 5-6H0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full mt-4">
        <div className="w-full relative">
          <label
            htmlFor="gametype-select"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Select a Game Type
          </label>

          <div className="relative">
            <select
              id="gametype-select"
              value={selectedGameType}
              onChange={(e) => {
                setSelectedGameType(e.target.value);
                console.log(selectedGameType);
              }}
              disabled={!selectedProvince}
              className="w-full appearance-none p-2 pr-10 rounded-lg bg-transparent border border-[#404040] focus:outline-none focus:ring-1 focus:ring-[#555] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option className="bg-[#2F2F2F]" value="">
                Select a Game Type
              </option>
              {gameCategories.map((category) => (
                <option
                  key={category.GameCategoryId}
                  value={category.GameCategory}
                  className="bg-[#2F2F2F]"
                >
                  {category.GameCategory}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
              <svg
                className="w-3 h-3 fill-current"
                viewBox="0 0 10 6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0l5 6 5-6H0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full">
        {selectedRegion && !selectedProvince ? (
          <div className="bg-[#2F2F2F] p-8 rounded-lg">
            <p className="text-white text-center text-base">
              Please select a province
            </p>
          </div>
        ) : (
          <div className="flex gap-4 justify-between w-full">
            {[1, 2, 3].map((gameTypeId) => {
              // Find the selected game category details
              const selectedCategoryDetails = gameCategories.find(
                (category) => category.GameCategory === selectedGameType
              );

              // Find the winning combination for this draw
              const winningCombo = winningCombinations.find(
                (item) =>
                  item.GameScheduleID === gameTypeId &&
                  item.RegionId === Number(selectedRegion) &&
                  item.ProvinceId === Number(selectedProvince) &&
                  item.GameCategory === selectedGameType
              );

              // Get the GameCategoryId from either the winning combo or the selected category
              const gameCategoryId =
                winningCombo?.GameCategoryId ||
                selectedCategoryDetails?.GameCategoryId ||
                0;

              // Number of boxes to display based on GameCategoryId
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
                    className={`flex ${displayInGrid ? "flex-wrap" : "flex-nowrap"} gap-1 w-full`}
                  >
                    {/* First Winning Number */}
                    <div
                      className={`bg-transparent border border-[#0038A8] rounded-lg p-4 flex items-center justify-center ${displayInGrid ? "w-[calc(50%-4px)]" : "flex-1"}`}
                    >
                      <p className="text-white font-bold text-3xl lg:text-2xl">
                        {displayValue(
                          winningCombo?.WinningCombinationOne || "\u00A0"
                        )}
                      </p>
                    </div>

                    {/* Second Winning Number */}
                    <div
                      className={`bg-transparent border border-[#0038A8] rounded-lg p-4 flex items-center justify-center ${displayInGrid ? "w-[calc(50%-4px)]" : "flex-1"}`}
                    >
                      <p className="text-white font-bold text-3xl lg:text-2xl">
                        {displayValue(
                          winningCombo?.WinningCombinationTwo || "\u00A0"
                        )}
                      </p>
                    </div>

                    {/* Third Winning Number - Only shown if needed */}
                    {totalBoxes >= 3 && (
                      <div
                        className={`bg-transparent border border-[#0038A8] rounded-lg p-4 flex items-center justify-center w-[calc(50%-4px)] mt-1`}
                      >
                        <p className="font-bold text-3xl">
                          {displayValue(
                            winningCombo?.WinningCombinationThree || "\u00A0"
                          )}
                        </p>
                      </div>
                    )}

                    {/* Fourth Winning Number - Only shown if needed */}
                    {totalBoxes >= 4 && (
                      <div
                        className={`bg-transparent border border-[#0038A8] rounded-lg p-4 flex items-center justify-center w-[calc(50%-4px)] mt-1`}
                      >
                        <p className="font-bold text-3xl">
                          {displayValue(
                            winningCombo?.WinningCombinationFour || "\u00A0"
                          )}
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
