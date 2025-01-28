import React, { useState, useEffect } from "react";
import ManagerTable, { User } from '~/components/manager/ManagerTable';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Grid,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface UpdateManagerProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (userData: User) => void;
    manager: User | null;
}

const UpdateManager: React.FC<UpdateManagerProps> = ({ open, onClose, onSubmit, manager }) => {
    const [showPassword, setShowPassword] = useState(false);

    const [user, setUser] = useState<User>({
        id: manager?.id || undefined,
        firstname: manager?.firstname || '',
        lastname: manager?.lastname || '',
        region: manager?.region || '',
        province: manager?.province || '',
        city: manager?.city || '',
        barangay: manager?.barangay || '',
        streetaddress: manager?.streetaddress || '',
        phonenumber: manager?.phonenumber || '',
        username: manager?.username || '',
        password: manager?.password || '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (open && manager) {
            setUser(manager); // Sync the manager data when the modal opens
        }
    }, [open, manager]);

    const handleManagerChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name as string]: value as string,
        }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        Object.entries(user).forEach(([key, value]) => {
            if (!value) {
                newErrors[key] = `${formatKey(key)} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUserUpdateSubmit = () => {
        if (validate()) {
            onSubmit(user); // Pass user data to onSubmit
        }
    };

    const formatKey = (key: string) => {
        return key
            .replace(/(name|address|number)/gi, " $1")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
            .trim()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Update User</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={user.firstname}
                            name="firstname"
                            onChange={handleManagerChange}
                            error={!!errors.firstname}
                            helperText={errors.firstname}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={user.lastname}
                            name="lastname"
                            onChange={handleManagerChange}
                            error={!!errors.lastname}
                            helperText={errors.lastname}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={user.phonenumber}
                            name="phonenumber"
                            onChange={handleManagerChange}
                            error={!!errors.phonenumber}
                            helperText={errors.phonenumber}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={user.username}
                            name="username"
                            onChange={handleManagerChange}
                            error={!!errors.username}
                            helperText={errors.username}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={user.password}
                            name="password"
                            onChange={handleManagerChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleUserUpdateSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateManager;