import { useState } from "react";
import { Typography, Box, Tooltip, Dialog, IconButton, DialogContent, Button, TextField } from "@mui/material";
import { verifyPass } from "~/utils/api/auth";
import { addUser } from "~/utils/api/users";
import Swal from "sweetalert2";
import { LoginSectionData } from "../../data/LoginSectionData";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface ConfirmCreateManagerPageProps {
    open: boolean;
    onClose: () => void;
    onVerified: () => void;
    user: any;
    selectState: any;
    onSubmit: (newUser: any) => void;
}

const ConfirmCreateManagerPage: React.FC<ConfirmCreateManagerPageProps> = ({ open, onClose, user, selectState, onSubmit }) => {
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

            setError("");

            const newUser = {
                firstName: user.firstName,
                lastName: user.lastName,
                region: selectState.region,
                province: selectState.province,
                city: selectState.city,
                barangay: user.barangay,
                street: user.street,
                email: user.email,
                password: user.password,
                suffix: user.suffix,
                phoneNumber: user.phoneNumber,
                userTypeId: 3,
            };

            // Proceed to create the user after password verification
            const response = await addUser(newUser);
            if (response.success) {
                Swal.fire({
                    icon: "success",
                    title: "Manager Created!",
                    text: `The manager has been added successfully.`,
                    confirmButtonColor: "#67ABEB",
                });

                onSubmit(newUser);
                onClose();
            } else {
                setError(response.message || "Something went wrong. Please try again.");
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
                <Tooltip title={"Close"}>
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
                            cursor: "pointer",
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

export default ConfirmCreateManagerPage;
