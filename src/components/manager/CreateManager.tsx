import React, { useState } from "react";
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
import { validateUser } from "../../utils/validation";
import { formatKey } from "../../utils/format";
import { User } from "./ManagerTable";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { inputStyles, inputErrorStyles } from "../../styles/theme";

export interface CreateManagerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: User | null) => void;
  userData: User | null;
  managers: User[];
}

const CreateManager: React.FC<CreateManagerProps> = ({
  open,
  onClose,
  onSubmit,
  userData,
  managers,
}) => {
  const SPACE: string = "";
  const [user, setUser] = useState({
    id: userData?.id ?? SPACE,
    firstname: userData?.firstname ?? SPACE,
    lastname: userData?.lastname ?? SPACE,
    region: userData?.region ?? SPACE,
    province: userData?.province ?? SPACE,
    city: userData?.city ?? SPACE,
    barangay: userData?.barangay ?? SPACE,
    streetaddress: userData?.streetaddress ?? SPACE,
    phonenumber: userData?.phonenumber ?? SPACE,
    username: userData?.username ?? SPACE,
    password: SPACE,
    regisdate: userData?.regisdate ?? SPACE,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [selectState, setSelectState] = useState({
    region: userData?.region ?? SPACE,
    province: userData?.province ?? SPACE,
    city: userData?.city ?? SPACE,
    barangay: userData?.barangay ?? SPACE,
  });

  // form handlings
  const handleManagerChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name as string]: value as string }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>, name: string) => {
    setSelectState((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  // generate password
  const handleGeneratePassword = () => {
    const generatedPassword = "0912Gg33*12"; // hardcoded
    setUser((prevUser) => ({ ...prevUser, password: generatedPassword }));
  };

  // handle create submit
  const handleManagerCreateSubmit = () => {
    const generatedId = managers.length + 1;
    const combinedUserData = {
      ...user,
      ...selectState,
      id: generatedId,
    };
    const validationErrors = validateUser(combinedUserData);
    console.log("Submitted data:", combinedUserData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Valid user data, submitting...");

      Swal.fire({
        title: "Did you input the correct credentials?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "No, let me check",
        confirmButtonText: "Yes, I did",
      }).then((result) => {
        if (result.isConfirmed) {
          onSubmit(combinedUserData);
          onClose();

          // Show success message
          Swal.fire({
            title: "Success!",
            text: "Manager added successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });

          setUser({
            ...user,
            firstname: "",
            lastname: "",
            username: "",
            password: "",
            regisdate: "",
          });
          setSelectState({ region: "", province: "", city: "", barangay: "" });
        }
      });
    } else {
      console.log("Validation errors:", validationErrors);
    }
  };

  // handle dummy data
  const handleDummyData = () => {
    setUser({
      id: managers.length + 1,
      firstname: "John",
      lastname: "Doe",
      region: "Region IV-A",
      province: "Cavite",
      city: "Dasmariñas",
      barangay: "Salawag",
      streetaddress: "123 Main St",
      phonenumber: "0912 345 6789",
      username: "johndoe@username.com",
      password: "DummyPass123!",

      regisdate: new Date().toISOString(),
    })

    setSelectState({
      region: "100",
      province: "100",
      city: "100",
      barangay: "100",
    });
  }

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
        Add Manager
        <Button
          variant="contained"
          onClick={handleDummyData}
          sx={{
            marginLeft: 2,
            paddingX: 3,
            paddingY: 0.5,
            textTransform: "none",
            fontSize: 12,
            borderRadius: "8px",
            backgroundColor: "#2563EB",
            width: "auto",
          }}
        > Dummy Data
        </Button>

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
          {Object.keys(user).map((key) =>
            !["id", "regisdate"].includes(key) ? (
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ padding: { xs: 0, sm: 0 } }}
                key={key}
              >
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
                        value={user[key as keyof typeof user]}
                        onChange={handleManagerChange}
                        name={key}
                        error={!!errors[key]}
                        helperText={''}
                        sx={inputStyles}
                        InputProps={{
                          endAdornment: (
                            <IconButton sx={{
                              color: "#9ca3af"
                            }}
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleGeneratePassword}
                        sx={{
                          width: "100%",
                          textTransform: "none",
                          backgroundColor: "#2563EB",
                          borderRadius: "8px"
                        }}
                      >
                        Generate
                      </Button>
                    </Grid>
                    {errors[key] && (
                      <Box sx={{
                        color: 'error.main',
                        mt: "3px",
                        marginLeft: '12px',
                        fontSize: '0.85rem'
                      }}>
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
                      value={selectState[key as keyof typeof selectState] || SPACE}
                      onChange={(e) => handleSelectChange(e, key)}
                      name={key}
                      inputProps={{
                        "aria-label": formatKey(key),
                      }}
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
                    value={user[key as keyof typeof user] || SPACE}
                    onChange={handleManagerChange}
                    name={key}
                    error={!!errors[key]}
                    helperText={errors[key] || SPACE}
                    sx={inputStyles}
                  />
                )}
              </Grid>
            ) : null
          )}
        </Grid>

        <Button
          onClick={handleManagerCreateSubmit}
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
          Add Manager
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateManager;