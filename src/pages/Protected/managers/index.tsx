import React, { useState, useEffect } from 'react';
import ManagerTable, { User } from '~/components/manager/ManagerTable';
import CreateManager from '~/components/manager/CreateManager';
import UpdateManager from '~/components/manager/UpdateManager';
import fetchUsers from '~/utils/api/users'; // Import fetchUsers function

const UsersPage = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<User | null>(null);

  // Fetch users when the component mounts
  useEffect(() => {
    const loadUsers = async () => {
      const response = await fetchUsers({});
      if (response.success) {
        // Filter users with UserTypeId === 2 before setting state. 2 muna but manager is 3.
        const filteredUsers = response.data.filter((user: { UserTypeId: number; }) => user.UserTypeId === 2);
        setManagers(filteredUsers);
      } else {
        console.error("Failed to fetch users:", response.message);
      }
    };
  
    loadUsers();
  }, []);
  
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

  const handleSubmitUser = (userData: User | null) => {
    if (userData) {
      setManagers((prevManagers) => [...prevManagers, userData]);
    }
    setModalOpen(false);
  };

  const handleSaveUpdatedUser = (updatedUser: User) => {
    setManagers((prevManagers) =>
      prevManagers.map((manager) =>
        manager.id === updatedUser.id ? updatedUser : manager
      )
    );
    setSelectedManager(null);
    setUpdateModalOpen(false);
  };

  const handleDeleteManager = (ids: number[]) => {
    const updatedManagers = managers.filter(manager => !ids.includes(manager.id!));
    setManagers(updatedManagers);
  };

  return (
    <>
      <ManagerTable
        onCreate={handleUserCreate}
        onEdit={handleUserEdit}
        managers={managers}
        onDelete={handleDeleteManager}
      />
      <CreateManager
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitUser}
        userData={selectedUser}
        managers={managers} // for log checking only
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
