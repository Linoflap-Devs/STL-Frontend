import React, { useState } from "react";
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
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  IconButton,
  TablePagination,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import Checkbox from "@mui/material/Checkbox";
import { UserSectionData } from "../../data/AdminSectionData";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  phonenumber: string;
  region: string;
  province: string;
  regisdate: string;
}

const UsersTable: React.FC<{ onCreate: () => void }> = ({ onCreate }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  }>({
    key: "id",
    direction: "asc",
  });

  interface SortConfig {
    key: string;
    direction: "asc" | "desc";
  }

  interface SortableTableCellProps {
    label: string;
    sortKey: keyof User;
    sortConfig: SortConfig;
    onSort: (sortKey: keyof User) => void;
  }

  const users: User[] = [
    { id: 1, firstname: "Angelo", lastname: "Doe", username: "angelodoe", phonenumber: "0943 321 5342", region: "CALABARZON", province: "Metro Manila", regisdate: "2025/01/22 13:05:32", },
    { id: 2, firstname: "Jimas", lastname: "Doe", username: "jimasdoe", phonenumber: "0943 321 5342", region: "National Capital Region", province: "Metro Manila", regisdate: "2025/01/22 13:05:32", },
    { id: 3, firstname: "Jhustie", lastname: "Cruz", username: "jhustiedoe", phonenumber: "0943 321 5342", region: "National Capital Region", province: "Metro Manila", regisdate: "2025/01/22 13:05:32", },
    { id: 4, firstname: "Thea", lastname: "Doe", username: "theadoe", phonenumber: "0943 321 5342", region: "National Capital Region", province: "Metro Manila", regisdate: "2025/01/22 13:05:32", },
    { id: 5, firstname: "Jacob", lastname: "Doe", username: "jacobdoe", phonenumber: "0943 321 5342", region: "National Capital Region", province: "Metro Manila", regisdate: "2025/01/22 13:05:32", },
    { id: 6, firstname: "Wendell", lastname: "Ravago", username: "wendelldoe", phonenumber: "0943 321 5342", region: "National Capital Region", province: "Metro Manila", regisdate: "2025/01/22 13:05:32", },
    { id: 7, firstname: "Rissa", lastname: "Doe", username: "rissadoe", phonenumber: "0943 321 5342", region: "National Capital Region", province: "Metro Manila", regisdate: "2025/01/22 13:05:32", },
  ];

  // sorting
  const sortedUsers = [...users].sort((a, b) => {
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    // Sort strings alphabetically
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Sort numbers
    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    // Sort date strings
    if (typeof valueA === "string" && !isNaN(Date.parse(valueA))) {
      const dateA = new Date(valueA);
      const dateB = new Date(valueB);
      return sortConfig.direction === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }
    return 0;
  });

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    console.log("Update clicked");
    handleCloseMenu();
  };

  const handleDelete = () => {
    console.log("Delete clicked");
    handleCloseMenu();
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column: keyof User) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column, direction });
  };

  // reusable sorting code
  const SortableTableCell: React.FC<SortableTableCellProps> = ({
    label,
    sortKey,
    sortConfig,
    onSort,
  }) => {
    return (
      <TableCell
        sx={{ cursor: "pointer" }}
        onClick={() => onSort(sortKey)}
      >
        {label}
        {sortConfig.key === sortKey && (
          sortConfig.direction === "asc" ? (
            <KeyboardArrowUpIcon sx={{ fontSize: 16, marginLeft: 1 }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: 16, marginLeft: 1 }} />
          )
        )}
      </TableCell>
    );
  };

  // for checkbox
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return (
    <Container
      sx={{
        marginTop: 4,
        padding: 0,
        maxWidth: {
          xs: 300,
          sm: 700,
          md: 900,
          lg: 1200,
          xl: 1200,
          //xl: 1536,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", marginBottom: 0 }}
          gutterBottom
        >
          {UserSectionData.titleManager}
        </Typography>
      </Box>

      {/* Table Section */}
      <TableContainer>
        <Box sx={{ backgroundColor: "#1F2937" }}>
          <Box
            sx={{
              paddingTop: 2.5,
              paddingBottom: 2,
              paddingX: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                maxWidth: 500,
                padding: 0,
                width: {
                  xs: "100%",
                  sm: "300px",
                  md: "320px",
                  lg: "1200px",
                },
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    padding: "8px 12px",
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "0.5px 0",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 20, color: "#9CA3AF" }} />
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
                textTransform: "none",
                fontSize: 12,
                borderRadius: "8px",
                backgroundColor: "#2563EB",
                width: "auto",
              }}
            >
              {UserSectionData.addManagerButton}
            </Button>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <SortableTableCell
                  label="First Name"
                  sortKey="firstname"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableCell
                  label="Last Name"
                  sortKey="lastname"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableCell
                  label="Username"
                  sortKey="username"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableCell
                  label="Phone Number"
                  sortKey="phonenumber"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableCell
                  label="Region"
                  sortKey="region"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableCell
                  label="Province"
                  sortKey="province"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <SortableTableCell
                  label="Registration Date"
                  sortKey="regisdate"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
                <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox {...label} />
                    </TableCell>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.phonenumber}</TableCell>
                    <TableCell>{user.region}</TableCell>
                    <TableCell>{user.province}</TableCell>
                    <TableCell>{user.regisdate}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <IconButton onClick={handleOpenMenu}>
                          <MoreHorizIcon
                            sx={{ fontSize: 20, color: "#9CA3AF" }}
                          />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem onClick={handleUpdate}>Update</MenuItem>
                          <MenuItem onClick={handleDelete}>Delete</MenuItem>
                        </Menu>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Box
            sx={{
              padding: "12px",
            }}
          >
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", paddingTop: 2.3 }}
        >
          <Button
            variant="contained"
            onClick={onCreate}
            sx={{
              paddingX: 3.9,
              paddingY: 0.9,
              textTransform: "none",
              fontSize: 12,
              borderRadius: "8px",
              backgroundColor: "#2563EB",
              width: "auto",
            }}
          >
            {UserSectionData.exportAsCSVButton}
          </Button>
        </Box>
      </TableContainer>
    </Container>
  );
};

export default UsersTable;
