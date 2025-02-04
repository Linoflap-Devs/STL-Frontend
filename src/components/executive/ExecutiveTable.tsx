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
  Tooltip,
} from "@mui/material";
import {
  SortableTableCell,
  sortData,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  filterData,
} from "../../utils/sortPaginationSearch";
import { executiveDeletion } from "../../utils/executiveDeletion";
import SearchIcon from "@mui/icons-material/Search";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Swal from "sweetalert2";

// define executives interface
export interface User {
  id?: number;
  firstname: string;
  lastname: string;
  phonenumber: string;
  username: string;
  password?: string;

  // Home Address
  region: string; // Select
  province: string; // Select
  city?: string; // Select
  barangay?: string; // Select
  streetaddress: string;

  // Assigned Location
  assignedRegion: string;
  assignedProvince: string;
  assignedCity?: string;
  assignedBarangay?: string;
  assignedAddress: string;

  regisdate?: string;
  [key: string]: any;
}

interface ExecutiveTableProps {
  executives: User[];
  onCreate: () => void;
  onClose: () => void;
  onDelete: (ids: number[]) => void;
}

const ExecutiveTable: React.FC<ExecutiveTableProps> = ({ executives, onCreate, onClose, onDelete }) => {
  const [selectedExecutive, setselectedExecutive] = useState<User | null>(null);
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
    firstname: "",
    lastname: "",
    username: "",
    phonenumber: "",
    region: "",
    province: "",
    regisdate: "",
  });

  const filteredExecutives = filterData(executives, { ...filters, searchQuery }, [
    "firstname",
    "lastname",
    "username",
    "phonenumber",
    "region",
    "province",
  ]);

  const sortedFilteredExecutive = sortData(filteredExecutives, {
    key: sortConfig.key,
    direction: sortConfig.direction,
  }) as User[];

  const {
    handleSelectAll,
    isAllSelected,
    handleDeleteSelectedExecutives,
    handleSelectExecutive,
  } = executiveDeletion(
    sortedFilteredExecutive,
    selectedUserIds,
    setSelectedUserIds,
    setSelectedCount,
    onDelete,
    page,
    rowsPerPage
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterToggle = () => {
    setIsFilterActive((prevState) => !prevState);
    setIsFilterVisible((prev) => !prev);
  };

  const handleFilterChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFilterValue = e.target.value;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [key]: newFilterValue,
      }));
    };

  // menu handling
  const handleToggleMenu = (event?: React.MouseEvent<HTMLButtonElement>, executive?: User) => {
    setAnchorEl(event?.currentTarget || null);
    setselectedExecutive(executive || null);
  };

  const handleDeleteExecutive = () => {
    if (selectedExecutive) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          onDelete([selectedExecutive.id!]);
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
    <div className="mt-4 w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-screen-xl px-4 sm:px-6 md:px-8 lg:px-12 mx-auto">
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2.5 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 0 }} gutterBottom>
          {UserSectionData.titleExecutive}
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
                    onClick={handleDeleteSelectedExecutives}
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
                  {UserSectionData.addExecutiveButton}
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
                  filterValue={filters.firstname}
                  onFilterChange={handleFilterChange("firstname")}
                />
                <SortableTableCell
                  label="Last Name"
                  sortKey="lastname"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  filterValue={filters.lastname}
                  onFilterChange={handleFilterChange("lastname")}
                />
                <SortableTableCell
                  label="Username"
                  sortKey="username"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  filterValue={filters.username}
                  onFilterChange={handleFilterChange("username")}
                />
                <SortableTableCell
                  label="Phone Number"
                  sortKey="phonenumber"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  filterValue={filters.phonenumber}
                  onFilterChange={handleFilterChange("phonenumber")}
                />
                <SortableTableCell
                  label="Region"
                  sortKey="region"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  filterValue={filters.region}
                  onFilterChange={handleFilterChange("region")}
                />
                <SortableTableCell
                  label="Province"
                  sortKey="province"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  filterValue={filters.province}
                  onFilterChange={handleFilterChange("province")}
                />
                <SortableTableCell
                  label="Registration Date"
                  sortKey="regisdate"
                  sortConfig={sortConfig}
                  onSort={onSortWrapper}
                  isFilterVisible={isFilterVisible}
                  filterValue={filters.regisdate}
                  onFilterChange={handleFilterChange("regisdate")}
                />
              </>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedFilteredExecutive.length === 0 ? (
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
                      No executives available
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Add a new executive to get started.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : executives.length === 0 ? (
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
              sortedFilteredExecutive
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((executive) => (
                  <TableRow
                    key={executive.id}
                    selected={selectedUserIds.has(executive.id!)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedUserIds.has(executive.id!)}
                        onChange={(event) =>
                          handleSelectExecutive(event, executive.id!)
                        }
                      />
                    </TableCell>
                    <TableCell>{executive.firstname}</TableCell>
                    <TableCell>{executive.lastname}</TableCell>
                    <TableCell>{executive.username}</TableCell>
                    <TableCell>{executive.phonenumber}</TableCell>
                    <TableCell>{executive.region}</TableCell>
                    <TableCell>{executive.province}</TableCell>
                    <TableCell>{executive.regisdate}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleToggleMenu(event, executive)}
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
          <MenuItem>
            Update
          </MenuItem>
          <MenuItem onClick={handleDeleteExecutive}>Delete</MenuItem>
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
            count={sortedFilteredExecutive.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => handleChangePage(event, newPage, setPage)}
            onRowsPerPageChange={(event) => handleChangeRowsPerPage(event, setRowsPerPage)}
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

export default ExecutiveTable;

