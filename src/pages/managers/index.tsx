import React, { useState } from 'react';
import ManagerTable, { User } from '~/components/manager/ManagerTable';
import CreateManager from '~/components/manager/CreateManager';
import UpdateManager from '~/components/manager/UpdateManager';

const UsersPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<User | null>(null); // Track the manager to be updated

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
      console.log('Submitted user data: ', userData);
    } else {
      console.log('No user data submitted');
    }
    setModalOpen(false); // Close create modal
  };

  const handleSaveUpdatedUser = (updatedUser: User) => {
    console.log('Updated user data: ', updatedUser);
    setSelectedManager(null);
    setUpdateModalOpen(false);
  };
  
  return (
    <>
      <ManagerTable onCreate={handleUserCreate} onEdit={handleUserEdit} />
      <CreateManager
        open={isModalOpen}
        onClose={() => setModalOpen(false)} // Close create modal
        onSubmit={handleSubmitUser}
        // userData={selectedUser}
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
