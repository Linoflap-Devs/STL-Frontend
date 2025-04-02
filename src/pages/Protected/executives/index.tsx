import React, { Suspense } from 'react';
import { Box, Typography } from '@mui/material';

const UsersPage = React.lazy(() => import("../users.tsx"));
const UsersSkeletonPage = React.lazy(() => import("~/components/user/UsersSkeleton"));
const UserDashboardPage = React.lazy(() => import("~/components/user/UsersDashboard"));

const ExecutivePage: React.FC = () => {

  return (
    <>
      <Suspense fallback={<UsersSkeletonPage />}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }} gutterBottom>
              Small Town Lottery Executive
            </Typography>
          </Box>
          <Box>
            <UserDashboardPage roleId={1} />
          </Box>
          <UsersPage roleId={1} />
        </Box>
      </Suspense>
    </>
  );
};

export default ExecutivePage;