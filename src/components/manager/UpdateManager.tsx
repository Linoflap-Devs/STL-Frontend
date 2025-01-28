import React, { useState, useEffect } from "react";
import { validateUser } from "../../utils/validation";
import { formatKey } from "../../utils/format";
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
    const [user, setUser] = useState(manager);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);

    const [selectState, setSelectState] = useState({
      region: manager?.region ?? "", 
      province: manager?.province ?? "",
      city: manager?.city ?? "",
      barangay: manager?.barangay ?? "",
    });
    
    // Custom order for fields
    const customFieldOrder = [
      "firstname", "lastname", "region", "province", "city", "barangay",
      "streetaddress", "phonenumber", "username", "password"
    ];

    // siya nag uupdate / set ng bagong data - manager
    useEffect(() => {
      if (manager) {
        setSelectState({
          region: manager.region || "",
          province: manager.province || "",
          city: manager.city || "",
          barangay: manager.barangay || "",
        });
      }
    }, [manager]);

    const handleManagerChange = (
      e: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
      const { name, value } = e.target;
      
      setUser((prevUser) => {
        if (prevUser === null) {
           return {
            id: undefined,
            firstname: '',
            lastname: '',
            region: '',
            province: '',
            city: '',
            barangay: '',
            streetaddress: '',
            phonenumber: '',
            username: '',
            password: '',
            regisdate: '',
            [name as string]: value as string,
          };
        }
        
        return {
          ...prevUser,
          [name as string]: value as string,
        };
      });
    };
    
    const handleUserUpdateSubmit = () => {
      if (user === null) {
        setErrors({
          general: "User data is missing.",
        });
        return;
      }
    
      const validationErrors = validateUser(user);
      setErrors(validationErrors);
    };
    
    function handleSelectChange(e: SelectChangeEvent<string>, key: string): void {
      throw new Error("Function not implemented.");
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
        <DialogTitle>Update Manager</DialogTitle>
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
                          value={user?.[key as keyof typeof user] || ""}
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
                            fontSize: "0.80rem",
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
                          selectState[key as keyof typeof selectState] || ""
                        }
                        onChange={(e) => handleSelectChange(e, key)} 
                        name={key}
                      >
                        <MenuItem value="" disabled>
                          Select a {formatKey(key)}
                        </MenuItem>
                        <MenuItem value="option1">Option 1</MenuItem>
                        <MenuItem value="option2">Option 2</MenuItem>
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
                      value={user?.[key as keyof typeof user] || ""}
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
              mt: 6,
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
