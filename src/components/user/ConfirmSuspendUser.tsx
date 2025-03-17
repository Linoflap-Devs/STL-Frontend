import { useState } from "react";
import {
    Typography,
    Box,
    Tooltip,
    Dialog,
    IconButton,
    DialogContent,
    Button,
    TextField,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
} from "@mui/material";
import { inputStyles } from "../../styles/theme";
import { verifyPass } from "~/utils/api/auth";
import { updateUser } from "~/utils/api/users";
import Swal from "sweetalert2";
import { LoginSectionData } from "../../data/LoginSectionData";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { User } from "./UsersTable";

interface ConfirmSuspendManagerPageProps {
    open: boolean;
    onClose: () => void;
    onVerified: (user: User) => void;
    selectedUser: User | null;
    onSubmit: (newUser: User) => void;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const ConfirmSuspendManagerPage: React.FC<ConfirmSuspendManagerPageProps> = ({
    open,
    onClose,
    selectedUser,
    onSubmit,
    setSelectedUser,
    onVerified,
}) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const handleManagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedUser) {
            setSelectedUser((prevUser) => prevUser ? { ...prevUser, remarks: e.target.value } : null);
        }
    };

    const handleVerifySuspendManager = async () => {
        try {
            if (!password) return setError("Password is required.");

            const verifyResponse = await verifyPass(password);
            if (!verifyResponse.success)
                return setError("Invalid password. Please try again.");

            setError("");
            if (!selectedUser?.userId)
                return console.error("UserId is null");

            const response = await updateUser(selectedUser.userId, { isActive: 0, remarks: selectedUser.remarks });
            if (!response.success) {
                setError(response.errors ? response.errors : response.message);
                return Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: response.message || "Something went wrong. Please try again.",
                    confirmButtonColor: "#D32F2F",
                });
            }

            // Fetch updated user data
            const updatedResponse = await updateUser(selectedUser.userId, { ...selectedUser });
            if (updatedResponse.success) {
                setSelectedUser((prevUser) => prevUser ? {
                    ...prevUser,
                    ...updatedResponse.data,
                    remarks: updatedResponse.data.remarks ?? prevUser.remarks ?? "",
                } : null);
            } else {
                console.warn("Failed to fetch updated user data:", updatedResponse.message);
            }

            Swal.fire({
                icon: "success",
                title: "Manager Suspended!",
                text: "The manager has been suspended successfully.",
                confirmButtonColor: "#67ABEB",
            });

            onClose();
            onVerified(selectedUser);
        } catch (error) {
            console.error("Unexpected error:", error);
            setError("An unexpected error occurred. Please try again.");
            Swal.fire({
                icon: "error",
                title: "Unexpected Error!",
                text: "An unexpected error occurred. Please try again.",
                confirmButtonColor: "#D32F2F",
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent sx={{ paddingX: 0 }}>
                <Tooltip title="Back">
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            left: 30,
                            top: 40,
                            color: "#D1D5D8",
                            backgroundColor: "#171717",
                            fontWeight: "bold",
                        }}
                    >
                        <ArrowBackIosNewIcon sx={{ fontSize: 23, fontWeight: "bold" }} />
                    </IconButton>
                </Tooltip>
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 500,
                            paddingBottom: "1rem",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            position: "relative",
                        }}
                    >
                        <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
                            <Box
                                component="img"
                                src={LoginSectionData.image}
                                alt="altLogo"
                                sx={{
                                    maxWidth: { xs: "10%", sm: "35%", md: "32%" },
                                    margin: "0 auto",
                                    display: "block",
                                    marginBottom: "0.6rem",
                                }}
                                loading="lazy"
                            />
                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                {LoginSectionData.ConfirmIdentity}
                            </Typography>
                            <Typography sx={{ marginTop: 0.4, color: "#9CA3AF", fontSize: "12.5px" }}>
                                {LoginSectionData.ConfirmIdentityDescription}
                            </Typography>
                            <Box sx={{ paddingX: 5, marginTop: 4 }}>
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    sx={inputStyles}
                                    error={Boolean(errors.remarks)}
                                >
                                    <InputLabel htmlFor="remarks">Remarks</InputLabel>
                                    <OutlinedInput
                                        id="remarks"
                                        name="remarks"
                                        placeholder="Enter Remarks"
                                        value={selectedUser?.remarks || ""}
                                        onChange={handleManagerChange}
                                        multiline
                                        minRows={3}
                                        label="Remarks"
                                        onKeyDown={(e) => {
                                            if (e.key === "Tab") {
                                                e.stopPropagation();
                                            }
                                        }}
                                    />
                                    {errors.remarks && <FormHelperText>{errors.remarks}</FormHelperText>}
                                </FormControl>
                                <TextField
                                    label="Password"
                                    placeholder="Enter your Password"
                                    type={showPassword ? "text" : "password"}
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={!!error}
                                    helperText={error}
                                    autoFocus
                                    sx={{ marginTop: 2 }}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                sx={{ color: "#9CA3AF", fontSize: "1.3rem" }}
                                                onClick={handleTogglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff sx={{ fontSize: "inherit" }} /> : <Visibility sx={{ fontSize: "inherit" }} />}
                                            </IconButton>
                                        ),
                                        onKeyDown: (e) => {
                                            if (e.key === "Tab") {
                                                e.stopPropagation();
                                            }
                                        },
                                    }}
                                />
                                <Button
                                    type="submit"
                                    onClick={handleVerifySuspendManager}
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        borderRadius: "8px",
                                        textTransform: "none",
                                        marginTop: 3,
                                    }}
                                    disabled={false}
                                >
                                    Confirm
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmSuspendManagerPage;
