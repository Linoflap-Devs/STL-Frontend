import React from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Modal,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2'
import CloseIcon from '@mui/icons-material/Close';
import { useOperatorsStore } from '../../../store/useOperatorStore';

interface AddOperatorModalProps {
  open: boolean;
  onClose: () => void;
}

const ModalAddOperator = ({ open, onClose }: AddOperatorModalProps) => {
  const {
    addOperatorForm,
    setOperatorFormData,
    setAllGameTypes,
  } = useOperatorsStore();
  const handleChange= (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value} = e.target;
    setOperatorFormData({ [name]: value})
  }
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAllGameTypes({ [name]: checked });
  }

  // Debugging
  console.log('AddOperatorForm', addOperatorForm)
  
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-operator-modal-title"
      aria-describedby="add-operator-modal-description"
    >
      <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#212121',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: "848px",
          height: "472px"
      }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center', 
            mb: 1,
          }}
        >
          <Typography id="add-operator-modal-title" variant="h6" component="h2">
            Add Operator
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={2} mb={1}>
            <Grid size={6}>
              <TextField 
                  fullWidth 
                  label="Company Name" 
                  name="companyName"
                  variant="outlined"
                  margin="normal" 
                  value={ addOperatorForm.companyName} 
                  onChange={handleChange}
                  />
              <TextField 
                  fullWidth 
                  label="Email Address"
                  name="email"
                  variant="outlined" 
                  margin="normal" 
                  value={addOperatorForm.email}
                  onChange={handleChange}
              />
              <TextField 
                  fullWidth 
                  label="Phone Number" 
                  name="phone"
                  variant="outlined" 
                  margin="normal" 
                  value={addOperatorForm.phone}
                  onChange={handleChange}
              />
            </Grid>
            <Grid size={6}>
              <TextField 
                  fullWidth 
                  label="Date of Operations"
                  name="dateOfOperations"
                  variant="outlined" 
                  margin="normal" 
                  value={addOperatorForm.dateOfOperations}
                  onChange={handleChange}
              />
              <TextField 
                  fullWidth 
                  label="Area of Operations"
                  name="areaOfOperations" 
                  variant="outlined" 
                  margin="normal"
                  multiline rows={3} 
                  value={addOperatorForm.areaOfOperations}
                  onChange={handleChange}
              />
            </Grid>
        </Grid>
        <Typography variant="subtitle1" gutterBottom>
          Game Type Included
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <FormControlLabel 
              control={<Checkbox name="stlPares"/>} 
              label="STL Pares"
              checked={addOperatorForm.gameTypes.stlPares}
              onChange={handleCheckboxChange}
          />
          <FormControlLabel 
              control={<Checkbox name="stlSwer2"/>} 
              label="STL Swer2" 
              checked={addOperatorForm.gameTypes.stlSwer2}
              onChange={handleCheckboxChange}
          />
          <FormControlLabel 
              control={<Checkbox name="stlSwer3" />} 
              label="STL Swer3"
              checked={addOperatorForm.gameTypes.stlSwer3}
              onChange={handleCheckboxChange}
          />
          <FormControlLabel 
              control={<Checkbox name="stlSwer4" />} 
              label="STL Swer4"
              checked={addOperatorForm.gameTypes.stlSwer4}
              onChange={handleCheckboxChange}
          />
          <FormControlLabel 
              control={<Checkbox name="allGames"/>} 
              label="All Games Included"
              checked={addOperatorForm.gameTypes.allGames}
              onChange={handleCheckboxChange}
          />
        </Box>

        <Button fullWidth variant="contained" onClick={() => console.log('Add Operator Clicked')}>
          Add Operator
        </Button>
      </Box>
    </Modal>
  );
}

export default ModalAddOperator;