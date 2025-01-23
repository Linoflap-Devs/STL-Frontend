import React, { useEffect, useState } from "react";
import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Button, 
    TextField } 
from "@mui/material";

interface CreateUsersProps {
    open: boolean;
    onClose: () => void;  // Function to close the modal
    onSubmit: (userData: { name: string; email: string }) => void; // Function to handle form submission
    userData: { name: string; email: string }| null;
  }
  
  const CreateUsers: React.FC<CreateUsersProps> = ({ open, onClose, onSubmit, userData }) => {
    const [user, setUser] = useState({ // storing
    name: "",
    email: "",
  });

  useEffect(() => {
    if (userData) {
      setUser({ name: userData.name, email: userData.email });
    }
  }, [userData]); // updating data

  const handleUserChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleUserCreateSubmit = () => {
    onSubmit(user);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{"Create User"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          value={user.name}
          onChange={handleUserChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={user.email}
          onChange={handleUserChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUserCreateSubmit} color="primary">
          {"Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUsers;
