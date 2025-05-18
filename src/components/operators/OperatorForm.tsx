import React, { useCallback, useEffect, useState } from "react";
import UpdateModalPage from "~/components/ui/modals/UpdateModalData";
import { useOperatorsData } from "../../../store/useOperatorStore";
import { useModalStore } from "../../../store/useModalStore";
import { fetchGameCategories } from "~/services/userService";
import {
  fetchCityData,
  fetchProvinceData,
  fetchRegionData,
} from "~/services/locationService";
import { operatorConfig } from "~/config/operatorFormFields";
import { useOperatorFormStore } from "../../../store/useOperatorFormStore";
import CreateModalDataPage from "../ui/modals/CreateModalData";
import { operatorSchema } from "~/schemas/operatorSchema";
import OperatorViewPage from "./OperatorView";
import { useRouter } from "next/router";
import axiosInstance from "~/utils/axiosInstance";
// REMOVE THIS LINE:
// import OperatorsView from '~/pages/Protected/operators-view';

export const OperatorFieldFormPage: React.FC = () => {
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
  const { modalOpen, modalType, selectedData, closeModal } = useModalStore();
  const { query } = useRouter();
  const operatorId = query.id as string;

  const [operatorData, setOperatorData] = useState(null);
  useEffect(() => {
    fetchGameCategories(setGameTypes);
    fetchRegionData(setRegions);
    fetchProvinceData(setProvinces);
    fetchCityData(setCities);
  }, []);

  useEffect(() => {
    if (operatorId) {
      axiosInstance.get(`/api/operators/${operatorId}`)
        .then((res) => setOperatorData(res.data));
    }
  }, [operatorId]);

  useEffect(() => {
    const updatedFields = operatorConfig.fields.map((field) => {
      if (field.name === "gameTypes") {
        return {
          ...field,
          options: gameTypes.map((gameType) => ({
            value: gameType.GameCategoryId,
            label: gameType.GameCategory,
          })),
        };
      }
      if (field.name === "regions") {
        return {
          ...field,
          options: regions.map((region) => ({
            value: region.RegionId,
            label: region.RegionName,
          })),
        };
      }
      if (field.name === "provinces") {
        const filteredProvinces = provinces.filter(
          (province) => province.RegionId === selectedRegion
        );
        return {
          ...field,
          options: filteredProvinces.map((province) => ({
            value: province.ProvinceId,
            label: province.ProvinceName,
          })),
        };
      }
      if (field.name === "cities") {
        const filteredCities = cities.filter(
          (city) => city.ProvinceId === selectedProvince
        );
        return {
          ...field,
          options: filteredCities.map((city) => ({
            value: city.CityId,
            label: `${city.CityName} (${city.ProvinceKey})`,
          })),
        };
      }
      return field;
    });

    setFields(updatedFields);
  }, [
    gameTypes,
    regions,
    provinces,
    cities,
    selectedRegion,
    selectedProvince,
    setFields,
  ]);

  return (
    <div className="p-4">
      {modalType === "create" && (
        <CreateModalDataPage
          open={modalOpen}
          onClose={closeModal}
          fields={fields}
          endpoint={operatorConfig.endpoint}
          provinces={provinces}
          regions={regions}
          cities={cities}
          selectedRegion={selectedRegion}
          selectedProvince={selectedProvince}
          schema={operatorSchema}
        />
      )}
      <OperatorViewPage
        initialUserData={operatorData}
        // other props...
      />
    </div>
  );
};
