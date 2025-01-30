import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
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
  IconButton,
  TablePagination,
  Menu,
  MenuItem,
  Checkbox,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { UserSectionData } from "../../data/AdminSectionData";
import { SortableTableCell } from "../../utils/SortableTableCell";

// define user
export interface User {
  id?: number;
  firstname: string;
  lastname: string;
  region: string;
  province: string;
  city?: string;
  barangay?: string;
  streetaddress: string;
  phonenumber: string;
  username: string;
  password?: string;
  regisdate?: string;
}

interface ManagerTableProps {
  managers: User[];
  onCreate: () => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const ManagerTable: React.FC<ManagerTableProps> = ({
  managers,
  onCreate,
  onEdit,
  onDelete
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  }>({ key: "id", direction: "asc" });

  // sorting logic
  const sortedUsers = [...managers].sort((a, b) => {
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      const dateA = new Date(valueA);
      const dateB = new Date(valueB);

      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return sortConfig.direction === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
    }

    return 0;
  });

  const handleSort = (column: keyof User) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column, direction });
  };

  // pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // rows per page
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = parseInt(event.target.value, 10);
    setRowsPerPage(newValue);
    setPage(0); // Reset to first page when changing rows per page
  };

  // for menu open and close
  const handleToggleMenu = (
    event?: React.MouseEvent<HTMLButtonElement>,
    user?: User
  ) => {
    setAnchorEl(event?.currentTarget || null);
    setSelectedUser(user || null);
  };

  const handleEditClick = (user: User) => {
    onEdit(user);
    handleToggleMenu();
  };

  const handleDeleteUser = () => {
    if (selectedUser) {

      Swal.fire({
        title: "Are you sure?",
        text: "You won’t be able to revert this",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          onDelete(selectedUser.id!);

          Swal.fire({
            title: "Deleted!",
            text: "The manager has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      });
    }
    handleToggleMenu();
  };

  return (
    <Container>
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
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search"
                sx={{
                  maxWidth: "350px",
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers
                .slice(
                  page * rowsPerPage,
                  rowsPerPage > 0 ? page * rowsPerPage + rowsPerPage : sortedUsers.length
                )
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.phonenumber}</TableCell>
                    <TableCell>{user.region}</TableCell>
                    <TableCell>{user.province}</TableCell>
                    <TableCell>{user.regisdate}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleToggleMenu(event, user)}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleToggleMenu()}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => handleEditClick(selectedUser!)}>
              Update
            </MenuItem>
            <MenuItem onClick={handleDeleteUser}>Delete</MenuItem>
          </Menu>

          <Box
            sx={{
              padding: "12px",
            }}
          >
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              component="div"
              count={managers.length}
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

export default ManagerTable;
