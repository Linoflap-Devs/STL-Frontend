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
  //const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  }>({
    key: "id",
    direction: "asc",
  });

  const users: User[] = [
    {
      id: 1,
      firstname: "Anne",
      lastname: "Doe",
      username: "john@example.com",
      phonenumber: "0943 321 5342",
      region: "National Capital Region",
      province: "Metro Manila",
      regisdate: "2025/01/22 13:05:32",
    },
    {
      id: 2,
      firstname: "Shay",
      lastname: "Marasigan",
      username: "jane@example.com",
      phonenumber: "0943 321 5343",
      region: "Central Luzon",
      province: "Pampanga",
      regisdate: "2025/01/20 10:15:22",
    },
    {
      id: 3,
      firstname: "Zac",
      lastname: "Johnson",
      username: "alex@example.com",
      phonenumber: "0943 321 5344",
      region: "Southern Luzon",
      province: "Laguna",
      regisdate: "2025/01/18 08:25:12",
    },
    {
      id: 4,
      firstname: "Sample",
      lastname: "Johnson",
      username: "alex@example.com",
      phonenumber: "0943 321 5344",
      region: "Southern Luzon",
      province: "Laguna",
      regisdate: "2025/01/18 08:25:12",
    },
    {
      id: 5,
      firstname: "John",
      lastname: "Johnson",
      username: "alex@example.com",
      phonenumber: "0943 321 5344",
      region: "Southern Luzon",
      province: "Laguna",
      regisdate: "2025/01/18 08:25:12",
    },
    {
      id: 6,
      firstname: "John",
      lastname: "Johnson",
      username: "alex@example.com",
      phonenumber: "0943 321 5344",
      region: "Southern Luzon",
      province: "Laguna",
      regisdate: "2025/01/18 08:25:12",
    },
    {
      id: 7,
      firstname: "John",
      lastname: "Johnson",
      username: "alex@example.com",
      phonenumber: "0943 321 5344",
      region: "Southern Luzon",
      province: "Laguna",
      regisdate: "2025/01/18 08:25:12",
    },
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
          xl: 1536,
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
                width: { xs: "100%", sm: "300px", md: "320px" },
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
                  <Checkbox {...label} />
                </TableCell>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleSort("firstname")}
                >
                  First Name
                  {sortConfig.key === "firstname" &&
                    (sortConfig.direction === "asc" ? (
                      <KeyboardArrowUpIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ))}
                </TableCell>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleSort("lastname")}
                >
                  Last Name
                  {sortConfig.key === "lastname" &&
                    (sortConfig.direction === "asc" ? (
                      <KeyboardArrowUpIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ))}
                </TableCell>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleSort("username")}
                >
                  Username
                  {sortConfig.key === "username" &&
                    (sortConfig.direction === "asc" ? (
                      <KeyboardArrowUpIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ))}
                </TableCell>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleSort("phonenumber")}
                >
                  Phone Number
                  {sortConfig.key === "phonenumber" &&
                    (sortConfig.direction === "asc" ? (
                      <KeyboardArrowUpIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ))}
                </TableCell>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleSort("region")}
                >
                  Region
                  {sortConfig.key === "region" &&
                    (sortConfig.direction === "asc" ? (
                      <KeyboardArrowUpIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ))}
                </TableCell>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleSort("province")}
                >
                  Province
                  {sortConfig.key === "province" &&
                    (sortConfig.direction === "asc" ? (
                      <KeyboardArrowUpIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ))}
                </TableCell>
                <TableCell
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleSort("regisdate")}
                >
                  Registration Date
                  {sortConfig.key === "regisdate" &&
                    (sortConfig.direction === "asc" ? (
                      <KeyboardArrowUpIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ) : (
                      <KeyboardArrowDownIcon
                        sx={{ fontSize: 16, marginLeft: 1 }}
                      />
                    ))}
                </TableCell>
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
              display: "flex",
              justifyContent: "flex-end",
              padding: "16px",
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
