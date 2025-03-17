import React, { useState, useEffect } from "react";
import { UserSectionData } from "../../data/AdminSectionData";
import { buttonStyles, } from "../../styles/theme";
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
} from "@mui/material";
import {
  SortableTableCell,
  sortData,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  filterData,
} from "../../utils/sortPaginationSearch";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import dayjs, { Dayjs } from "dayjs";
import { EditLogFields } from "./EditLogModal";
import Swal from "sweetalert2";
import ConfirmSuspendManagerPage from "./ConfirmSuspendUser";

export interface User {
  firstName: string;
  lastName: string;
  suffix?: string;
  phoneNumber: string;
  email: string;
  password: string;
  street: string;
  region?: string;
  province?: string;
  barangay?: string;
  city?: string;
  [key: string]: any;
}

interface ManagerTableProps {
  managers: User[];
  onCreate: () => void;
  onEdit: (user: User, action?: "view" | "update") => void;
  onDelete: (ids: number[]) => void;
  onSubmit: (updatedUser: User) => void;
}

const ManagerTable: React.FC<ManagerTableProps> = ({ managers, onCreate, onEdit, onSubmit }) => {
  const pageType = window.location.pathname.includes('manager') ? 'manager' : 'executive';
  const [user, setUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const onSortWrapper = (sortKey: keyof (User & EditLogFields)) => {
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
    managers.map((user) => {
      const lastLogin = user.LastLogin ? dayjs(user.LastLogin) : null;
      const lastTokenRefresh = user.LastTokenRefresh ? dayjs(user.LastTokenRefresh) : null;
      const sevenDaysAgo = dayjs().subtract(7, "days");

      let status = "Active"; // Default status

      if (user.IsActive === 0) {
        status = "Suspended"; // Prioritize Suspended and stop further checks
      } else if (
        (!lastLogin || lastLogin.isBefore(sevenDaysAgo)) &&
        (!lastTokenRefresh || lastTokenRefresh.isBefore(sevenDaysAgo))
      ) {
        status = "Inactive"; // Only mark inactive if NOT suspended
      }

      return {
        ...user,
        fullName: `${user.FirstName || ""} ${user.LastName || ""}`.trim().toLowerCase(),
        formattedDate: user.DateOfRegistration
          ? dayjs(user.DateOfRegistration).format("YYYY/MM/DD")
          : "Invalid Date",
        Status: status, // Now properly handling Suspended/Inactives
      };
    }),
    { ...filters, searchQuery },
    ["fullName", "UserName", "Region", "Province", "CreatedBy", "Status", "DateOfRegistration"]
  );

  const sortedFilteredUsers: User[] = sortData(filteredUsers, {
    key: sortConfig.key,
    direction: sortConfig.direction,
  });

  // Search handling
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter icon handling
  const handleFilterToggle = () => {
    setIsFilterActive((prevState) => !prevState);
    setIsFilterVisible((prev) => !prev);
  };

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

  const handleManagerSuspend = async (selectedUser: User) => {
    if (!selectedUser || !selectedUser.userId) {
      console.error("Invalid user:", selectedUser);
      return;
    }

    // Check if the user is already suspended
    if (selectedUser.isActive === 0) {
      await Swal.fire({
        title: "Already Suspended",
        text: `${selectedUser.FirstName} ${selectedUser.LastName} is already suspended.`,
        icon: "info",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const confirmation = await Swal.fire({
      title: "Suspend Confirmation",
      html: `This action will suspend <span style="font-weight: bold;">${selectedUser.FirstName} ${selectedUser.LastName}</span>'s account.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: '<span style="color: #ffffff;">Suspend</span>',
      cancelButtonText: '<span style="color: #212121;">Cancel</span>',
      confirmButtonColor: "#F05252",
      cancelButtonColor: "#f0f0f0",
      customClass: {
        cancelButton: "no-hover",
      },
    });

    if (!confirmation.isConfirmed) return;

    setUser(selectedUser);
    setIsVerifyModalOpen(true);
  };

  return (
    <TableContainer>
      <Box sx={{ backgroundColor: "#171717", }}>
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              variant="outlined"
              placeholder="Search"
              value={searchQuery}
              sx={{
                width: "350px",
                "& .MuiOutlinedInput-root": {
                  padding: "9px 14px",
                  backgroundColor: 'transparent',
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
          {pageType === "manager" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button variant="contained" onClick={onCreate} sx={buttonStyles}>
                {pageType === 'manager' ? 'Add Manager' : 'Add Executive'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
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
                    {pageType === 'manager' ? 'No managers available' : 'No executives available'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {pageType === 'manager' ? 'Add a new manager to get started.' : 'Add a new executive to get started.'}
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
                <TableRow key={user.userId}>
                  <TableCell>
                    {user.userId} {`${user.FirstName} ${user.LastName}`}
                  </TableCell>
                  <TableCell>{user.Email}</TableCell>
                  <TableCell>{user.Region}</TableCell>
                  <TableCell>
                    {dayjs(user.DateOfRegistration).format("YYYY/MM/DD HH:mm:ss")}
                  </TableCell>
                  <TableCell>{user?.CreatedBy}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{
                        cursor: "auto",
                        textTransform: "none",
                        borderRadius: "12px",
                        padding: "1.2px 13.5px",
                        fontSize: "14px",
                        backgroundColor:
                          user.Status === "Suspended"
                            ? "#FF7A7A"
                            : user.Status === "Inactive"
                              ? "#FFA726"
                              : "#4CAF50",
                        color: "#171717",
                        "&:hover": {
                          backgroundColor:
                            user.Status === "Suspended"
                              ? "#F05252"
                              : user.Status === "Inactive"
                                ? "#FFA726"
                                : "#4CAF50",
                        },
                      }}
                    >
                      {user.Status}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {pageType === "manager" ? (
                      <IconButton onClick={(event) => handleToggleMenu(event, user)}>
                        <MoreHorizIcon />
                      </IconButton>
                    ) : (
                      <Button
                        onClick={() => selectedUser ? onEdit(selectedUser, "view") : null}
                        sx={{
                          color: '#67ABEB',
                          textTransform: "none",
                          fontSize: "14px",
                          padding: "2px 10px",
                          "&:hover": {
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
      {pageType === "manager" && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleToggleMenu()}
          MenuListProps={{ "aria-labelledby": "basic-button" }}
        >
          <MenuItem
            onClick={() =>
              selectedUser ? onEdit(selectedUser, "view") : null
            }
          >
            View
          </MenuItem>
          <MenuItem
            onClick={() =>
              selectedUser ? onEdit(selectedUser, "update") : null
            }
          >
            Update
          </MenuItem>
          <MenuItem
            onClick={() =>
              selectedUser ? handleManagerSuspend(selectedUser) : null
            }
          >
            Suspend
          </MenuItem>
        </Menu>
      )}
      <Box
        sx={{
          padding: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
          backgroundColor: "#171717",
        }}
      >
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
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
  );
};

export default ManagerTable;