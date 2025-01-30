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
import { SortableTableCell, sortData, handleSort, handleChangePage, handleChangeRowsPerPage, filterData } from "../../utils/sortPaginationSearch";

// define user interface
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
  onDelete,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const onSortWrapper = (sortKey: keyof User) => { handleSort(sortKey, sortConfig, setSortConfig); };
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: "asc" | "desc" }>({ key: "id", direction: "asc" });

  // Search filter data
  const sortedUsers = sortData(
    filterData(managers, searchQuery, ['firstname', 'lastname', 'username', 'phonenumber', 'region', 'province']),
    sortConfig
  )

  // search handling
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // for menu
  const handleToggleMenu = (event?: React.MouseEvent<HTMLButtonElement>, user?: User) => {
    setAnchorEl(event?.currentTarget || null);
    setSelectedUser(user || null);
  };

  const handleEditClick = (user: { [key: string]: any }) => {
    const typedUser = user as User;
    onEdit(typedUser);
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

  const buttonStyles = {
    paddingX: 3.9,
    paddingY: 0.9,
    textTransform: "none",
    fontSize: 12,
    borderRadius: "8px",
    backgroundColor: "#2563EB",
    width: "auto",
  };

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 0 }} gutterBottom>
          {UserSectionData.titleManager}
        </Typography>
      </Box>

      <TableContainer>
        <Box sx={{ backgroundColor: "#1F2937" }}>
          <Box sx={{
            paddingTop: 2.5,
            paddingBottom: 2,
            paddingX: 2,
            display: "flex",
            justifyContent: "space-between"
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search"
              value={searchQuery}
              sx={{
                maxWidth: "300px",
                "& .MuiOutlinedInput-root": {
                  padding: "8px 12px",
                },
                "& .MuiOutlinedInput-input": {
                  padding: "0.5px 0",
                },
              }}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: "#9CA3AF" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" onClick={onCreate} sx={buttonStyles}>
              {UserSectionData.addManagerButton}
            </Button>
          </Box>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><Checkbox /></TableCell>
                <SortableTableCell label="First Name" sortKey="firstname" sortConfig={sortConfig} onSort={onSortWrapper} />
                <SortableTableCell label="Last Name" sortKey="lastname" sortConfig={sortConfig} onSort={onSortWrapper} />
                <SortableTableCell label="Username" sortKey="username" sortConfig={sortConfig} onSort={onSortWrapper} />
                <SortableTableCell label="Phone Number" sortKey="phonenumber" sortConfig={sortConfig} onSort={onSortWrapper} />
                <SortableTableCell label="Region" sortKey="region" sortConfig={sortConfig} onSort={onSortWrapper} />
                <SortableTableCell label="Province" sortKey="province" sortConfig={sortConfig} onSort={onSortWrapper} />
                <SortableTableCell label="Registration Date" sortKey="regisdate" sortConfig={sortConfig} onSort={onSortWrapper} />
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell><Checkbox /></TableCell>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.phonenumber}</TableCell>
                    <TableCell>{user.region}</TableCell>
                    <TableCell>{user.province}</TableCell>
                    <TableCell>{user.regisdate}</TableCell>
                    <TableCell>
                      <IconButton onClick={(event) => handleToggleMenu(event, user as User)}>
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
            MenuListProps={{ "aria-labelledby": "basic-button" }}
          >
            <MenuItem onClick={() => handleEditClick(selectedUser!)}>Update</MenuItem>
            <MenuItem onClick={handleDeleteUser}>Delete</MenuItem>
          </Menu>

          <Box sx={{
            padding: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)"
          }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              component="div"
              count={managers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => handleChangePage(event, newPage, setPage)}
              onRowsPerPageChange={(event) => handleChangeRowsPerPage(event, setRowsPerPage)}
            />
          </Box>
        </Box>

        <Box sx={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 2.3
        }}>
          <Button variant="contained" sx={buttonStyles}>{UserSectionData.exportAsCSVButton}</Button>
        </Box>
      </TableContainer>
    </Container>
  );
};

export default ManagerTable;