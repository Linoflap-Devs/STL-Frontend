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
    const [sortConfig, setSortConfig] = useState<{
        key: keyof EditLogFields;
        direction: "asc" | "desc";
    }>({
        key: "CreatedAt",
        direction: "asc",
    });
    const sortedData = sortData(logData, sortConfig);
    const onSortWrapper = (sortKey: keyof (User & EditLogFields)) => {
        handleSort(sortKey as keyof EditLogFields, sortConfig, setSortConfig);
    };
    
    useEffect(() => {
        if (open && userId) {
            fetchEditLogDetails();
        }
    }, [open, userId]);

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
                    xl: "1050px",
                },
            },
        }}
    >
            <DialogTitle>
            {logData.length > 0 ? (
                    <>
                        <Typography sx={{ fontSize: '32px', fontWeight: 'bold' }}>{`${logData[0].User}`}</Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            Manager
                        </Typography>
                    </>
                ) : (
                    "Unknown User"
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
                    ) : logData.length > 0 ? (
                        <>
                            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                                <TextField
                                    variant="outlined"
                                    placeholder="Search"
                                    sx={{
                                        width: "350px",
                                        "& .MuiOutlinedInput-root": {
                                            padding: "9px 14px",
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
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <SortableTableCell
                                                label="Edited By"
                                                sortKey="EditedBy"
                                                sortConfig={sortConfig}
                                                onSort={onSortWrapper}
                                            />
                                            <SortableTableCell
                                                label="Date"
                                                sortKey="CreatedAt"
                                                sortConfig={sortConfig}
                                                onSort={onSortWrapper}
                                            />
                                            <SortableTableCell
                                                label="Old Value"
                                                sortKey="OldValue"
                                                sortConfig={sortConfig}
                                                onSort={onSortWrapper}
                                            />
                                            <SortableTableCell
                                                label="New Value"
                                                sortKey="NewValue"
                                                sortConfig={sortConfig}
                                                onSort={onSortWrapper}
                                            />
                                            <SortableTableCell
                                                label="Remarks"
                                                sortKey="Remarks"
                                                sortConfig={sortConfig}
                                                onSort={onSortWrapper}
                                            />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, index) => (
                                            <TableRow key={log.EditLogDetailsId}>
                                                <TableCell>{log.EditedBy}</TableCell>
                                                <TableCell>{new Date(log.CreatedAt).toLocaleString()}</TableCell>
                                                <TableCell>{log.OldValue || "N/A"}</TableCell>
                                                <TableCell>{log.NewValue || "N/A"}</TableCell>
                                                <TableCell>{log.Remarks || "No remarks"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    ) : (
                        <Typography>No edit logs available.</Typography>
                    )}
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
                            count={logData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(event, newPage) => handleChangePage(event, newPage, setPage)}
                            onRowsPerPageChange={(event) => handleChangeRowsPerPage(event, setRowsPerPage)}
                        />
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default EditLogModalPage;
