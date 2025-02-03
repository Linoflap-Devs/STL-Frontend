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
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Swal from "sweetalert2";

// define executives interface
export interface Executive {
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
  executives: Executive[];
  onCreate: () => void;
  onClose: () => void;
}

const ExecutiveTable: React.FC<ExecutiveTableProps> = ({ executives, onCreate, onClose, }) => {
  const [selectedUser, setSelectedUser] = useState<Executive | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Executive;
    direction: "asc" | "desc";
  }>({ key: "id", direction: "asc" });

  const handleSortWrapper = (sortKey: keyof Executive) => {
    handleSort(sortKey, sortConfig, setSortConfig);
  };

  // menu handling
  const handleToggleMenu = (event?: React.MouseEvent<HTMLButtonElement>, executive?: Executive) => {
    setAnchorEl(event?.currentTarget || null);
    setSelectedUser(executive || null);
  };

  const handleSelectManager = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const newSelectedUserIds = new Set(selectedUserIds);
    if (event.target.checked) {
      newSelectedUserIds.add(id);
    } else {
      newSelectedUserIds.delete(id);
    }
    setSelectedUserIds(newSelectedUserIds);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
          <Box sx={{ paddingTop: 2.5, paddingBottom: 2, paddingX: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  maxWidth: "300px",
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
              <FilterListIcon
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                sx={{ marginLeft: 5, color: "#9CA3AF", cursor: "pointer" }}
                style={{ display: isFilterActive ? "none" : "block" }}
              />
              <FilterListOffIcon
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                sx={{ marginLeft: 5, color: "#9CA3AF", cursor: "pointer" }}
                style={{ display: isFilterActive ? "block" : "none" }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>

                <Button variant="contained" onClick={onCreate} sx={buttonStyles}>
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


              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {executives
              .filter(executive => executive.firstname.toLowerCase().includes(searchQuery.toLowerCase()) || executive.lastname.toLowerCase().includes(searchQuery.toLowerCase())) // Basic search filter
              .map((executive) => (
                <TableRow key={executive.id} selected={selectedUserIds.has(executive.id!)}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUserIds.has(executive.id!)}
                      onChange={(event) => handleSelectManager(event, executive.id!)}
                    />
                  </TableCell>
                  <TableCell>{executive.firstname}</TableCell>
                  <TableCell>{executive.lastname}</TableCell>
                  <TableCell>{executive.username}</TableCell>
                  <TableCell>{executive.region}</TableCell>
                  <TableCell>{executive.province}</TableCell>
                  <TableCell>{executive.city}</TableCell>
                  <TableCell>{executive.barangay}</TableCell>
                  <TableCell>
                    <IconButton onClick={(event) => handleToggleMenu(event, executive)}>
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
          <MenuItem>Update</MenuItem>
          <MenuItem>Delete</MenuItem>
        </Menu>

        <Box sx={{ padding: "12px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)", backgroundColor: "#1F2937" }}></Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", paddingTop: 2.3 }}>
          <Button variant="contained" sx={buttonStyles}>
            {UserSectionData.exportAsCSVButton}
          </Button>
        </Box>
      </TableContainer>
    </div>
  );
};

export default ExecutiveTable;
