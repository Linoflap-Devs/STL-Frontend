import React, { useState } from "react";
import { UserSectionData } from "../../data/AdminSectionData";
import { buttonStyles } from "../../styles/theme";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import ConfirmUserActionModalPage from "./ConfirmUserActionModal";
import { User } from "~/pages/Protected/users/[role]";

interface UsersTableProps {
  users: User[];
  onCreate: () => void;
  onEdit: (user: User, action?: "view" | "update") => void;
  onDelete: (ids: number[]) => void;
  onSubmit: (updatedUser: User) => void;
  getUserStatus: (user: User, sevenDaysAgo: dayjs.Dayjs) => string;
  sevenDaysAgo: dayjs.Dayjs;
}

const UsersTablePage: React.FC<UsersTableProps> = ({
  users,
  onCreate,
  onEdit,
  onSubmit,
  getUserStatus,
  sevenDaysAgo,
}) => {
  const pageType = window.location.pathname.includes("manager")
    ? "manager"
    : "executive";
  const [user, setUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    users.map((user) => {
      const status = getUserStatus(user, sevenDaysAgo);

      return {
        ...user,
        fullName:
          `${user.FirstName || ""} ${user.LastName || ""} ${user.Suffix || ""}`
            .trim()
            .toLowerCase(),
        formattedDate: user.DateOfRegistration
          ? dayjs(user.DateOfRegistration).format("YYYY/MM/DD")
          : "Invalid Date",
        Status: status,
      };
    }),
    { ...filters, searchQuery },

    ["fullName", "CreatedBy", "Status", "DateOfRegistration"]
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

  const handleFilterChange =
    (key: string) => (value: string | Dayjs | null) => {
      let filterValue: string;

      if (dayjs.isDayjs(value)) {
        filterValue = value.isValid() ? value.format("YYYY-MM-DD") : "";
      } else {
        filterValue = value || "";
      }

      // Log the nested property for OperatorDetails.OperatorName
      if (key === "OperatorName") {
          filterValue
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

    //setUser(selectedUser);
    setIsVerifyModalOpen(true);
  };

  return (
    <React.Fragment>
      <TableContainer>
        <div>
          <div className="flex justify-between items-center py-3 px-1">
            {/* Search + Filter Section */}
            <div className="flex items-center">
              <div className="relative w-[350px]">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-3 py-[10px] bg-transparent border border-gray-300 rounded-md text-sm focus:outline-none"
                />
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <SearchIcon style={{ fontSize: 20 }} />
                </div>
              </div>
              {isFilterActive ? (
                <FilterListOffIcon
                  onClick={handleFilterToggle}
                  className="ml-2 text-gray-400 cursor-pointer"
                />
              ) : (
                <FilterListIcon
                  onClick={handleFilterToggle}
                  className="ml-2 text-gray-400 cursor-pointer"
                />
              )}
            </div>
            {/* Button Section */}
            <div className="flex items-center">
              <Button variant="contained" onClick={onCreate} sx={buttonStyles}>
                {pageType === "manager" ? "Add Manager" : "Add Executive"}
              </Button>
            </div>
          </div>
        </div>
        <Table size="small">
          <TableHead>
            <TableRow>
              <React.Fragment>
                <SortableTableCell
                  label="Full Name"
                  sortKey="fullName"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  onFilterChange={handleFilterChange("fullName")}
                />
                <SortableTableCell
                  label="Company Name"
                  sortKey="OperatorDetails.OperatorName" // nested from operatordetails
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  onFilterChange={handleFilterChange(
                    "OperatorDetails.OperatorName"
                  )}
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
              </React.Fragment>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedFilteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <div className="flex flex-col items-center py-5">
                    {users.length === 0 ? (
                      <>
                        <PersonOffIcon
                          className="text-gray-500"
                          style={{ fontSize: 50 }}
                        />
                        <h6 className="mt-2 font-medium text-gray-400 text-lg">
                          {pageType === "manager"
                            ? "No managers available"
                            : "No executives available"}
                        </h6>
                        <p className="text-sm text-gray-500">
                          {pageType === "manager"
                            ? "Add a new manager to get started."
                            : "Add a new executive to get started."}
                        </p>
                      </>
                    ) : (
                      <>
                        <SearchOffIcon
                          className="text-gray-500"
                          style={{ fontSize: 50 }}
                        />
                        <h6 className="mt-2 font-medium text-gray-400 text-lg">
                          No results found
                        </h6>
                        <p className="text-sm text-gray-500">
                          Try adjusting your search criteria.
                        </p>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedFilteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>
                      {`${user.FirstName} ${user.LastName} ${user.Suffix}`}
                    </TableCell>
                    <TableCell>{user.OperatorDetails.OperatorName}</TableCell>
                    <TableCell>
                      {dayjs(user.DateOfRegistration).format(
                        "YYYY/MM/DD HH:mm:ss"
                      )}
                    </TableCell>
                    <TableCell>{user?.CreatedBy}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          cursor: "auto",
                          textTransform: "none",
                          borderRadius: "12px",
                          padding: "1px 13px",
                          fontSize: "12px",
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
                      <IconButton
                        onClick={(event) => handleToggleMenu(event, user)}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => {
                          handleToggleMenu();
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            if (selectedUser) {
                              onEdit(selectedUser);
                            }
                          }}
                        >
                          View
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            if (selectedUser) {
                              handleManagerSuspend(selectedUser);
                            }
                          }}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <div className="p-3">
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
        </div>
      </TableContainer>
      <div className="flex justify-end pt-2">
        <Button variant="contained" sx={buttonStyles}>
          {UserSectionData.exportAsCSVButton}
        </Button>
      </div>
      {isVerifyModalOpen && (
        <ConfirmUserActionModalPage
          open={isVerifyModalOpen}
          onClose={() => setIsVerifyModalOpen(false)}
          onVerified={() => setIsVerifyModalOpen(false)}
          onSubmit={onSubmit}
          selectedUser={user}
          setSelectedUser={setSelectedUser}
          actionType="suspend"
          user={user}
          setUser={setUser}
          setErrors={setErrors}
        />
      )}
    </React.Fragment>
  );
};

export default UsersTablePage;
