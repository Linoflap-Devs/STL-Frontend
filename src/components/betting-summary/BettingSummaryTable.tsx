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
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PersonOffIcon from "@mui/icons-material/PersonOff";

export interface User {
  transactionNumber: string;
  date: string;
  drawTime: string;
  betAmount: number;
  gameType: string;
  betType: string;
  selectedPair: string;
  status: string;
}

const TableBettingSummary: React.FC = () => {
  const [transactions, setTransactions] = useState<User[]>([
    {
      transactionNumber: "2025040300000001",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 1000,
      gameType: "STL Pares",
      betType: "Straight",
      selectedPair: "12-34",
      status: "Active",
    },
    {
      transactionNumber: "2025040300000002",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2000,
      gameType: "STL Swer2",
      betType: "Rambol",
      selectedPair: "56-78",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000003",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 1500,
      gameType: "STL Swer3",
      betType: "Straight",
      selectedPair: "90-12",
      status: "Active",
    },
    {
      transactionNumber: "2025040300000004",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      gameType: "STL Swer4",
      betType: "Rambol",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000005",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      gameType: "STL Swer4",
      betType: "Rambol",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000006",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      gameType: "STL Swer4",
      betType: "Rambol",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000007",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      gameType: "STL Swer4",
      betType: "Rambol",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000008",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      gameType: "STL Swer4",
      betType: "Rambol",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000009",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      gameType: "STL Swer4",
      betType: "Rambol",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000010",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      gameType: "STL Swer4",
      betType: "Rambol",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000011",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      gameType: "STL Swer4",
      betType: "Rambol",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000012",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      gameType: "STL Swer4",
      betType: "Rambol",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000013",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      gameType: "STL Swer4",
      betType: "Rambol",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000014",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      gameType: "STL Swer4",
      betType: "Rambol",
      selectedPair: "34-56",
      status: "Void",
    },
    {
      transactionNumber: "2025040300000015",
      date: "2025/01/22 13:05:32",
      drawTime: "First Draw",
      betAmount: 2500,
      gameType: "STL Swer4",
      betType: "Rambol",
      selectedPair: "34-56",
      status: "Void",
    },
  ]);
  const [filteredTransactions, setFilteredTransactions] = useState<User[]>(transactions);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Apply search functionality
  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = transactions.filter(
        (transaction) =>
          transaction.transactionNumber.toLowerCase().includes(lowercasedQuery) ||
          transaction.gameType.toLowerCase().includes(lowercasedQuery) ||
          transaction.betType.toLowerCase().includes(lowercasedQuery) ||
          transaction.selectedPair.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [searchQuery, transactions]);

  // Sort functionality
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredTransactions].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredTransactions(sortedData);
  };

  // Render table
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
        </Box>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            {[
              { label: "TRANSACTION NUMBER", key: "transactionNumber" },
              { label: "DATE", key: "date" },
              { label: "DRAW TIME", key: "drawTime" },
              { label: "BET AMOUNT", key: "betAmount" },
              { label: "GAME TYPE", key: "gameType" },
            ].map((column) => (
              <TableCell key={column.key} onClick={() => handleSort(column.key)} sx={{ cursor: "pointer" }}>
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
            <TableCell>BET TYPE</TableCell>
            <TableCell>BET PATTERN</TableCell>
            <TableCell>STATUS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
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
                    No transactions found
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            filteredTransactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction) => (
                <TableRow key={transaction.transactionNumber}>
                  <TableCell>{transaction.transactionNumber}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.drawTime}</TableCell>
                  <TableCell>₱{transaction.betAmount}</TableCell>
                  <TableCell>{transaction.gameType}</TableCell>
                  <TableCell>{transaction.betType}</TableCell>
                  <TableCell>{transaction.selectedPair}</TableCell>
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
                          transaction.status === "Void" ? "#FF7A7A" : "#4CAF50",
                        color: "#171717",
                        "&:hover": {
                          backgroundColor:
                            transaction.status === "Void"
                              ? "#F05252"
                              : "#4CAF50",
                        },
                      }}
                    >
                      {transaction.status}
                    </Button>
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
    </TableContainer>
  );
};

export default TableBettingSummary;