import { useState, useEffect } from "react";
import { Typography, Box, Tooltip, Dialog, IconButton, DialogContent, Button, TextField, FormControl, OutlinedInput, FormHelperText, InputLabel } from "@mui/material";
import { verifyPass } from "~/utils/api/auth";
import { addUser } from "~/utils/api/users";
import Swal from "sweetalert2";
import { LoginSectionData } from "../../data/LoginSectionData";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { inputStyles } from "~/styles/theme";
import { User } from "./UsersTable";
import { useRouter } from "next/router";

interface ConfirmCreateUserPageProps {
    open: boolean;
    onClose: () => void;
    onVerified: () => void;
    user: any;
    onSubmit: (newUser: any) => void;
    //selectedUser: User | null; // for remarks
    //setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>; // for remarks
}

const ConfirmCreateUserPage: React.FC<ConfirmCreateUserPageProps> = ({ open, onClose, user, onSubmit, }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const handleTogglePasswordVisibility = () =>
        setShowPassword((prev) => !prev);
    
    const [userType, setUserType] = useState('');
    const router = useRouter();

    useEffect(() => {
        const pageType = router.asPath.includes('managers') ? 'manager' : 'executive';
        setUserType(pageType);
    }, [router.asPath]);

    // Dynamically set userTypeId based on userType
    const userTypeId = userType === 'manager' ? 2 : 3;

    const handleVerifyCreateUser = async () => {
        if (!password) {
            setError("Password is required.");
            return;
        }

        try {
            const { success: isVerified } = await verifyPass(password);
            if (!isVerified) {
                setError("Invalid password. Please try again.");
                return;
            }
            setError("");

            // Construct the new user object with dynamic userTypeId
            const newUser = {
                ...user,
                userTypeId: userTypeId,
            };

            const response = await addUser(newUser);
            if (!response.success) {
                const errorMessage = response.message || "Something went wrong. Please try again.";
                setError(errorMessage);
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: errorMessage,
                    confirmButtonColor: "#D32F2F",
                });
                return;
            }

            Swal.fire({
                icon: "success",
                title: userTypeId === 2 ? "Manager Created!" : "Executive Created!",
                text: `The ${userTypeId === 2 ? "manager" : "executive"} has been added successfully.`,
                confirmButtonColor: "#67ABEB",
            });

            onSubmit(newUser);
            onClose();
        } catch (error) {
            console.error("Error creating user:", error);
            setError("An unexpected error occurred. Please try again.");
            Swal.fire({
                icon: "error",
                title: "Unexpected Error!",
                text: "An unexpected error occurred. Please try again.",
                confirmButtonColor: "#D32F2F",
            });
        }
    };

    // const handleManagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (selectedUser) {
    //         setSelectedUser((prevUser) => prevUser ? { ...prevUser, remarks: e.target.value } : null);
    //     }
    // };

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
                        paddingX: 1,
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
                            <Box sx={{ paddingX: 5, mt: 3.5, }}>
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    sx={inputStyles}
                                >
                                    <InputLabel htmlFor="remarks">Remarks</InputLabel>
                                    <OutlinedInput
                                        id="remarks"
                                        name="remarks"
                                        placeholder="Enter Remarks"
                                        //value={selectedUser?.remarks || ""}
                                        //onChange={handleManagerChange}
                                        multiline
                                        minRows={3}
                                        label="Remarks"
                                        onKeyDown={(e) => {
                                            if (e.key === "Tab") {
                                                e.stopPropagation();
                                            }
                                        }}
                                    />
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
                                    sx={{ marginTop: 2.5, }}
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
                                    onClick={handleVerifyCreateUser}
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        borderRadius: "8px",
                                        textTransform: "none",
                                        mt: 4,
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

export default ConfirmCreateUserPage;
