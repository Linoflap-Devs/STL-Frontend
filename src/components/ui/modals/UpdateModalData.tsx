import React, { useState, useEffect } from "react";
import { ModalPageProps } from "../../../types/interfaces";
import useUserRoleStore from "../../../../store/useUserStore";
import ReusableUpdateModalPage from "./UpdateModal";
import ReusableButton from "../buttons/ReusableSubmitButton";
import { getRoleName } from "~/utils/dashboarddata";

export const isManager = (roleId: number) => roleId === 2;
export const isExecutive = (roleId: number) => roleId === 3;

const UpdateModalPage: React.FC<ModalPageProps> = ({
  open,
  onClose,
  fields = [],
  endpoint = "",
  initialUserData,
  operatorMap,
  provinces = [],
  regions = [],
  cities = [],
  setSelectedRegion,
  setSelectedProvince,
  gameTypes = [],
}) => {
  useEffect(() => {}, [initialUserData]);

  const [loading, setLoading] = useState(false);
  const isOpen = open ?? true;
  const handleClose = onClose ?? (() => {});
  const { roleId } = useUserRoleStore();

  // Transform endpoint to the required type
  const formattedEndpoint =
    typeof endpoint === "string"
      ? { create: endpoint, update: endpoint }
      : endpoint;

  return (
    <>
      <ReusableUpdateModalPage
        isOpen={isOpen}
        onClose={handleClose}
        endpoint={formattedEndpoint}
        fields={fields}
        title={`${getRoleName(roleId ?? 0)}`}
        initialUserData={initialUserData}
        
        operatorMap={operatorMap}
        provinces={provinces}
        regions={regions}
        cities={cities}
        setSelectedRegion={setSelectedRegion ?? (() => {})}
        setSelectedProvince={setSelectedProvince ?? (() => {})}
        gameTypes={gameTypes}
      >
        {({ handleSubmit }) => (
          <ReusableButton
            handleSubmit={handleSubmit}
            loading={loading}
            label="Submit"
          />
        )}
      </ReusableUpdateModalPage>
    </>
  );
};

export default UpdateModalPage;
