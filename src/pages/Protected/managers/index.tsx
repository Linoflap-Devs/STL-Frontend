import React from 'react';
import { Box, Typography } from '@mui/material';
import UserDashboardPage from '~/components/user/UsersDashboardCards';
import UsersPage from '../users.tsx';

const ManagersPage: React.FC = () => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, }} gutterBottom>
          Small Town Lottery Managers
        </Typography>
      </Box>
      {/* Dashboard */}
      <Box sx={{ marginBottom: 2 }}>
        <UserDashboardPage roleId={3} />
      </Box>
      {/* Users Page */}
      <UsersPage roleId={3} />
    </Box>
  );
};

export default ManagersPage;
