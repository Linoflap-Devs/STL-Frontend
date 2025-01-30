import React, { useState, useEffect } from "react";
import { validateUser } from "../../utils/validation";
import { formatKey } from "../../utils/format";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  FormHelperText,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { User } from "./ManagerTable";

interface UpdateManagerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    id: number;
    firstname: string;
    lastname: string;
    region: string;
    province: string;
    city: string;
    barangay: string;
    streetaddress: string;
    phonenumber: string;
    username: string;
    password: string;
  }) => void;
  manager: User | null;
}

const UpdateManager: React.FC<UpdateManagerProps> = React.memo(
  ({ open, onClose, onSubmit, manager }) => {
    const [user, setUser] = useState<User | null>(manager);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const SPACE: string = "";
    const [selectState, setSelectState] = useState({
      region: manager?.region ?? SPACE,
      province: manager?.province ?? SPACE,
      city: manager?.city ?? SPACE,
      barangay: manager?.barangay ?? SPACE,
    });

    // Custom order for fields
    const customFieldOrder = [
      "firstname",
      "lastname",
      "region",
      "province",
      "city",
      "barangay",
      "streetaddress",
      "phonenumber",
      "username",
      "password",
    ];

    useEffect(() => {
      if (manager) {
        setUser(manager);
        setSelectState({
          region: manager.region || SPACE,
          province: manager.province || SPACE,
          city: manager.city || SPACE,
          barangay: manager.barangay || SPACE,
        });
      }
    }, [manager]);

    const handleManagerChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;

      setUser((prevUser) => {
        if (prevUser === null) {
          return {
            id: undefined,
            firstname: SPACE,
            lastname: SPACE,
            region: SPACE,
            province: SPACE,
            city: SPACE,
            barangay: SPACE,
            streetaddress: SPACE,
            phonenumber: SPACE,
            username: SPACE,
            password: SPACE,
            regisdate: SPACE,
            [name]: value,
          };
        }

        return {
          ...prevUser,
          [name]: value,
        };
      });
    };

    const handleSelectChange = (e: SelectChangeEvent<string>, name: string) => {
      const value = e.target.value.toString();

      setSelectState((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            [name]: value,
          };
        }
        return prevUser;
      });
    };

    const handleUserUpdateSubmit = () => {
      console.log(user);
      if (!user) {
        setErrors({ general: "User data is missing." });
        return;
      }

      const validationErrors = validateUser(user);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      Swal.fire({
        title: "Did you input the correct credentials?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "No, let me check",
        confirmButtonText: "Yes, I did",
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedUserData = {
            id: user.id ?? 0,
            firstname: user.firstname ?? SPACE,
            lastname: user.lastname ?? SPACE,
            region: user.region ?? SPACE,
            province: user.province ?? SPACE,
            city: user.city ?? SPACE,
            barangay: user.barangay ?? SPACE,
            streetaddress: user.streetaddress ?? SPACE,
            phonenumber: user.phonenumber ?? SPACE,
            username: user.username ?? SPACE,
            password: user.password ?? SPACE,
            regisdate: user.regisdate ?? SPACE,
          };

          console.log("Update User Data...");
          onSubmit(updatedUserData);

          Swal.fire({
            title: "Updated!",
            text: "The manager's information has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });

          onClose();
          setUser(null);
        }
      });
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
              xl: "800px",
            },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'justify', }} >
          Update Manager

          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 30,
              top: 30,
              color: '#D1D5D8'[300],
              backgroundColor: '#374151',
            }}
          >
            <CloseIcon sx={{ fontSize: 20, fontWeight: 'bold' }} />
          </IconButton>

        </DialogTitle>
        <DialogContent>
          <Grid
            container
            rowSpacing={2.5}
            columnSpacing={{ xs: 1, sm: 3, md: 2.5 }}
          >
            {customFieldOrder.map((key) =>
              !["id", "regisdate"].includes(key) ? (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography
                    sx={{
                      textAlign: "left",
                      marginBottom: "0.3rem",
                      fontSize: "0.90rem",
                    }}
                  >
                    {formatKey(key)}
                  </Typography>
                  {key === "password" ? (
                    <Grid container spacing={1.5} alignItems="center">
                      <Grid item xs={7}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder={`Enter ${key}`}
                          type={showPassword ? "text" : "password"}
                          value={user?.[key as keyof typeof user] || SPACE}
                          onChange={handleManagerChange}
                          name={key}
                          error={!!errors[key]}
                          helperText={""}
                          InputProps={{
                            endAdornment: (
                              <IconButton
                                sx={{ color: "#9ca3af" }}
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{
                            width: "100%",
                            textTransform: "none",
                            backgroundColor: "#2563EB",
                            borderRadius: "8px",
                          }}
                        >
                          Generate
                        </Button>
                      </Grid>
                      {errors[key] && (
                        <Box
                          sx={{
                            color: "error.main",
                            mt: "3px",
                            marginLeft: "12px",
                            fontSize: "0.75rem",
                          }}
                        >
                          {errors[key]}
                        </Box>
                      )}
                    </Grid>
                  ) : key === "region" ||
                    key === "province" ||
                    key === "city" ||
                    key === "barangay" ? (
                    <FormControl fullWidth error={!!errors[key]}>
                      <Select
                        displayEmpty
                        value={
                          user?.[key as keyof typeof user]?.toString() || SPACE
                        }
                        onChange={(e) => handleSelectChange(e, key)}
                        name={key}
                      >
                        <MenuItem value="" disabled>
                          Select a {formatKey(key)}
                        </MenuItem>
                        <MenuItem value="10">10</MenuItem>
                        <MenuItem value="25">25</MenuItem>
                        <MenuItem value="50">50</MenuItem>
                        <MenuItem value="100">100</MenuItem>
                      </Select>
                      {errors[key] && (
                        <FormHelperText>{errors[key]}</FormHelperText>
                      )}
                    </FormControl>
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder={`Enter ${formatKey(key)}`}
                      value={user?.[key as keyof typeof user] || SPACE}
                      onChange={handleManagerChange}
                      name={key}
                      error={!!errors[key]}
                      helperText={errors[key]}
                    />
                  )}
                </Grid>
              ) : null
            )}
          </Grid>

          <Button
            onClick={handleUserUpdateSubmit}
            sx={{
              mt: 4,
              width: "100%",
              backgroundColor: "#2563EB",
              textTransform: "none",
              fontSize: "12px",
              padding: "0.8rem",
              borderRadius: "8px",
              fontWeight: 700,
            }}
            variant="contained"
          >
            Update Manager
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
);

export default UpdateManager;
