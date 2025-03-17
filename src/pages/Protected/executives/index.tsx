import React from 'react';
import { Box, Typography } from '@mui/material';
import UsersPage from '../users.tsx';
import UserDashboardPage from '~/components/user/UsersDashboardCards';

const ExecutivePage: React.FC = () => {
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
          Small Town Lottery Executive
        </Typography>
      </Box>
      {/* Dashboard */}
      <Box sx={{ marginBottom: 2 }}>
        <UserDashboardPage roleId={2} />
      </Box>
      {/* Users Page */}
      <UsersPage roleId={2} />
    </Box>
  );
};

export default ExecutivePage;
