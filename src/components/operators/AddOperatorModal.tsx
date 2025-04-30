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

interface AddOperatorModalProps {
  open: boolean;
  onClose: () => void;
}

const ModalAddOperator = ({ open, onClose }: AddOperatorModalProps) => {
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
              <TextField fullWidth label="Company Name" variant="outlined" margin="normal" />
              <TextField fullWidth label="Email Address" variant="outlined" margin="normal" />
              <TextField fullWidth label="Phone Number" variant="outlined" margin="normal" />
            </Grid>
            <Grid size={6}>
              <TextField fullWidth label="Date of Operations" variant="outlined" margin="normal" />
              <TextField fullWidth label="Area of Operations" variant="outlined" margin="normal" multiline rows={3} />
            </Grid>
        </Grid>
        <Typography variant="subtitle1" gutterBottom>
          Game Type Included
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <FormControlLabel control={<Checkbox />} label="STL Pares" />
          <FormControlLabel control={<Checkbox />} label="STL Swer2" />
          <FormControlLabel control={<Checkbox />} label="STL Swer3" />
          <FormControlLabel control={<Checkbox />} label="STL Swer4" />
          <FormControlLabel control={<Checkbox />} label="All Games Included" />
        </Box>

        <Button fullWidth variant="contained" onClick={() => console.log('Add Operator Clicked')}>
          Add Operator
        </Button>
      </Box>
    </Modal>
  );
}

export default ModalAddOperator;