import React, { useEffect } from "react";
import { useRouter } from "next/router";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import useUserRoleStore from "../../../../store/useUserStore";
import CardsPage from "~/components/ui/dashboardcards/CardsData";
import ChartsDataPage from "~/components/ui/charts/UserChartsData";
import dayjs from "dayjs";
import UserFieldFormPage from "~/components/user/UserForm";
import { fetchMapOperators, fetchUsers } from "~/services/userService";
import { User } from "~/types/types";
import { getUserStatus } from "~/utils/dashboarddata";
import { Button } from "@mui/material";

const roleMap: Record<string, { label: string; textlabel: string; roleId: number }> = {
  managers: { label: "Small Town Lottery Manager", textlabel: "Managers", roleId: 2 },
  executive: { label: "Small Town Lottery Executive", textlabel: "Executives", roleId: 3 },
};

const RolePage = () => {
  const {
    data,
    setData,
    columns,
    setColumns,
  } = useUserRoleStore();

  const router = useRouter();
  const { role } = router.query;
  const pagetype = window.location.pathname.includes("manager") ? "manager" : "executive";
  const operatorMap = useUserRoleStore((state) => state.operatorMap);
  const setOperatorMap = useUserRoleStore((state) => state.setOperatorMap);
  const roleString = typeof role === "string" ? role : role?.[0];
  const roleConfig = roleString ? roleMap[roleString.toLowerCase()] : null;
  const roleId = roleConfig?.roleId;

  useEffect(() => {
    fetchMapOperators(setOperatorMap);
  }, [setOperatorMap]);

  useEffect(() => {
    if (roleId !== undefined) {
      fetchUsers(roleId, setData);
    }
  }, [roleId, setData]);

  // columns in the table
  useEffect(() => {
    if (roleId) {
      setColumns([
        { key: "fullName", label: "Name", sortable: true, filterable: false },
        {
          key: "OperatorDetails.OperatorName",
          label: "Company Name",
          sortable: true,
          filterable: false,
          render: (user: User) => {
            const operator = operatorMap[user.OperatorId];
            return operator ? operator.OperatorName : "No operator assigned";
          },
        },
        {
          key: "DateOfRegistration",
          label: "Creation Date",
          sortable: true,
          filterable: true,
          render: (row: User) => row.DateOfRegistration ? dayjs(row.DateOfRegistration).format("YYYY-MM-DD") : "",
        },
        { key: "CreatedBy", label: "Created By", sortable: true, filterable: true },
        {
          key: "Status",
          label: "Status",
          sortable: true,
          filterable: true,
          render: (user: User) => {
            const sevenDaysAgo = dayjs().subtract(7, "days");
            const status = getUserStatus(user, sevenDaysAgo);
            return (
              <Button
                variant="contained"
                sx={{
                  cursor: "auto",
                  textTransform: "none",
                  borderRadius: "12px",
                  padding: "2px 13px",
                  fontSize: "12px",
                  backgroundColor:
                    status === "Suspended"
                      ? "#FF7A7A"
                      : status === "Inactive"
                        ? "#FFA726"
                        : "#046115",
                  color: "#ffff",
                  "&:hover": {
                    backgroundColor:
                      status === "Suspended"
                        ? "#F05252"
                        : status === "Inactive"
                          ? "#FFA726"
                          : "#046115",
                  },
                }}
              >
                {status}
              </Button>
            );
          },
        },
      ]);
    }
  }, [roleId, setColumns, operatorMap]);

  if (!roleConfig) {
    return (
      <div className="container mx-auto px-0 py-1">
        <h1 className="text-2xl font-semibold mb-4">Role not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto px-0 py-1">
      <h1 className="text-3xl font-bold mb-3">{roleConfig.label}</h1>
      <CardsPage
        dashboardData={data}
        roleLabel={roleConfig.label || ""}
        textlabel={roleConfig.textlabel || ""}
      />
      <ChartsDataPage
        pageType={pagetype}
        dashboardData={data}
      />
      <>
        <DetailedTable
          data={data}
          columns={columns}
          pageType={pagetype}
          operatorMap={operatorMap}

          roleId={roleId}
          statsPerRegion={data}
        />
        <UserFieldFormPage
          operatorMap={operatorMap}
          setOperatorMap={setOperatorMap} />
      </>
    </div>
  );
};

export default RolePage;
