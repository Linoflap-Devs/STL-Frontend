import { useState } from "react";
import { Typography, Box, Tooltip, Dialog, IconButton, DialogContent, Button, TextField } from "@mui/material";
import { verifyPass } from "~/utils/api/auth";
import { updateUser } from "~/utils/api/users";
import Swal from "sweetalert2";
import { LoginSectionData } from "../../data/LoginSectionData";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface ConfirmUpdateManagerPageProps {
    open: boolean;
    onClose: () => void;
    onVerified: () => void;
    user: any;
    selectState: any;
    onSubmit: (newUser: any) => void;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

const ConfirmUpdateManagerPage: React.FC<ConfirmUpdateManagerPageProps> = ({ open, onClose, user, selectState, onSubmit, setUser }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const handleTogglePasswordVisibility = () =>
        setShowPassword((prev) => !prev);

    const handleVerify = async () => {
        try {
            if (!password) {
                setError("Password is required.");
                return;
            }
    
            const verifyResponse = await verifyPass(password);
    
            if (!verifyResponse.success) {
                setError("Invalid password. Please try again.");
                return;
            }
    
            setError(""); // Clear previous errors
    
            console.log("Updating user with data:", { ...user, remarks: user.remarks });
    
            if (!user.UserId) {
                console.error("UserId is null");
                return;
            }
    
            const response = await updateUser(user.UserId, {
                ...user,
                remarks: user.remarks,
            });
    
            if (response.success) {
                console.log("User updated successfully:", response.data);
    
                const updatedResponse = await updateUser(user.UserId, { ...user });
                if (updatedResponse.success) {
                    console.log("Fetched updated user data:", updatedResponse.data);
    
                    if (setUser) { // Ensure setUser exists before calling it
                        setUser((prevUser: { remarks: any; }) => ({
                            ...prevUser,
                            ...updatedResponse.data,
                            remarks: updatedResponse.data.remarks ?? prevUser.remarks ?? "",
                        }));
                    }
                } else {
                    console.warn("Failed to fetch updated user data:", updatedResponse.message);
                }
    
                Swal.fire({
                    icon: "success",
                    title: "Manager Updated!",
                    text: "The manager details have been updated successfully.",
                    confirmButtonColor: "#67ABEB",
                });
    
                onSubmit(user);
                onClose();
            } else {
                setError(response.errors || { form: response.message });
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: response.message || "Something went wrong. Please try again.",
                    confirmButtonColor: "#D32F2F",
                });
            }
        } catch (error) {
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
            <DialogContent sx={{ paddingX: 0, }}>
                <Tooltip title={"Back"}>
                    <IconButton
                        component="a"
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            left: 30,
                            top: 40,
                            color: "#D1D5D8"[300],
                            backgroundColor: "#171717",
                            fontWeight: "bold",
                        }}
                    >
                        <ArrowBackIosNewIcon
                            sx={{ fontSize: 23, fontWeight: "bold" }}
                        />
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
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                marginTop: "1rem",
                                //paddingX: 3,
                            }}
                        >
                            <Box
                                component="img"
                                src={LoginSectionData.image}
                                alt="altLogo"
                                sx={{
                                    maxWidth: {
                                        xs: "10%",
                                        sm: "35%",
                                        md: "32%",
                                        lg: "32%",
                                        xl: "32%",
                                    },
                                    margin: "0 auto",
                                    display: "block",
                                    marginBottom: "0.6rem",
                                }}
                                loading="lazy"
                            />

                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                {LoginSectionData.ConfirmIdentity}
                            </Typography>
                            <Typography
                                sx={{ marginTop: 0.4, color: "#9CA3AF", fontSize: "12.5px" }}
                            >
                                {LoginSectionData.ConfirmIdentityDescription}
                            </Typography>
                            <Box sx={{ paddingX: 5, }}>
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
                                    sx={{ marginTop: 4, }}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                sx={{ color: "#9CA3AF", fontSize: "1.3rem", }}
                                                onClick={handleTogglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff sx={{ fontSize: "inherit" }} />
                                                ) : (
                                                    <Visibility sx={{ fontSize: "inherit" }} />
                                                )}
                                            </IconButton>
                                        ),
                                    }}
                                />
                                <Button
                                    type="submit"
                                    onClick={handleVerify}
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

export default ConfirmUpdateManagerPage;
