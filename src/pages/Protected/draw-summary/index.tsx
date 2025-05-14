import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FormControl, InputLabel, MenuItem, Select, styled } from "@mui/material";
import { selectDrawStyles } from "~/styles/theme";
import HotNumberPage from "~/components/draw-summary/HotNumbers";
import DrawResultsSummaryPage from "~/components/draw-summary/DrawResultsSummary";
import ColdNumberPage from "~/components/draw-summary/ColdNumbers";
import DrawCounterTablePage from "~/components/draw-summary/DrawCounterTable";
import { fetchProvinces, fetchRegions } from "~/utils/api/location";
import { set } from "zod";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import { fetchDrawSummary } from "~/utils/api/transactions";

const DashboardSkeletonPage = dynamic(() =>
  import("~/components/dashboard/DashboardSkeleton").then((mod) => ({
    default: mod.DashboardSkeletonPage,
  }))
);

const DrawListSummaryPage = React.lazy(
  () => import("~/components/draw-summary/DrawListSummary")
);



const DrawSelectedPage = () => {

  const [regions, setRegions] = useState<{label: string, value: string}[]> ([]);
  const [provinces, setProvinces] = useState<any[]> ([]);
  const [gameCategories, setGameCategories] = useState<{label: string, value: string}[]> ([]);
  const [filteredProvinces, setFilteredProvinces] = useState<{label: string, value: string}[]> ([]);
  
  const [selectedRegion, setSelectedRegion] = useState(1);
  const [selectedProvince, setSelectedProvince] = useState(1);
  const [selectedGameCategory, setSelectedGameCategory] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState((new Date()).getMonth() + 1);

  const [data, setData] = useState<any>({});

  const todayDate = new Date().getDate()

  // fetch data
  const fetchData = async () => {
    const dataFetch = await fetchDrawSummary(selectedProvince, selectedGameCategory, selectedMonth)
    setData(dataFetch.data)
    console.log(dataFetch)
  }
  
  const loadData = async () => {

    const regionFetch = await fetchRegions()
    console.log(regionFetch)
    setRegions(regionFetch.data.map((region: any) => {
      return {
        label: region.RegionName,
        value: region.RegionId.toString()
      }
    }))

    
    const provinceFetch = await fetchProvinces()
    console.log(provinceFetch)
    setProvinces(provinceFetch.data)
    setFilteredProvinces(provinceFetch.data.map((province: any) => {
      return {
        label: province.ProvinceName,
        value: province.ProvinceId.toString()
      }
    }))

    // default region
    setSelectedRegion(1)
    setSelectedProvince(1)

    const gameCategoryFetch = await fetchGameCategories()
    console.log(gameCategoryFetch)
    setGameCategories(gameCategoryFetch.data.map((gameCategory: any) => {
      return {
        label: gameCategory.GameCategory,
        value: gameCategory.GameCategoryId.toString()
      }
    }))
  }

  useEffect(() => {
    // Initial Fetch
    loadData()
    fetchData()
    console.log(data)
  }, [])

  useEffect(() => { 
    if(provinces.length > 0){
      const filteredProvinces = provinces.filter((province) => {
        return province.RegionId == selectedRegion
      })

      setFilteredProvinces(filteredProvinces.map((province: any) => {
        return {
          label: province.ProvinceName,
          value: province.ProvinceId.toString()
        }
      }))

      setSelectedProvince(filteredProvinces[0].ProvinceId)
    }
  }, [selectedRegion])

  useEffect(() => {
    if(selectedRegion != 0 && selectedProvince != 0 && selectedGameCategory != 0 && selectedMonth != 0){
      fetchData()
    }
  }, [selectedRegion, selectedProvince, selectedGameCategory, selectedMonth])

  const getTodayResults = (drawOrder: number) => {
    try {
      if(drawOrder == 1){
        const filtered = data.ResultSummary[todayDate-1][todayDate].FirstDraw
        console.log(`accessing data.ResultSummary[${todayDate-1}][${todayDate}].FirstDraw`)
        const numbers = [filtered.NumberOne || "-", filtered.NumberTwo || "-"]
        if(selectedGameCategory > 2) numbers.push(filtered.NumberThree || "-") 
        if(selectedGameCategory > 3) numbers.push(filtered.NumberFour || "-")
        
        return numbers
      }
  
      if(drawOrder == 2){
        const filtered = data.ResultSummary[todayDate-1][todayDate].SecondDraw
        const numbers = [filtered.NumberOne || "-", filtered.NumberTwo || "-"]
        if(selectedGameCategory > 2) numbers.push(filtered.NumberThree || "-")
        if(selectedGameCategory > 3) numbers.push(filtered.NumberFour || "-")
        
        return numbers
      }
  
      if(drawOrder == 3){
        const filtered = data.ResultSummary[todayDate-1][todayDate].SecondDraw
        const numbers = [filtered.NumberOne || "-", filtered.NumberTwo || "-"]
        if(selectedGameCategory > 2) numbers.push(filtered.NumberThree || "-")
        if(selectedGameCategory > 3) numbers.push(filtered.NumberFour || "-")
        
        return numbers
      }
    }
    catch (err: unknown){
      return []
    }

  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row mb-3">
        <h1 className="text-3xl font-bold">
          STL Pares Provincial Draw Summary
        </h1>
      </div>

      {/* Input Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* First Select */}
        <FormControl sx={selectDrawStyles} fullWidth>
          <InputLabel id="select-1-label">Region</InputLabel>
          <Select
            labelId="select-1-label"
            id="select-1"
            label="Region"
            value={selectedRegion}
            onChange={
              (e: any) => {
                const val = e.target.value
                setSelectedRegion(val)
                setSelectedProvince(0)
              }
            }
          >
            {
              regions.map((region) => 
                  <MenuItem value={region.value}>{region.label}</MenuItem>
              )
            }
          </Select>
        </FormControl>

        {/* Second Select */}
        <FormControl sx={selectDrawStyles} fullWidth>
          <InputLabel id="select-2-label">Province</InputLabel>
          <Select
            labelId="select-2-label"
            id="select-2"
            label="Province"
            value={selectedProvince}
            onChange={
              (e: any) => {
                const val = e.target.value
                setSelectedProvince(val)
              }
            }
          >
            {
              filteredProvinces.map((province) => 
                  <MenuItem value={province.value}>{province.label}</MenuItem>
              )
            }
          </Select>
        </FormControl>

        {/* Third Select */}
        <FormControl sx={selectDrawStyles} fullWidth>
          <InputLabel id="select-3-label">Game Category</InputLabel>
          <Select
            labelId="select-3-label"
            id="select-3"
            label="Game Category"
            value={selectedGameCategory}
            onChange={
              (e: any) => {
                const val = e.target.value
                setSelectedGameCategory(val)
              }
            }
          >
            {
              gameCategories.map((gameCategory) => 
                  <MenuItem value={gameCategory.value}>{gameCategory.label}</MenuItem>
              )
            }
          </Select>
        </FormControl>

        {/* Fourth Select */}
        <FormControl sx={selectDrawStyles} fullWidth>
          <InputLabel id="select-4-label">Month</InputLabel>
          <Select
            labelId="select-4-label"
            id="select-4"
            label="Month"
            value={selectedMonth}
            onChange={
              (e: any) => {
                const val = e.target.value
                setSelectedMonth(val)
              }
            }
          >
            <MenuItem value="1">January</MenuItem>
            <MenuItem value="2">February</MenuItem>
            <MenuItem value="3">March</MenuItem>
            <MenuItem value="4">April</MenuItem>
            <MenuItem value="5">May</MenuItem>
            <MenuItem value="6">June</MenuItem>
            <MenuItem value="7">July</MenuItem>
            <MenuItem value="8">August</MenuItem>
            <MenuItem value="9">September</MenuItem>
            <MenuItem value="10">October</MenuItem>
            <MenuItem value="11">November</MenuItem>
            <MenuItem value="12">December</MenuItem>
          </Select>
        </FormControl>
      </div>


      <div className="flex flex-col items-center gap-4m mt-2">
        <div className="flex flex-col w-full gap-4">
          <h1 className="text-3xl font-bold">
            {filteredProvinces.find((province) => province.value == selectedProvince.toString())?.label} - {gameCategories.find((gameCategory) => gameCategory.value == selectedGameCategory.toString())?.label}
          </h1>
          <div className="flex flex-col md:flex-row w-full gap-2">
            <div className="flex flex-col w-full md:w-2/3">
            <div>
              <p className="text-md font-bold mb-1">
                Draw Results
              </p>
              {
                data && (
                  <DrawResultsSummaryPage 
                    firstDraw={getTodayResults(1) || []} 
                    secondDraw={getTodayResults(2) || []} 
                    thirdDraw={getTodayResults(3) || []} 
                  />
                )
              }
              <div className="flex gap-2">
                {
                  data?.HotNumbers && (
                    <HotNumberPage number={data?.HotNumbers[0]?.number || "-"} />
                  )
                }
                {
                  data?.ColdNumbers && (
                    <ColdNumberPage number={data?.ColdNumbers[0]?.number || "-"} />
                  )
                }
              </div>

              <div className="flex gap-2 mt-5">
                {
                  data && (
                    <DrawCounterTablePage numberArr={data?.FrequencyMap || []} gameCategory={selectedGameCategory} />
                  )
                }
              </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="flex flex-col gap-4 w-full md:w-1/3">
              <DrawListSummaryPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawSelectedPage;
