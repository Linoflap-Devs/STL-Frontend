import React, { useState } from "react";
import { UserSectionData } from "../../data/AdminSectionData";
import { buttonStyles } from "../../styles/theme";
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
  // sortData,
  // handleSort,
  // handleChangePage,
  // handleChangeRowsPerPage,
  // filterData,
} from "../../utils/sortPaginationSearch";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import dayjs, { Dayjs } from "dayjs";
// import { EditLogFields } from "./EditLogModal";
// import { suspendUser } from "~/utils/api/users";
import Swal from "sweetalert2";

export interface User {
  transactionNumber: string;
  date: string;
  drawTime: string;
  betAmount: number;
  gameType: string;
  betType: string;
  selectedPair: string;
  status: string;
  [key: string]: any;
}

interface BettingSummaryTableProps {
  managers: User[];
  onCreate: () => void;
  onEdit: (user: User, action?: "view" | "update") => void;
  onDelete: (ids: number[]) => void;
}

const TableBettingSummary: React.FC<BettingSummaryTableProps> = ({
  managers,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const onSortWrapper = (sortKey: keyof (User & EditLogFields)) => {
  //   handleSort(sortKey, sortConfig, setSortConfig);
  // };
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  }>({ key: "transactionNumber", direction: "asc" });
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    transactionNumber: "",
    date: "",
    drawTime: "",
    betAmount: "",
    gameType: "",
    betType: "",
    selectedPair: "",
    status: "",
  });

  // const filteredUsers = filterData(
  //   managers.map((user) => ({
  //     ...user,
  //     formattedDate: dayjs(user.date).format("YYYY/MM/DD HH:mm:ss"),
  //     formattedBetAmount: `₱ ${user.betAmount}`,
  //   })),
  //   { ...filters, searchQuery },
  //   [
  //     "transactionNumber",
  //     "formattedDate",
  //     "drawTime",
  //     "formattedBetAmount",
  //     "gameType",
  //     "betType",
  //     "selectedPair",
  //     "status",
  //   ]
  // );

  // const sortedFilteredUsers: User[] = sortData(filteredUsers, {
  //   key: sortConfig.key,
  //   direction: sortConfig.direction,
  // });

  // Search handling
  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchQuery(event.target.value);
  // };

  // // Filter icon handling
  // const handleFilterToggle = () => {
  //   setIsFilterActive((prevState) => !prevState);
  //   setIsFilterVisible((prev) => !prev);
  // };

  // // Filter change handler
  // const handleFilterChange =
  //   (key: string) => (value: string | Dayjs | null) => {
  //     let filterValue: string;

  //     if (dayjs.isDayjs(value)) {
  //       filterValue = value.isValid() ? value.format("YYYY-MM-DD") : "";
  //     } else {
  //       filterValue = value || "";
  //     }

  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       [key]: filterValue,
  //     }));
  //   };

  // // Menu handling
  // const handleToggleMenu = (
  //   event?: React.MouseEvent<HTMLButtonElement>,
  //   user?: User
  // ) => {
  //   console.log("Opening menu for User:", user);
  //   setAnchorEl(event?.currentTarget || null);
  //   setSelectedUser(user || null);
  // };

  // const handleManagerSuspend = async (user: User) => {
  //   if (!user) {
  //     console.error("No selected user or invalid user data.");
  //     return;
  //   }

  //   // Construct the full name safely
  //   const fullName = `${user.FirstName || ""} ${user.LastName || ""}`.trim();
  //   if (!fullName) {
  //     console.error("Invalid user name.");
  //     return;
  //   }

  //   const userId = user.userId ?? user.UserId;
  //   if (typeof userId !== "number" || isNaN(userId)) {
  //     return;
  //   }

  //   try {
  //     const confirmation = await Swal.fire({
  //       title: `Are you sure?`,
  //       text: `Do you want to suspend ${fullName}?`,
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#d33",
  //       cancelButtonColor: "#3085d6",
  //       confirmButtonText: "Yes, suspend it!",
  //       cancelButtonText: "Cancel",
  //     });

  //     if (!confirmation.isConfirmed) {
  //       return;
  //     }

  //     // const result = await suspendUser(userId, { isActive: false });

  //     if (result.success) {
  //       await Swal.fire({
  //         title: "Suspended!",
  //         text: `${fullName} has been suspended.`,
  //         icon: "success",
  //         confirmButtonColor: "#3085d6",
  //       });

  //       handleToggleMenu();
  //     } else {
  //       console.error("Suspension failed:", result.message);
  //       await Swal.fire({
  //         title: "Failed!",
  //         text: `Failed to suspend ${fullName}: ${result.message}`,
  //         icon: "error",
  //         confirmButtonColor: "#3085d6",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error suspending user:", error);

  //     await Swal.fire({
  //       title: "Error!",
  //       text: `An error occurred while suspending ${fullName}.`,
  //       icon: "error",
  //       confirmButtonColor: "#3085d6",
  //     });
  //   }
  // };

  return (
    <TableContainer>
      <Box sx={{ backgroundColor: "#171717" }}>
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
                  backgroundColor: "transparent",
                },
                "& .MuiOutlinedInput-input": {
                  padding: "0.5px 0",
                },
              }}
              // onChange={handleSearchChange}
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
                // onClick={handleFilterToggle}
                sx={{ marginLeft: 2, color: "#9CA3AF", cursor: "pointer" }}
              />
            ) : (
              <FilterListIcon
                // onClick={handleFilterToggle}
                sx={{ marginLeft: 2, color: "#9CA3AF", cursor: "pointer" }}
              />
            )}
          </Box>
          {/* <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button variant="contained" onClick={onCreate} sx={buttonStyles}>
              {UserSectionData.addManagerButton}
            </Button>
          </Box> */}
        </Box>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>TRANSACTION NUMBER</TableCell>
            <TableCell>DATE</TableCell>
            <TableCell>DRAW TIME</TableCell>
            <TableCell>BET AMOUNT</TableCell>
            <TableCell>GAME TYPE</TableCell>
            <TableCell>BET TYPE</TableCell>
            <TableCell>SELECTED PAIR</TableCell>
            <TableCell>STATUS</TableCell>
            {/* <TableCell>Actions</TableCell> */}
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
                    Add.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            // sortedFilteredUsers.length === 0 ? (
            //   <TableRow>
            //     <TableCell colSpan={9} align="center">
            //       <Box
            //         sx={{
            //           display: "flex",
            //           flexDirection: "column",
            //           alignItems: "center",
            //           py: 5,
            //         }}
            //       >
            //         <SearchOffIcon sx={{ fontSize: 50, color: "gray" }} />
            //         <Typography
            //           variant="h6"
            //           color="textSecondary"
            //           sx={{ mt: 2, fontWeight: 500 }}
            //         >
            //           No results found
            //         </Typography>
            //         <Typography variant="body2" color="textSecondary">
            //           Try adjusting your search criteria.
            //         </Typography>
            //       </Box>
            //     </TableCell>
            //   </TableRow>
            // ) : (
            managers
              // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.transactionNumber}>
                  <TableCell>{user.transactionNumber}</TableCell>
                  <TableCell>{user.date}</TableCell>
                  <TableCell>{user.drawTime}</TableCell>
                  <TableCell>{user.betAmount}</TableCell>
                  <TableCell>{user.gameType}</TableCell>
                  <TableCell>{user.betType}</TableCell>
                  <TableCell>{user.selectedPair}</TableCell>
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
                          user.status === "Void" ? "#FF7A7A" : "#4CAF50",
                        color: "#171717",
                        "&:hover": {
                          backgroundColor:
                            user.status === "Void" ? "#F05252" : "#4CAF50",
                        },
                      }}
                    >
                      {user.status}
                    </Button>
                  </TableCell>
                  {/* <TableCell>
                    <IconButton
                      // onClick={(event) => handleToggleMenu(event, user)}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        // onClose={() => handleToggleMenu()}
        MenuListProps={{ "aria-labelledby": "basic-button" }}
      >
        <MenuItem
          // onClick={() => (selectedUser ? onEdit(selectedUser, "view") : null)}
        >
          View
        </MenuItem>
        <MenuItem
          // onClick={() => (selectedUser ? onEdit(selectedUser, "update") : null)}
        >
          Update
        </MenuItem>
        <MenuItem
          // onClick={() =>
          //   selectedUser ? handleManagerSuspend(selectedUser) : null
          // }
        >
          Suspend
        </MenuItem>
      </Menu>
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
          count={managers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
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

export default TableBettingSummary;