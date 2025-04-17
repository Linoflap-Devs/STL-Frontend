import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import CreateManager from "~/components/user/CreateUser";
import UpdateManager from "~/components/user/UpdateUser";
import { fetchUsers } from "~/utils/api/users";
import { fetchOperators } from "~/utils/api/operators";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import UsersTablePage from "~/components/user/UsersTable";

const UsersSkeletonPage = dynamic(() =>
  import("~/components/user/UsersSkeleton").then((mod) => ({
    default: mod.UsersSkeletonPage,
  }))
);

const UserDashboardPage = React.lazy(
  () => import("~/components/user/UsersDashboard")
);

export interface User {
  UserId: number | null;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  suffix: string;
  Status?: any;
  remarks?: string;
  OperatorId?: number | null;
  OperatorName?: any;
  LastUpdatedDate?: string | null;
  [key: string]: any;
}

const roleMap: Record<string, { label: string; roleId: number }> = {
  managers: { label: "Small Town Lottery Manager", roleId: 2 },
  executive: { label: "Small Town Lottery Executive", roleId: 3 },
};

const UsersPage = () => {
  const router = useRouter();
  const { role } = router.query;
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedManager, setSelectedManager] = useState<User | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [operators, setOperators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Determine the configuration for the role based on the `role` string
  const roleConfig =
    typeof role === "string" ? roleMap[role.toLowerCase()] : null;

  // Extract the `roleId` from the `roleConfig` if available
  const roleId = roleConfig?.roleId;

  const fallback = (value: any, defaultValue: string | null) => {
    return value !== null && value !== undefined ? value : defaultValue;
  };

  // fetching of data
  const loadData = async () => {
    if (!roleId) return;

    setLoading(true); // Start loading

    try {
      const [userResponse, operatorResponse] = await Promise.all([
        fetchUsers({}),
        fetchOperators(),
      ]);

      if (userResponse.success && operatorResponse.success) {
        const operatorMap = operatorResponse.data.reduce(
          (map: any, operator: any) => {
            map[operator.OperatorId] = operator;
            return map;
          },
          {}
        );

        const filteredUsers = userResponse.data
          .filter((user: any) => user.UserTypeId === roleId)
          .map((user: any) => ({
            userId: fallback(user.UserId, null),
            FirstName: fallback(user.FirstName, "N/A"),
            LastName: fallback(user.LastName, "N/A"),
            Suffix: fallback(user.Suffix, ""),
            Email: fallback(user.Email, "N/A"),
            DateOfRegistration: fallback(user.DateOfRegistration, "N/A"),
            CreatedBy: fallback(user.CreatedBy, "N/A"),
            OperatorDetails: fallback(operatorMap[user.OperatorId], null),
            LastLogin: fallback(user.LastLogin, "N/A"),
            LastTokenRefresh: fallback(user.LastTokenRefresh, "N/A"),
          }));

        setUsers(filteredUsers);
        setOperators(operatorResponse.data);
      }
    } catch (error) {
      console.error("Error fetching users/operators:", error);
    } finally {
      setLoading(false); // Finish loading regardless of success/failure
    }
  };

  useEffect(() => {
    if (roleId) loadData();
  }, [roleId, refresh]);

  const getUserStatus = (user: any, sevenDaysAgo: dayjs.Dayjs): string => {
    let status = "Active";

    if (user.IsActive === 0) {
      status = "Suspended";
    } else if (
      user.LastLogin &&
      dayjs(user.LastLogin).isBefore(sevenDaysAgo) &&
      user.LastTokenRefresh &&
      dayjs(user.LastTokenRefresh).isBefore(sevenDaysAgo)
    ) {
      status = "Inactive";
    } else if (
      user.DateOfRegistration &&
      dayjs(user.DateOfRegistration).isAfter(sevenDaysAgo)
    ) {
      status = "New";
    } else {
      console.log("Status remains Active");
    }

    return status;
  };

  const sevenDaysAgo = dayjs().subtract(7, "days");

  const handleUserCreate = () => {
    setSelectedUser(null);
    setUpdateModalOpen(false);
    setModalOpen(true);
  };

  const handleUserEdit = (user: User) => {
    setSelectedManager(user);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedManager(null);
  };

  const handleSubmitUser = async (userData: User | null) => {
    if (userData) setRefresh((prev) => !prev);
    setSelectedUser(null);
    setModalOpen(false);
  };

  const handleSaveUpdatedUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.userId === updatedUser.userId ? updatedUser : user
      )
    );
    setSelectedManager(null);
    setUpdateModalOpen(false);
    setRefresh((prev) => !prev);
  };

  const handleDeleteManager = (ids: number[]) => {
    setUsers((prev) => prev.filter((user) => !ids.includes(user.userId!)));
    setRefresh((prev) => !prev);
  };

  // Error case
  if (!roleId) {
    return (
      <Typography variant="h6" color="error">
        Invalid role route.
      </Typography>
    );
  }

  if (loading) {
    return <UsersSkeletonPage />;
  }

  return (
    <Suspense fallback={<UsersSkeletonPage />}>
      <React.Fragment>
        <div className="space-y-4">
          <div className="flex justify-between items-center my-2">
            <h4 className="font-bold text-4xl">{roleConfig?.label}</h4>
          </div>

          {/* User Dashboard Page */}
          <div>
            <UserDashboardPage
              roleId={roleId}
              getUserStatus={getUserStatus}
              users={users}
              sevenDaysAgo={sevenDaysAgo}
            />
          </div>

          {/* Manager Table Section */}
          <div>
            <UsersTablePage
              onCreate={handleUserCreate}
              onEdit={handleUserEdit}
              users={users}
              onDelete={handleDeleteManager}
              onSubmit={handleSubmitUser}
              getUserStatus={getUserStatus}
              sevenDaysAgo={sevenDaysAgo}
            />
          </div>

          {/* Create Manager Modal */}
          <CreateManager
            open={isModalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleSubmitUser}
            userData={selectedUser}
            operators={operators}
          />

          {/* Update Manager Modal */}
          {isUpdateModalOpen && (
            <UpdateManager
              open={isUpdateModalOpen}
              onClose={closeUpdateModal}
              onSubmit={handleSaveUpdatedUser}
              users={selectedManager}
              getUserStatus={getUserStatus}
              sevenDaysAgo={sevenDaysAgo}
              fallback={(value, defaultValue) =>
                value != null ? value : defaultValue
              }
            />
          )}
        </div>
      </React.Fragment>
    </Suspense>
  );
};

export default UsersPage;
