import React, { useCallback, useEffect, useState } from "react";
import OperatorViewPage from "~/components/operators/OperatorView";
import { useOperatorFormStore } from "../../../../store/useOperatorFormStore";
import {
  fetchCityData,
  fetchProvinceData,
  fetchRegionData,
} from "~/services/locationService";
import { fetchGameCategories } from "~/services/userService";
import { useOperatorsData } from "../../../../store/useOperatorStore";
import { operatorConfig } from "~/config/operatorFormFields";
import { operatorSchema } from "~/schemas/operatorSchema";
import { useModalStore } from "../../../../store/useModalStore";
import { Operator } from "~/types/types";

export interface OperatorViewPageProps {
  slug: string;
  operator: Operator;
}

const OperatorsView: React.FC<OperatorViewPageProps> = ({ slug, operator }) => {
  const {
    gameTypes,
    regions,
    provinces,
    cities,
    selectedRegion,
    selectedProvince,
    setGameTypes,
    setRegions,
    setProvinces,
    setCities,
  } = useOperatorFormStore();

  const { fields, setFields } = useOperatorsData();
  const { setSelectedData } = useModalStore();

  // mount 
  useCallback(() => {
    if (operator) {
      setSelectedData(operator);
    }
  }, [operator, setSelectedData]);

  // Fetch gameTypes and location data once on mount
  useEffect(() => {
    Promise.all([
      fetchGameCategories(setGameTypes),
      fetchRegionData(setRegions),
      fetchProvinceData(setProvinces),
      fetchCityData(setCities),
    ]).catch(console.error);
  }, [setGameTypes, setRegions, setProvinces, setCities]);

  // Update form fields options
  useEffect(() => {
    const updatedFields = operatorConfig.fields.map((field) => {
      if (field.name === "gameTypes") {
        return {
          ...field,
          options: gameTypes.map((g) => ({
            value: g.GameCategoryId,
            label: g.GameCategory,
          })),
        };
      }
      if (field.name === "regions") {
        return {
          ...field,
          options: regions.map((r) => ({
            value: r.RegionId,
            label: r.RegionName,
          })),
        };
      }
      if (field.name === "provinces") {
        const filtered = provinces.filter((p) => p.RegionId === selectedRegion);
        return {
          ...field,
          options: filtered.map((p) => ({
            value: p.ProvinceId,
            label: p.ProvinceName,
          })),
        };
      }
      if (field.name === "cities") {
        const filtered = cities.filter((c) => c.ProvinceId === selectedProvince);
        return {
          ...field,
          options: filtered.map((c) => ({
            value: c.CityId,
            label: `${c.CityName} (${c.ProvinceKey})`,
          })),
        };
      }
      return field;
    });

    setFields(updatedFields);
  }, [gameTypes, regions, provinces, cities, selectedRegion, selectedProvince, setFields]);

  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col w-full md:w-2/3">
        <div className="bg-gray-100 p-4 rounded mb-4">
          <p className="text-sm text-gray-600">
            Slug: <strong>{slug}</strong>
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <OperatorViewPage
            fields={fields}
            endpoint={operatorConfig.endpoint}
            initialUserData={operator}
            gameTypes={gameTypes}
            provinces={provinces}
            regions={regions}
            cities={cities}
            schema={operatorSchema}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full md:w-1/3">
        <div className="bg-gray-100 p-4 rounded">Right Column</div>
      </div>
    </div>
  );
};

export default OperatorsView;
