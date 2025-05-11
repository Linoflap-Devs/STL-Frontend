// services/userService.ts

import { GetOperatorsResponse, GetUsersResponse } from "~/types/interfaces";
import { Operator, User } from "~/types/types";
import { getOperatorsData } from "~/utils/api/operators/get.operators.service";
import { getUsersData } from "~/utils/api/users/get.users.service";

export const fetchUsers = async (
  roleId: number,
  setData: React.Dispatch<React.SetStateAction<any>>
) => {
  if (roleId) {
    try {
      const userResponse = await getUsersData<GetUsersResponse>("/users/getUsers", { roleId });
      if (userResponse.success && Array.isArray(userResponse.data?.data)) {
        const filteredUsers = userResponse.data.data
          .filter((user: User) => user.UserTypeId === roleId)
          .map((user: { FirstName: any; LastName: any; }) => ({
            ...user,
            fullName: [user.FirstName, user.LastName].filter(Boolean).join(" "),
          }));
        setData(filteredUsers.length > 0 ? filteredUsers : []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setData([]);
    }
  }
};

export const fetchOperators = async (
  setOperatorMap: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const operatorResponse = await getOperatorsData<GetOperatorsResponse>("/operators/getOperators");
    if (operatorResponse.success && Array.isArray(operatorResponse.data?.data)) {
      const operatorMap = operatorResponse.data.data.reduce((map: { [key: number]: Operator }, operator: Operator) => {
        map[operator.OperatorId] = operator;
        return map;
      }, {});
      setOperatorMap({ ...operatorMap });
    } else {
      setOperatorMap({});
    }
  } catch (error) {
    console.error("Error fetching operator data:", error);
    setOperatorMap({});
  }
};
