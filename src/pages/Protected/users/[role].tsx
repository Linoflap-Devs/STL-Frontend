import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import ChartsDataPage from "~/components/ui/charts/UserChartsData";
import UserFieldFormPage from "~/components/user/UserFormData";
import { userTableColumns } from "~/config/userTableColumns";
import useUserRoleStore from "../../../../store/useUserStore";
import { userRoleFormFields } from "~/config/userFormFields";
import CardsPage from "~/components/user/CardsData";
import { addUser, fetchUsers } from "~/utils/api/users";
import AddUserModal from "~/components/user/AddUser";
import { User } from "~/types/types";
import { RegionUser } from "~/types/interfaces";

const roleMap: Record<string, { label: string; textlabel: string; roleId: number }> = {
  managers: {
    label: "Small Town Lottery Manager",
    textlabel: "Managers",
    roleId: 2,
  },
  executive: {
    label: "Small Town Lottery Executive",
    textlabel: "Executives",
    roleId: 3,
  },
};

const RolePage = () => {
  const { query } = useRouter();
  const role = query.role as string;
  const roleKey = role?.toLowerCase().includes("manager")
    ? "manager"
    : "executive";
  const roleConfig = roleMap[role?.toLowerCase() || ""];

  const operatorMap = useUserRoleStore((state) => state.operatorMap);
  const setOperatorMap = useUserRoleStore((state) => state.setOperatorMap);
  const { data, setData } = useUserRoleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (roleConfig?.roleId) {
      fetchUsers(roleConfig.roleId, setData).then((map) => {
        if (map) setOperatorMap(map);
      });
    }
  }, [roleConfig, setData]);

  console.log("DATA USER", data);

  if (!roleConfig) {
    return (
      <div className="container mx-auto px-0 py-1">
        <h1 className="text-2xl font-semibold mb-4">Role not found</h1>
      </div>
    );
  }

  const { roleId, label, textlabel } = roleConfig;
  const tableColumns = userTableColumns(operatorMap);
  const endpoint = userRoleFormFields[roleKey]?.endpoint;

  console.log("operatormappp", operatorMap);
  const openModal = () => setIsModalOpen(true);

  // Function to close modal
  const closeModal = () => setIsModalOpen(false);

  // Helper function (can be extracted)
  const toRegionUser = (
    user: any
  ): (RegionUser & { OperatorName?: string }) | null => {
    const region =
      typeof user.region === "string"
        ? user.region
        : typeof user.region === "object" && user.region?.RegionName
          ? user.region.RegionName
          : user.OperatorRegion?.RegionName;

    if (typeof region === "string") {
      return {
        ...user,
        region, // region is guaranteed string here
        OperatorName: user.OperatorDetails?.OperatorName,
      };
    }
    return null;
  };

  // In your parent component render:
  const normalizedData = data
    .map(toRegionUser)
    .filter((u): u is RegionUser & { OperatorName?: string } => u !== null);

  const handleAddUser = async (data: User): Promise<void> => {
    try {
      console.log("Adding user:", data);

      const result = await addUser(data);

      if (result.success) {
        console.log("User added successfully:", result.data);
        fetchUsers(roleConfig.roleId, setData);
      } else {
        console.error("Failed to add user:", result.message);
        // Optionally show error to the user
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error(
        "Unexpected error in handleAddUser:",
        (error as Error).message
      );
    }
  };

  return (
    <div className="mx-auto px-0 py-1">
      <h1 className="text-3xl font-bold mb-3">{label}</h1>
      <CardsPage dashboardData={data} roleLabel={label} textlabel={textlabel} />
      <ChartsDataPage pageType={roleKey} dashboardData={normalizedData} />
      <DetailedTable
        data={data}
        columns={tableColumns}
        pageType={roleKey}
        operatorMap={operatorMap}
        roleId={roleId}
        statsPerRegion={data}
        endpoint={endpoint ?? { create: "", update: "" }}
        source="users"
        onAddClick={openModal}
      />
      {/* <UserFieldFormPage
        operatorMap={operatorMap}
        setOperatorMap={setOperatorMap}
      /> */}

      {/* // create modal only opens when called */}
      <AddUserModal
        open={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddUser}
        operatorMap={operatorMap}
        userTypeId={roleId}
      />

     {/* view/update modal only opens when called */}

     
    </div>
  );
};

export default RolePage;
