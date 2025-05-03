import React, { useState, useEffect } from "react";
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
  TablePagination,
  IconButton,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MoreHoriz } from "@mui/icons-material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PersonOffIcon from "@mui/icons-material/PersonOff";

import ModalAddOperator from "./AddOperatorModal";
import ModalViewOperator from "./ViewOperatorModal";

import Swal from "sweetalert2";
import ModalDeleteteConfirmIdentity from "./DeleteConfirmIdentityModal";

export interface Operators {
  companyName: string;
  approvedAreaOfOperations: string;
  dateOfOperations: string;
  createdBy: string;
  status: string;
}

const ActionsMenu = ({
  onView,
  onDelete,
}: {
  onView: () => void;
  onDelete: () => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreHoriz />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            onView();
            handleClose();
          }}
        >
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete();
            handleClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

const TableOperatorsSummary = () => {
  const [transactions, setTransactions] = useState<Operators[]>([
    {
      companyName: "Chivalric Incorporated",
      approvedAreaOfOperations:
        "Marikina City, Mandaluyong City, San Juan City",
      dateOfOperations: "2017",
      createdBy: "Renato Villareal",
      status: "Active",
    },
    {
      companyName: "Great Mind Games and Amusement Corp.",
      approvedAreaOfOperations: "Muntinlupa",
      dateOfOperations: "July 01, 2021",
      createdBy: "Chris Fuentes",
      status: "Active",
    },
    {
      companyName: "Lucent Gaming and Entertainment Corp.",
      approvedAreaOfOperations: "Quezon",
      dateOfOperations: "July 15, 2021",
      createdBy: "Renato Villareal",
      status: "Active",
    },
    {
      companyName: "Bet and Win Gaming Corporation",
      approvedAreaOfOperations: "Taguig",
      dateOfOperations: "May 01, 2022",
      createdBy: "Renato Villareal",
      status: "Active",
    },
    {
      companyName: "Ludis Bay Corporation",
      approvedAreaOfOperations: "Caloocan",
      dateOfOperations: "May 24, 2023",
      createdBy: "Fredrick Oriondo",
      status: "Active",
    },
    {
      companyName: "Plutus Gaming Corporation",
      approvedAreaOfOperations: "Manila",
      dateOfOperations: "July 24, 2023",
      createdBy: "Fredrick Oriondo",
      status: "Active",
    },
    {
      companyName: "Winning Pick Gaming Corporation",
      approvedAreaOfOperations: "Malabon",
      dateOfOperations: "July 31, 2023",
      createdBy: "Renato Villareal",
      status: "Active",
    },
    {
      companyName: "OT 7 Gaming Corporation",
      approvedAreaOfOperations: "Parañaque",
      dateOfOperations: "August 06, 2023",
      createdBy: "Rob Perido",
      status: "Active",
    },
    {
      companyName: "2528 Iris Gaming Corporation",
      approvedAreaOfOperations: "Las Piñas",
      dateOfOperations: "September 01, 2023",
      createdBy: "Renato Villareal",
      status: "Active",
    },
    {
      companyName: "Tiger Claw Leisure Incorporated",
      approvedAreaOfOperations: "Pasay",
      dateOfOperations: "November 03, 2023",
      createdBy: "Renato Villareal",
      status: "Active",
    },
  ]);
  const [filteredTransactions, setFilteredTransactions] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  
  // State to track which operator to view
  const [selectedOperator, setSelectedOperator] = useState<Operators | null>(
    null
  );
  // State for Modals
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  // Apply search functionality
  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = transactions.filter(
        (transaction) =>
          transaction.companyName.toLowerCase().includes(lowercasedQuery) ||
          transaction.approvedAreaOfOperations
            .toLowerCase()
            .includes(lowercasedQuery) ||
          transaction.dateOfOperations
            .toLowerCase()
            .includes(lowercasedQuery) ||
          transaction.createdBy.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [searchQuery, transactions]);

  // Sort functionality
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredTransactions].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredTransactions(sortedData);
  };

  const handleDelete = (companyName: string) => {
    
    Swal.fire({
      title: "Delete Confirmation",
      text: `Are you sure you want to delete ${companyName}'s account?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF7A7A",
      cancelButtonColor: "#808080",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        setTransactions((prev) =>
          prev.filter((t) => t.companyName !== companyName)
        );
        setOpenDeleteModal(true)
      }
    });
  };
  const handleModalConfirm = () =>{
    setOpenDeleteModal(false)
    Swal.fire({
      title: "Operator Deleted",
      text: `OT 7 Gaming Corporation has been successfully deleted`,
      icon: "success",
      confirmButtonColor: "#67ABEB",
    });
  }
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
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: "#9CA3AF" }} />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton sx={{ marginLeft: 2 }}>
              <FilterListIcon sx={{ fontSize: 24, color: "#9CA3AF" }} />
            </IconButton>
          </Box>
          <Box>
            <button
              style={{
                backgroundColor: "#67ABEB",
                color: "#000",
                border: "none",
                padding: "10px 24px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "400",
                cursor: "pointer",
                width: "150px",
              }}
              onClick={() => setOpenAddModal(true)}
            >
              Add Operators
            </button>
          </Box>
        </Box>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            {[
              { label: "Company Name", key: "companyName" },
              {
                label: "Approved Area of Operations",
                key: "approvedAreaOfOperations",
              },
              { label: "Date of Operations", key: "dateOfOperations" },
              { label: "Created By", key: "createdBy" },
              { label: "Status", key: "status" },
              { label: "Actions", key: "" },
            ].map((column) => (
              <TableCell
                key={column.key}
                onClick={() => handleSort(column.key)}
                sx={{ cursor: "pointer" }}
              >
                {column.label}
                {sortConfig?.key === column.key ? (
                  sortConfig.direction === "asc" ? (
                    <ArrowUpwardIcon sx={{ fontSize: 16, marginLeft: 1 }} />
                  ) : (
                    <ArrowDownwardIcon sx={{ fontSize: 16, marginLeft: 1 }} />
                  )
                ) : null}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
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
                    No operators found
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            filteredTransactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((operator, index) => (
                <TableRow key={index}>
                  <TableCell>{operator.companyName}</TableCell>
                  <TableCell>{operator.approvedAreaOfOperations}</TableCell>
                  <TableCell>{operator.dateOfOperations}</TableCell>
                  <TableCell>{operator.createdBy}</TableCell>
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
                          operator.status === "Inactive"
                            ? "#FF7A7A"
                            : "#4CAF50",
                        color: "#171717",
                        "&:hover": {
                          backgroundColor:
                            operator.status === "Inactive"
                              ? "#F05252"
                              : "#4CAF50",
                        },
                      }}
                    >
                      {operator.status}
                    </Button>
                  </TableCell>
                  <TableCell>
                  <ActionsMenu
                    onView={() => {
                      setSelectedOperator(operator);
                      setOpenViewModal(true);
                    }}
                    onDelete={() => handleDelete(operator.companyName)}
                  />
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
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
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>

      {openAddModal && (
        <ModalAddOperator
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
        />
      )}
      <ModalViewOperator
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
      />
      <ModalDeleteteConfirmIdentity
        open={openDeleteModal}
        onClose={()=> setOpenDeleteModal(false)}
        onConfirm={handleModalConfirm}
      />
    </TableContainer>
  );
};

export default TableOperatorsSummary;
