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
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import router from "next/router";
import RetailReceiptOperatorsPage from "~/components/operators/RetailReceipts";

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
  useEffect(() => {
    if (operator) {
      setSelectedData(operator);
      console.log("HELLLO", operator);
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
        const filtered = cities.filter(
          (c) => c.ProvinceId === selectedProvince
        );
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
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center space-x-4">
        <IconButton
          aria-label="back"
          onClick={() => router.push("/operators")}
          sx={{
            backgroundColor: "#ACA993",
            width: 30,
            height: 30,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              backgroundColor: "#928F7F",
            },
          }}
        >
          <ArrowBackIosIcon
            style={{
              fontWeight: "bold",
              fontSize: 20,
              color: "#F8F0E3",
              paddingLeft: "7px",
            }}
          />
        </IconButton>

        <div className="text-2xl md:text-3xl font-bold truncate">
          {operator?.data?.OperatorName || "N/A"}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row md:gap-x-8 gap-y-4 w-full mt-1">
        {/* Left Side - Operator View */}
        <div className="flex flex-col w-full md:w-3/5">
          <OperatorViewPage
            fields={fields}
            endpoint={operatorConfig.endpoint}
            initialUserData={operator}
            gameTypes={gameTypes}
            provinces={provinces}
            regions={regions}
            cities={cities}
            schema={operatorSchema}
            isOpen={false}
            onClose={function (): void {
              throw new Error("Function not implemented.");
            }}
            children={function (props: {
              handleSubmit: () => void;
            }): React.ReactNode {
              throw new Error("Function not implemented.");
            }}
          />
        </div>

        {/* Right Side - Retail Receipt */}
        <div className="flex flex-col w-full md:w-2/5 min-w-0">
          <RetailReceiptOperatorsPage />
        </div>
      </div>
    </div>
  );
};

export default OperatorsView;
