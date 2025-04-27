import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import FilterListIcon from "@mui/icons-material/FilterList";
import fetchTransactions from "~/utils/api/transactions/getTransactions";

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

const TableWinningSummary: React.FC = () => {
  const [transactions, setTransactions] = useState<User[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = {
          page: 1,
          limit: 10,
        };

        const response = await fetchTransactions(queryParams);

        if (response.success) {
          // Transform the API data to match the User interface
          const transformedData = response.data.map((transaction) => ({
            transactionNumber: transaction.TransactionNumber.replace(/-/g, ""), // Remove hyphens
            date: new Date(transaction.DateOfTransaction).toLocaleDateString(),
            drawTime: "WIP", // Placeholder for Draw Time
            betAmount: transaction.BetAmount,
            gameType: transaction.GameType,
            betType: transaction.BetType,
            selectedPair: `${transaction.CombinationOne}-${transaction.CombinationTwo}`, // Use hyphen instead of ampersand
            status: "WIP", // Placeholder for Status
          }));

          setTransactions(transformedData);
          setFilteredTransactions(transformedData); // Initialize filtered data
        } else {
          setError(response.message || "Failed to fetch transactions");
        }
      } catch (err) {
        setError("An error occurred while fetching transactions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply search functionality
  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = transactions.filter(
        (transaction) =>
          transaction.transactionNumber
            .toLowerCase()
            .includes(lowercasedQuery) ||
          transaction.gameType.toLowerCase().includes(lowercasedQuery) ||
          transaction.betType.toLowerCase().includes(lowercasedQuery) ||
          transaction.selectedPair.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [searchQuery, transactions]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Searchable Transaction Number, Game Type, Bet Type, and Selected Pair
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
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: "#9CA3AF" }} />
                  </InputAdornment>
                ),
              }}
            />
            {isFilterActive ? (
              <FilterListIcon
                onClick={() => setIsFilterActive(!isFilterActive)}
                sx={{ marginLeft: 2, color: "#9CA3AF", cursor: "pointer" }}
              />
            ) : (
              <FilterListIcon
                onClick={() => setIsFilterActive(!isFilterActive)}
                sx={{ marginLeft: 2, color: "#9CA3AF", cursor: "pointer" }}
              />
            )}
          </Box>
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
                  <TableCell>₱{transaction.betAmount}</TableCell>{" "}
                  {/* Add peso sign */}
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

export default TableWinningSummary;
