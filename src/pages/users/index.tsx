import React, { useState } from 'react';
import AdminHeader from '../../components/layout/AdminHeader';
import ManagerTable from '~/components/users/ManagerTable';
import CreateManager from '~/components/users/CreateManager';

const UsersPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ name: string; email: string } | null>(null);

  const handleUserCreate = () => {
    setSelectedUser(null); // clear previous user data
    setModalOpen(true);
  };

  const handleUserCloseModal = () => {
    setModalOpen(false); // close modal
  };

  // temporary form submitter
  const handleSubmitUser = (userData: { name: string; email: string } | null) => {
    if (userData) {
      console.log('Submitted user data: ', userData);
    } else {
      console.log('No user data submitted');
    }
    setModalOpen(false); // close modal after submission
  };

  return (
    <>
      <AdminHeader pages={[]} />
      <ManagerTable onCreate={handleUserCreate} />
      <CreateManager
        open={isModalOpen} 
        onClose={handleUserCloseModal} 
        onSubmit={handleSubmitUser} 
        userData={selectedUser}
      />
    </>
  );
};

export default UsersPage;
