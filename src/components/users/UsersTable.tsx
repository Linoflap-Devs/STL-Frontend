import React from "react";
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
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface UsersTableProps {
  onCreate: () => void; // onCreate is a function with no arguments and no return value
}

// sample data
const UsersTable: React.FC<UsersTableProps> = ({ onCreate }) => {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com" },
  ];

  const tableCellStyle = {
    color: "#637381",
    fontWeight: "bold",
    paddingY: 1.5,
    lineHeight: "2rem",
  };

  const tableContentStyle = (isLastRow: boolean) => ({
    color: "#1C252E",
    borderBottom: isLastRow ? "none" : "1px dotted rgba(145, 158, 171, 0.2)",
  });

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: 0 }}
            gutterBottom
          >
            Users
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "gray", marginTop: 0 }}
            gutterBottom
          >
            Manage Users List
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={onCreate}
          sx={{
            paddingX: 1.8,
            paddingY: 0.8,
            textTransform: "none",
            fontSize: 15,
            borderRadius: 2,
          }}
        >
          <AddIcon sx={{ marginRight: 1 }} /> New User
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#f4f6f8",
              }}
            >
              <TableCell sx={tableCellStyle}>ID</TableCell>
              <TableCell sx={tableCellStyle}>Name</TableCell>
              <TableCell sx={tableCellStyle}>Email</TableCell>
              <TableCell sx={tableCellStyle}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f4f6f8",
                    //cursor: "pointer",
                  },
                }}
              >
                <TableCell sx={tableContentStyle(index === users.length - 1)}>
                  {user.id}
                </TableCell>
                <TableCell sx={tableContentStyle(index === users.length - 1)}>
                  {user.name}
                </TableCell>
                <TableCell sx={tableContentStyle(index === users.length - 1)}>
                  {user.email}
                </TableCell>
                <TableCell sx={tableContentStyle(index === users.length - 1)}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    sx={{ marginRight: 1 }}
                  >
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" size="small">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UsersTable;
