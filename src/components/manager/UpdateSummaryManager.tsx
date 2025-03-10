import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from "@mui/icons-material/Search";
import { editLogUser } from "~/utils/api/users"

interface EditLogModalProps {
    open: boolean;
    onClose: () => void;
    userId: number | null;
}

const UpdateSummaryManagerPage: React.FC<EditLogModalProps> = ({ open, onClose, userId }) => {
    const [logData, setLogData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch log details using editLogUser
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

    // Fetch data when modal opens
    useEffect(() => {
        if (open) {
            fetchEditLogDetails();
        }
    }, [open, userId]);

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
                        xl: "1100px",
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
                    sx={{
                        position: 'absolute',
                        right: 30,
                        top: 30,
                        color: '#D1D5D8'[300],
                        backgroundColor: '#282828',
                    }}
                >
                    <CloseIcon sx={{ fontSize: 20, fontWeight: 'bold' }} />
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
                                                <SearchIcon sx={{ fontSize: 20, color: "#9CA3AF" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <TableContainer sx={{ backgroundColor: "#202020" }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Edited By</strong></TableCell>
                                            <TableCell><strong>Time Edited</strong></TableCell>
                                            <TableCell><strong>Previous Value</strong></TableCell>
                                            <TableCell><strong>New Value</strong></TableCell>
                                            <TableCell><strong>Remarks</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logData.map((log) => (
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
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateSummaryManagerPage;
