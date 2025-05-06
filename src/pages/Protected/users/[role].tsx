import React, { useEffect } from "react";
import { useRouter } from "next/router";
import DetailedTable from "~/components/ui/tables/DetailedTable";
import { getUsersData } from "~/utils/api/users/get.users.service";
import { getOperatorsData } from "~/utils/api/operators/get.operators.service";
import { User, Operator, GetUsersResponse, GetOperatorsResponse } from "~/types/interfaces";
import useUserRoleStore from "../../../../store/useUserStore";
import dayjs from "dayjs";

const roleMap: Record<string, { label: string; roleId: number }> = {
  managers: { label: "Small Town Lottery Manager", roleId: 2 },
  executive: { label: "Small Town Lottery Executive", roleId: 3 },
};

const RolePage = () => {
  const router = useRouter();
  const { role } = router.query;
  const operatorMap = useUserRoleStore((state) => state.operatorMap);
  const setOperatorMap = useUserRoleStore((state) => state.setOperatorMap);
  const { data, setData, columns, setColumns, setRoleId } = useUserRoleStore();

  // Handle the case when role is an array or string
  const roleString = typeof role === "string" ? role : role?.[0];

  const roleConfig = roleString ? roleMap[roleString.toLowerCase()] : null;
  const roleId = roleConfig?.roleId;

  useEffect(() => {
    if (roleId) {
      setRoleId(roleId);
    }
  }, [roleId, setRoleId]);

  // First useEffect: Fetch operator data
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const operatorResponse = await getOperatorsData<GetOperatorsResponse>("/operators/getOperators");
        console.log("Operator Response:", operatorResponse); // Debugging line

        if (operatorResponse.success && Array.isArray(operatorResponse.data?.data)) {
          const operatorMap = operatorResponse.data.data.reduce(
            (map: { [key: number]: Operator }, operator: Operator) => {
              map[operator.OperatorId] = operator;
              return map;
            },
            {}
          );
          console.log("Operator Map in main:", operatorMap); // Debugging line
          setOperatorMap(operatorMap); // Set operatorMap in Zustand store
        } else {
          setOperatorMap({}); // Handle invalid operator response
        }
      } catch (error) {
        console.error("Error fetching operator data:", error);
      }
    };

    fetchOperators();
  }, [setOperatorMap]);

  // Second useEffect: Fetch user data
  useEffect(() => {
    const fetchUsers = async () => {
      if (roleId) {
        try {
          const userResponse = await getUsersData<GetUsersResponse>("/users/getUsers", { roleId });
          //console.log("User Response:", userResponse);

          if (userResponse.success && Array.isArray(userResponse.data?.data)) {
            const filteredUsers = userResponse.data.data.filter((user: User) => user.UserTypeId === roleId);
            setData(filteredUsers.length > 0 ? filteredUsers : []);
            //console.log("Filtered Users:", filteredUsers);
          } else {
            setData([]);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setData([]); // Handle API error case
        }
      }
    };

    fetchUsers();
  }, [roleId, setData]);

  useEffect(() => {
    if (roleId) {
      setColumns([
        { key: "FirstName", label: "Name", sortable: true, filterable: true },
        {
          key: "OperatorDetails.OperatorName",
          label: "Company Name",
          sortable: true,
          filterable: true,
          filterKey: "OperatorDetails.OperatorName",
          render: (user: User) => {
            const operator = operatorMap[user.OperatorId];
            return operator ? operator.OperatorName : "No operator";
          },
        },
        {
          key: "DateOfRegistration",
          label: "Creation Date",
          sortable: true,
          filterable: true,
          filterKey: "DateOfRegistration",
          render: (row: User) => row.DateOfRegistration ? dayjs(row.DateOfRegistration).format("YYYY-MM-DD") : "",
        },
        { key: "CreatedBy", label: "Created By", sortable: true, filterable: true },
        { key: "Status", label: "Status", sortable: true, filterable: true },
      ]);
    }
  }, [roleId, setColumns, operatorMap]);

  // If roleConfig is not found, display "Role not found"
  if (!roleConfig) {
    return (
      <div className="container mx-auto px-0 py-1">
        <h1 className="text-2xl font-semibold mb-4">Role not found</h1>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-0 py-1">
      <h1 className="text-3xl font-bold mb-4">{roleConfig.label}</h1>
      <DetailedTable
        data={data}
        columns={columns}
        operatorMap={operatorMap}
        pageType={roleString === "managers" ? "manager" : "executive"}
        onCreate={() => {
          console.log(`Create new ${roleString}`);
        }}
      />
    </div>
  );
};

export default RolePage;