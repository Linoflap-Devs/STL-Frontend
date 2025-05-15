import React, { useEffect } from "react";
import { useRouter } from "next/router";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import CardsPage from "~/components/ui/dashboardcards/CardsData";
import ChartsDataPage from "~/components/ui/charts/UserChartsData";
import UserFieldFormPage from "~/components/user/UserFormData";
import { fetchMapOperators, fetchUsers } from "~/services/userService";
import { userTableColumns } from "~/config/userTableColumns";
import useUserRoleStore from "../../../../store/useUserStore";
import { userRoleFormFields } from "~/config/userFormFields";

const roleMap: Record<string, { label: string; textlabel: string; roleId: number }> = {
  managers: { label: "Small Town Lottery Manager", textlabel: "Managers", roleId: 2 },
  executive: { label: "Small Town Lottery Executive", textlabel: "Executives", roleId: 3 },
};

const RolePage = () => {
  const { query } = useRouter();
  const role = query.role as string;

  // Determine roleKey dynamically based on route
  const roleKey = role?.toLowerCase().includes("manager") ? "manager" : "executive";

  const roleConfig = roleMap[role?.toLowerCase() || ""];

  if (!roleConfig) {
    return (
      <div className="container mx-auto px-0 py-1">
        <h1 className="text-2xl font-semibold mb-4">Role not found</h1>
      </div>
    );
  }
  
  const { roleId, label, textlabel } = roleConfig;

  const operatorMap = useUserRoleStore((state) => state.operatorMap);
  const setOperatorMap = useUserRoleStore((state) => state.setOperatorMap);
  const { data, setData } = useUserRoleStore();
  const tableColumns = userTableColumns(operatorMap);

  useEffect(() => {
    fetchMapOperators(setOperatorMap);
    if (roleId) fetchUsers(roleId, setData);
  }, [roleId, setData, setOperatorMap]);

  const endpoint = userRoleFormFields[roleKey]?.endpoint;

  console.log("Create endpoint:", endpoint?.create);
  console.log("Update endpoint:", endpoint?.update);

  return (
    <div className="mx-auto px-0 py-1">
      <h1 className="text-3xl font-bold mb-3">{label}</h1>
      <CardsPage dashboardData={data} roleLabel={label} textlabel={textlabel} />
      <ChartsDataPage pageType={roleKey} dashboardData={data} />
      <DetailedTable
        data={data}
        columns={tableColumns}
        pageType={roleKey}
        operatorMap={operatorMap}
        roleId={roleId}
        statsPerRegion={data} // for csv
        endpoint={endpoint ?? { create: "", update: "" }}
      />
      <UserFieldFormPage operatorMap={operatorMap} setOperatorMap={setOperatorMap} />
    </div>
  );
};

export default RolePage;
