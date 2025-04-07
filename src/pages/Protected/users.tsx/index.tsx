import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ManagerTable, { User } from '~/components/user/UsersTable';
import CreateManager from '~/components/user/CreateUser';
import UpdateManager from '~/components/user/UpdateUser';
import { fetchUsers } from '~/utils/api/users';
import { fetchOperators } from '~/utils/api/operators';

//import { fetchRegions, fetchProvinces } from '~/utils/api/location';
//const cities = require('philippines/cities');

interface UsersPageProps {
  roleId: number;
}

const UsersPage: React.FC<UsersPageProps> = ({ roleId, }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<User | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [operators, setOperators] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [userResponse, operatorResponse] = await Promise.all([
        fetchUsers({}),
        fetchOperators(),
      ]);

      if (userResponse.success && operatorResponse.success) {
        console.log("Fetched Operators:", operatorResponse.data);

        // Map operator details by OperatorId
        const operatorMap = operatorResponse.data.reduce((map: { [x: string]: any; }, operator: { OperatorId: string | number; }) => {
          map[operator.OperatorId] = operator; // Map OperatorId to operator object
          return map;
        }, {});

        const filteredUsers = userResponse.data
          .filter((user: { UserTypeId: number }) => user.UserTypeId === roleId)
          .map((user: any) => ({
            userId: user.UserId,
            FirstName: user.FirstName ?? 'N/A',
            LastName: user.LastName ?? 'N/A',
            Suffix: user.Suffix ?? '',
            Email: user.Email ?? 'N/A',
            DateOfRegistration: user.DateOfRegistration ?? 'N/A',
            CreatedBy: user.CreatedBy ?? 'N/A',
            OperatorDetails: operatorMap[user.OperatorId] ?? null, // Assign OperatorDetails based on OperatorId
          }));

        setUsers(filteredUsers);
        setOperators(operatorResponse.data);
      } else {
        console.error('Failed to fetch some data.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [refresh, roleId]);

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
    if (userData) {
      try {
        await fetchUsers({});
        setRefresh(prev => !prev);
      } catch (error) {
        console.error('Error fetching updated users:', error);
      }
    }

    setSelectedUser(null);
    setModalOpen(false);
  };

  const handleSaveUpdatedUser = (updatedUser: User) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.userId === updatedUser.userId ? updatedUser : user
      )
    );
    setSelectedManager(null);
    setUpdateModalOpen(false);
    setRefresh(prev => !prev);
  };

  const handleDeleteManager = (ids: number[]) => {
    const updatedUsers = users.filter(user => !ids.includes(user.userId!));
    setUsers(updatedUsers);
    setRefresh(prev => !prev);
  };

  return (
    <>
      <Box>
        <ManagerTable
          onCreate={handleUserCreate}
          onEdit={handleUserEdit}
          managers={users}
          onDelete={handleDeleteManager}
          onSubmit={handleSubmitUser}
        />
      </Box>
      <CreateManager
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitUser}
        userData={selectedUser}
        managers={users}
        operators={operators}
      />
      {isUpdateModalOpen && (
        <UpdateManager
          open={isUpdateModalOpen}
          onClose={closeUpdateModal}
          onSubmit={handleSaveUpdatedUser}
          manager={selectedManager}
        />
      )}
    </>
  );
};

export default UsersPage;