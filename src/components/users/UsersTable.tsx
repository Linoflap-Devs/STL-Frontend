import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { UserSectionData } from '../../data/UserSectionData';

interface UsersTableProps {
  onCreate: () => void;
}

// sample data
const UsersTable: React.FC<UsersTableProps> = ({ onCreate }) => {
  const users = [
    {
      firstname: "John", lastname: "Doe", username: "john@example.com", phonenumber: "0943 321 5342",
      region: "National Capital Region", province: "Metro Manila", regisdate: "2025/01/22 13:05:32"
    },
    {
      firstname: "John", lastname: "Smith", username: "jane@example.com", phonenumber: "0943 321 5343",
      region: "Central Luzon", province: "Pampanga", regisdate: "2025/01/20 10:15:22"
    },
    {
      firstname: "John", lastname: "Johnson", username: "alex@example.com", phonenumber: "0943 321 5344",
      region: "Southern Luzon", province: "Laguna", regisdate: "2025/01/18 08:25:12"
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4, padding: 0, }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: 0 }}
            gutterBottom
          >
            {UserSectionData.titleManager}
          </Typography>
        </Box>
      </Box>

      {/* Table Section */}
      <TableContainer>
        <Box sx={{ backgroundColor: '#1F2937' }}>
          <Box sx={{ paddingTop: 2.5, paddingBottom: 2, paddingX: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ maxWidth: 500, padding: 0, width: { xs: '100%', sm: '300px', md: '320px' } }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              variant="contained"
              onClick={onCreate}
              sx={{
                paddingX: 3.9,
                paddingY: 0.9,
                textTransform: 'none',
                fontSize: 12,
                borderRadius: 2,
                backgroundColor: '#2563EB',
                width: 'auto',
              }}
            >
              {UserSectionData.addManagerButton}
            </Button>
          </Box>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Province</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.firstname}>
                  <TableCell>{user.firstname}</TableCell>
                  <TableCell>{user.lastname}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.phonenumber}</TableCell>
                  <TableCell>{user.region}</TableCell>
                  <TableCell>{user.province}</TableCell>
                  <TableCell>{user.regisdate}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <MoreHorizIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 2.5 }}>
        <Button
          variant="contained"
          onClick={onCreate}
          sx={{
            paddingX: 3.9,
            paddingY: 0.9,
            textTransform: 'none',
            fontSize: 12,
            borderRadius: 2,
            backgroundColor: '#2563EB',
            width: 'auto',
          }}
        >
          {UserSectionData.exportAsCSVButton}
        </Button>
      </Box>
    </Container>
  );
};

export default UsersTable;