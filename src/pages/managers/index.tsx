import React, { useState } from 'react';
import ManagerTable, { User } from '~/components/manager/ManagerTable';
import CreateManager from '~/components/manager/CreateManager';
import UpdateManager from '~/components/manager/UpdateManager';

const UsersPage = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<User | null>(null);

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
      //console.log('Submitted user data: ', userData);
      setManagers((prevManagers) => [...prevManagers, userData]);
    } else {
      //console.log('No user data submitted');
      //console.log(managers);
    }
    setModalOpen(false);
  };

  const handleSaveUpdatedUser = (updatedUser: User) => {
    console.log('Updated user data: ', updatedUser);
    setManagers((prevManagers) =>
      prevManagers.map((manager) =>
        manager.id === updatedUser.id ? updatedUser : manager
      )
    );
    setSelectedManager(null);
    setUpdateModalOpen(false);
  };

  const handleDeleteManager = (id: number) => {
    const updatedManagers = managers.filter(manager => manager.id !== id);
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
        managers={managers} // for log checking
      />
      {isUpdateModalOpen && (
        <UpdateManager
          open={isUpdateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          onSubmit={handleSaveUpdatedUser}
          manager={selectedManager}
        />
      )}
    </>
  );
};

export default UsersPage;
