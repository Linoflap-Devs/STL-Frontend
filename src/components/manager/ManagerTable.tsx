import React, { useState, useEffect } from "react";
import { UserSectionData } from "../../data/AdminSectionData";
import { buttonStyles, deleteStyles } from "../../styles/theme";
import {
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
import {
  SortableTableCell,
  sortData,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  filterData,
} from "../../utils/sortPaginationSearch";
import { managerDeletion } from "../../utils/managerDeletion";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";

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
  [key: string]: any;
}

interface ManagerTableProps {
  managers: User[];
  onCreate: () => void;
  onEdit: (user: User) => void;
  onDelete: (ids: number[]) => void;
}

const ManagerTable: React.FC<ManagerTableProps> = ({
  managers,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(
    new Set()
  );
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const onSortWrapper = (sortKey: keyof User) => {
    handleSort(sortKey, sortConfig, setSortConfig);
  };
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  }>({ key: "id", direction: "asc" });

  const [filters, setFilters] = useState<{ [key: string]: string }>({
    firstname: "",
    lastname: "",
    username: "",
    phonenumber: "",
    region: "",
    province: "",
    regisdate: "",
  });

  // Step 1: Apply filtering to managers data based on searchQuery and filters
  const filteredUsers = filterData(managers, { ...filters, searchQuery }, [
    "firstname",
    "lastname",
    "username",
    "phonenumber",
    "region",
    "province",
  ]);

  // Step 2: Apply sorting on the filtered data
  const sortedFilteredUsers: User[] = sortData(filteredUsers, {
    key: sortConfig.key,
    direction: sortConfig.direction,
  });

  const {
    handleSelectAll,
    isAllSelected,
    handleDeleteSelectedManagers,
    handleSelectManager,
  } = managerDeletion(
    sortedFilteredUsers,
    selectedUserIds,
    setSelectedUserIds,
    setSelectedCount,
    onDelete,
    page,
    rowsPerPage
  );  
  
  // Search handling
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter icon handling
  const handleFilterToggle = () => {
    setIsFilterActive((prevState) => !prevState);
    setIsFilterVisible((prev) => !prev);
  };

  // Filter change handler
  const handleFilterChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFilterValue = e.target.value;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [key]: newFilterValue,
      }));
    };

  // Menu handling
  const handleToggleMenu = (
    event?: React.MouseEvent<HTMLButtonElement>,
    user?: User
  ) => {
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
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          onDelete([selectedUser.id!]);
          Swal.fire({
            title: "Deleted!",
            text: "The manager has been successfully deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      });
    }
  };

  return (
    <div className="mt-4 w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-screen-2xl px-4 sm:px-6 md:px-8 lg:px-12 mx-auto">
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2.5,
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
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
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

              <FilterListIcon
                onClick={handleFilterToggle}
                sx={{ marginLeft: 5, color: "#9CA3AF", cursor: "pointer" }}
                style={{ display: isFilterActive ? "none" : "block" }}
              />

              <FilterListOffIcon
                onClick={handleFilterToggle}
                sx={{ marginLeft: 5, color: "#9CA3AF", cursor: "pointer" }}
                style={{ display: isFilterActive ? "block" : "none" }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {selectedUserIds.size > 0 && (
                  <Button
                    variant="contained"
                    onClick={handleDeleteSelectedManagers}
                    sx={deleteStyles}
                  >
                    Delete {selectedUserIds.size}{" "}
                    {selectedUserIds.size === 1
                      ? "Selected User"
                      : "Selected Users"}
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={onCreate}
                  sx={buttonStyles}
                >
                  {UserSectionData.addManagerButton}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Tooltip title="Select All">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </Tooltip>
              </TableCell>
              <>
                <SortableTableCell
                  label="First Name"
                  sortKey="firstname"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  onFilterToggle={handleFilterToggle}
                  filterValue={filters.firstname}
                  onFilterChange={handleFilterChange("firstname")}
                />

                <SortableTableCell
                  label="Last Name"
                  sortKey="lastname"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  onFilterToggle={handleFilterToggle}
                  filterValue={filters.lastname}
                  onFilterChange={handleFilterChange("lastname")}
                />

                <SortableTableCell
                  label="Username"
                  sortKey="username"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  onFilterToggle={handleFilterToggle}
                  filterValue={filters.username}
                  onFilterChange={handleFilterChange("username")}
                />

                <SortableTableCell
                  label="Phone Number"
                  sortKey="phonenumber"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  onFilterToggle={handleFilterToggle}
                  filterValue={filters.phonenumber}
                  onFilterChange={handleFilterChange("phonenumber")}
                />

                <SortableTableCell
                  label="Region"
                  sortKey="region"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  onFilterToggle={handleFilterToggle}
                  filterValue={filters.region}
                  onFilterChange={handleFilterChange("region")}
                />

                <SortableTableCell
                  label="Province"
                  sortKey="province"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  onFilterToggle={handleFilterToggle}
                  filterValue={filters.province}
                  onFilterChange={handleFilterChange("province")}
                />

                <SortableTableCell
                  label="Registration Date"
                  sortKey="regisdate"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  onFilterToggle={handleFilterToggle}
                  filterValue={filters.regisdate}
                  onFilterChange={handleFilterChange("regisdate")}
                />
              </>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {managers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      py: 5,
                    }}
                  >
                    <PersonOffIcon sx={{ fontSize: 50, color: "gray" }} />
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      sx={{ mt: 2, fontWeight: 500 }}
                    >
                      No managers available
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Add a new manager to get started.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : sortedFilteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      py: 5,
                    }}
                  >
                    <SearchOffIcon sx={{ fontSize: 50, color: "gray" }} />
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      sx={{ mt: 2, fontWeight: 500 }}
                    >
                      No results found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Try adjusting your search criteria.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              sortedFilteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    key={user.id}
                    selected={selectedUserIds.has(user.id!)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedUserIds.has(user.id!)}
                        onChange={(event) =>
                          handleSelectManager(event, user.id!)
                        }
                      />
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
                ))
            )}
          </TableBody>
        </Table>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleToggleMenu()}
          MenuListProps={{ "aria-labelledby": "basic-button" }}
        >
          <MenuItem onClick={() => handleEditClick(selectedUser!)}>
            Update
          </MenuItem>
          <MenuItem onClick={handleDeleteUser}>Delete</MenuItem>
        </Menu>

        <Box
          sx={{
            padding: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
            backgroundColor: "#1F2937",
          }}
        >
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={sortedFilteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) =>
              handleChangePage(event, newPage, setPage)
            }
            onRowsPerPageChange={(event) =>
              handleChangeRowsPerPage(event, setRowsPerPage)
            }
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: 2.3,
          }}
        >
          <Button variant="contained" sx={buttonStyles}>
            {UserSectionData.exportAsCSVButton}
          </Button>
        </Box>
      </TableContainer>
    </div>
  );
};

export default ManagerTable;
