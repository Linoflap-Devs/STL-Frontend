import React, { useEffect } from "react";
import OperatorViewPage from "~/components/operators/OperatorView";
import { useOperatorFormStore } from "../../../../store/useOperatorFormStore";
import { fetchGameCategories } from "~/services/userService";
import {
  fetchCityData,
  fetchProvinceData,
  fetchRegionData,
} from "~/services/locationService";
import { useOperatorsData } from "../../../../store/useOperatorStore";
import { operatorConfig } from "~/config/operatorFormFields";
import { operatorSchema } from "~/schemas/operatorSchema";
import { useModalStore } from "../../../../store/useModalStore";

export interface OperatorViewPageProps {
  slug: string;
}

const OperatorsView: React.FC<OperatorViewPageProps> = ({ slug }) => {
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
  // Make sure selectedData is part of your useOperatorsData store or define it
  const { selectedData } = useModalStore();

  useEffect(() => {
    console.debug("[OperatorViewPage] Rendered with slug:", slug);
  }, [slug]);
  
  console.log(cities);

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
            initialUserData={selectedData}
            gameTypes={gameTypes}
            provinces={provinces}
            regions={regions}
            cities={cities}
            schema={operatorSchema} // import or define operatorSchema!
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
