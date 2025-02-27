import React, { useState, useEffect } from "react";
import { UserSectionData } from "../../data/AdminSectionData";
import { buttonStyles, deleteStyles, } from "../../styles/theme";
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
import dayjs, { Dayjs } from "dayjs";

// define user interface
export interface User {
  FirstName: string;
  LastName: string;
  region: string;
  province: string;
  barangay: string;
  city: string;
  streetaddress?: string;
  Email: string;
  password?: string;
  DateOfRegistration?: string;
  [key: string]: any;
}

interface ManagerTableProps {
  managers: User[];
  onCreate: () => void;
  onEdit: (user: User) => void;
  onDelete: (ids: number[]) => void;
}

const ManagerTable: React.FC<ManagerTableProps> = ({ managers, onCreate, onEdit, onDelete, }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
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
    FirstName: "",
    LastName: "",
    Email: "",
    Region: "",
    Province: "",
    CreatedBy: "",
    Status: "",
    DateOfRegistration: "",
  });

  const filteredUsers = filterData(
    managers.map((user) => ({
      ...user,
      fullName: `${user.FirstName} ${user.LastName}`.toLowerCase(),
      formattedDate: user.DateOfRegistration
        ? dayjs(user.DateOfRegistration).format("YYYY-MM-DD")
        : "Invalid Date",
      Status: user.IsDeleted === 0 ? "Active" : "Inactive",
      CreatedBy: `${user.CreatedByFirstName} ${user.CreatedByLastName}`.toLowerCase(),
    })),
    { ...filters, searchQuery },
    ["fullName", "UserName", "Region", "Province", "CreatedBy", "Status", "DateOfRegistration"]
  );

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
  const handleFilterChange = (key: string) => (value: string | Dayjs | null) => {
    let filterValue: string;

    if (dayjs.isDayjs(value)) {
      filterValue = value.isValid() ? value.format("YYYY-MM-DD") : "";
    } else {
      filterValue = value || "";
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: filterValue,
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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 1.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", marginBottom: 0, color: '#E3C9FF', }}
          gutterBottom
        >
          {UserSectionData.titleManager}
        </Typography>
      </Box>

      <TableContainer>
        <Box sx={{ backgroundColor: "#282828", }}>
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
            {/* Left Section: Search and Filter */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                variant="outlined"
                placeholder="Search"
                value={searchQuery}
                sx={{
                  width: "350px",
                  "& .MuiOutlinedInput-root": {
                    padding: "9px 14px",
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
              {/* Filter Icons */}
              {isFilterActive ? (
                <FilterListOffIcon
                  onClick={handleFilterToggle}
                  sx={{ marginLeft: 2, color: "#9CA3AF", cursor: "pointer" }}
                />
              ) : (
                <FilterListIcon
                  onClick={handleFilterToggle}
                  sx={{ marginLeft: 2, color: "#9CA3AF", cursor: "pointer" }}
                />
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              {selectedUserIds.size > 0 && (
                <Button
                  variant="contained"
                  onClick={handleDeleteSelectedManagers}
                  sx={deleteStyles}
                >
                  Delete {selectedUserIds.size}{" "}
                  {selectedUserIds.size === 1 ? "Selected User" : "Selected Users"}
                </Button>
              )}

              <Button variant="contained" onClick={onCreate} sx={buttonStyles}>
                {UserSectionData.addManagerButton}
              </Button>
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
                  label="Full Name"
                  sortKey="fullName"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  onFilterChange={handleFilterChange("fullName")}
                />
                <SortableTableCell
                  label="Email Address"
                  sortKey="Email"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  onFilterChange={handleFilterChange("Email")}
                />
                <SortableTableCell
                  label="Assigned Region"
                  sortKey="Region"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  filterValue={filters.Region}
                  onFilterChange={handleFilterChange("Region")}
                />
                <SortableTableCell
                  label="Creation Date"
                  sortKey="DateOfRegistration"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  filterValue={filters.DateOfRegistration}
                  onFilterChange={handleFilterChange("DateOfRegistration")}
                />
                <SortableTableCell
                  label="Created By"
                  sortKey="CreatedBy"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  filterValue={filters.CreatedBy}
                  onFilterChange={handleFilterChange("CreatedBy")}
                />
                <SortableTableCell
                  label="Status"
                  sortKey="Status"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  filterValue={filters.Status}
                  onFilterChange={handleFilterChange("Status")}
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
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{`${user.FirstName} ${user.LastName}`}</TableCell>
                    <TableCell>{user.Email}</TableCell>
                    <TableCell>{user.Region}</TableCell>
                    <TableCell>{dayjs(user.DateOfRegistration).format("YYYY/MM/DD HH:mm:ss")}</TableCell>
                    <TableCell>{user.CreatedByFirstName} {user.CreatedByLastName}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          cursor: 'auto',
                          textTransform: 'none',
                          borderRadius: '12px',
                          padding: '1.2px 13.5px',
                          fontSize: '14px',
                          backgroundColor: user.IsDeleted === 0 ? "#4CAF50" : "#F05252",
                          color: "white",
                          "&:hover": {
                            backgroundColor: user.IsDeleted === 0 ? "#388E3C" : "#D43F3F",
                          },
                        }}
                      >
                        {user.IsDeleted === 0 ? "Active" : "Inactive"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(event) => handleToggleMenu(event, user)}>
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
          <MenuItem >Delete</MenuItem>
        </Menu>
        <Box
          sx={{
            padding: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
            backgroundColor: "#282828",
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
    </Box>
  );
};

export default ManagerTable;