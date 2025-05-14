import { GetLocationResponse } from "~/types/interfaces";
import { getLocation } from "~/utils/api/location/get.location.service";

const handleFetch = async (
  endpoint: string,
  setState: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const response = await getLocation<GetLocationResponse>(endpoint);
    if (response.success && Array.isArray(response.data?.data)) {
      const fetchedData = response.data.data;
      // console.log(`Fetched data from ${endpoint}:`, fetchedData);
      setState(fetchedData);
    } else {
      setState([]);
    }
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    setState([]);
  }
};

export const fetchRegionData = (setRegionData: React.Dispatch<React.SetStateAction<any>>) => {
  return handleFetch("/location/getRegions", setRegionData);
};

export const fetchProvinceData = (setProvinceData: React.Dispatch<React.SetStateAction<any>>) => {
  return handleFetch("/location/getProvinces", setProvinceData);
};

export const fetchCityData = (setCityData: React.Dispatch<React.SetStateAction<any>>) => {
  return handleFetch("/location/getCities", setCityData);
};
