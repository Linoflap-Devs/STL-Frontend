import React from 'react';
import AdminHeader from '../../components/layout/AdminHeader';
import UsersTable from '~/components/UsersTable';

const AdminPage = () => {

  return (
    <>
      <AdminHeader />
      <UsersTable />
    </>
  );
};

export default AdminPage;