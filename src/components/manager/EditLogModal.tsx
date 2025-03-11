import React, { Key, useEffect, useState } from "react";
import {
    Box,
    TextField,
    Dialog,
    InputAdornment,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    TablePagination,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SearchOffIcon from "@mui/icons-material/SearchOff";
import {
    SortableTableCell,
    sortData,
    handleSort,
    handleChangePage,
    handleChangeRowsPerPage,
} from "../../utils/sortPaginationSearch";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { editLogUser } from "~/utils/api/users";
import { User } from "./ManagerTable";

export interface EditLogFields {
    EditLogDetailsId: Key | null | undefined;
    User: string;
    EditedBy: string;
    CreatedAt: string;
    OldValue: string;
    NewValue: string;
    Remarks: string;
}

interface EditLogModalProps {
    open: boolean;
    onClose: () => void;
    userId: number | null;
}

const EditLogModalPage: React.FC<EditLogModalProps> = ({ open, onClose, userId }) => {
    const [logData, setLogData] = useState<EditLogFields[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof EditLogFields;
        direction: "asc" | "desc";
    }>({
        key: "CreatedAt",
        direction: "asc",
    });
    const sortedData = sortData(logData, sortConfig);
    const filteredData = sortedData.filter((item) => {
        const searchLower = searchQuery?.toLowerCase() || '';
        return (
            (item.User?.toLowerCase() || '').includes(searchLower) ||
            (item.EditedBy?.toLowerCase() || '').includes(searchLower) ||
            (item.OldValue?.toLowerCase() || '').includes(searchLower) ||
            (item.NewValue?.toLowerCase() || '').includes(searchLower) ||
            (item.Remarks?.toLowerCase() || '').includes(searchLower)
        );
    });
    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );
    
    useEffect(() => {
        if (open && userId) {
            fetchEditLogDetails();
        }
    }, [open, userId]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const fetchEditLogDetails = async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);

        try {
            const response = await editLogUser(userId, {});
            if (response.success) {
                setLogData(response.data);
            } else {
                setError(response.message || "Failed to fetch logs");
            }
        } catch (err) {
            setError("Error fetching edit log details");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            PaperProps={{
                sx: {
                    width: "100%",
                    maxWidth: {
                        xs: "90%",
                        sm: "80%",
                        md: "600px",
                        lg: "650px",
                        xl: "1080px",
                    },
                },
            }}
        >
                <DialogTitle>
                    {userId ? (
                        <>
                            <Typography sx={{ fontSize: '32px', fontWeight: 'bold' }}>
                                {logData.length > 0 ? `${logData[0]?.User}` : "Unknown User"}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary">
                                Manager
                            </Typography>
                        </>
                    ) : (
                        "No User Information"
                    )}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: "absolute", right: 30, top: 30 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
            <DialogContent>
                <Box sx={{ backgroundColor: "#171717", borderRadius: "8px", padding: 2 }}>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <TableContainer>
                            <Box sx={{ display: "flex", alignItems: "center", paddingTop: 1, marginBottom: 2 }}>
                                <TextField
                                    variant="outlined"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <SortableTableCell
                                            label="Edited By"
                                            sortKey="EditedBy"
                                            sortConfig={sortConfig}
                                            onSort={() => handleSort("EditedBy", sortConfig, setSortConfig)}
                                        />
                                        <SortableTableCell
                                            label="Date"
                                            sortKey="CreatedAt"
                                            sortConfig={sortConfig}
                                            onSort={() => handleSort("CreatedAt", sortConfig, setSortConfig)}
                                        />
                                        <SortableTableCell
                                            label="Old Value"
                                            sortKey="OldValue"
                                            sortConfig={sortConfig}
                                            onSort={() => handleSort("OldValue", sortConfig, setSortConfig)}
                                        />
                                        <SortableTableCell
                                            label="New Value"
                                            sortKey="NewValue"
                                            sortConfig={sortConfig}
                                            onSort={() => handleSort("NewValue", sortConfig, setSortConfig)}
                                        />
                                        <SortableTableCell
                                            label="Remarks"
                                            sortKey="Remarks"
                                            sortConfig={sortConfig}
                                            onSort={() => handleSort("Remarks", sortConfig, setSortConfig)}
                                        />
                                    </TableRow>
                                </TableHead>
                                    <TableBody>
                                        {filteredData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "center",
                                                            py: 5,
                                                        }}
                                                    >
                                                        <EditIcon sx={{ fontSize: 50, color: "gray" }} />
                                                        <Typography variant="h6" color="textSecondary" sx={{ mt: 2, fontWeight: 500 }}>
                                                            No Edit Log found
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedData.map((log) => (
                                                <TableRow key={log.EditLogDetailsId}>
                                                    <TableCell>{log.EditedBy}</TableCell>
                                                    <TableCell>{new Date(log.CreatedAt).toLocaleString()}</TableCell>
                                                    <TableCell>{log.OldValue || "N/A"}</TableCell>
                                                    <TableCell>{log.NewValue || "N/A"}</TableCell>
                                                    <TableCell>{log.Remarks || "No remarks"}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>

                            </Table>
                            <Box>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, 100]}
                                    component="div"
                                    count={filteredData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={(event, newPage) => handleChangePage(event, newPage, setPage)}
                                    onRowsPerPageChange={(event) => handleChangeRowsPerPage(event, setRowsPerPage)}
                                />
                            </Box>
                        </TableContainer>
                    )}
                </Box>
                
            </DialogContent>
        </Dialog>
    );
};

export default EditLogModalPage;
