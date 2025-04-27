import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Modal,
  Paper,
  MenuItem,
  IconButton,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addWinningCombination } from '~/utils/api/winningcombinations';

const GameCombinationModal = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    gameType: '',
    combinationOne: '',
    combinationTwo: '',
    combinationThree: '',
    combinationFour: '',
    gameSchedule: '1'
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    const result = await addWinningCombination(formData);
    console.log(result)
    handleClose();
  };

  const gameTypes = [
    { id: 1, name: 'STL Pares First Draw' },
    { id: 2, name: 'STL Pares Second Draw' },
    { id: 3, name: 'STL Pares Third Draw' },
    { id: 4, name: 'STL Swer2 First Draw' },
    { id: 5, name: 'STL Swer2 Second Draw' },
    { id: 6, name: 'STL Swer2 Third Draw' },
    { id: 7, name: 'STL Swer3 First Draw' },
    { id: 8, name: 'STL Swer3 Second Draw' },
    { id: 9, name: 'STL Swer3 Third Draw' },
    { id: 10, name: 'STL Swer4 First Draw' },
    { id: 11, name: 'STL Swer4 Second Draw' },
    { id: 12, name: 'STL Swer4 Third Draw' },
  ];

  return (
    <div>
      <Button 
        variant="contained" 
        onClick={handleOpen}
        sx={{ 
          backgroundColor: '#64b5f6', 
          '&:hover': { backgroundColor: '#42a5f5' }
        }}
      >
        Add Game Combination
      </Button>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          maxWidth: 500,
          bgcolor: '#212121',
          border: '1px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography id="modal-title" variant="h6" component="h2">
              Add Game Combination
            </Typography>
            <IconButton 
              onClick={handleClose} 
              sx={{ color: 'white' }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              select
              margin="normal"
              required
              fullWidth
              id="gameType"
              label="Game Type"
              name="gameType"
              value={formData.gameType}
              onChange={handleChange}
              sx={{
                mb: 2,
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                }
              }}
            >
              {gameTypes.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              margin="normal"
              required
              fullWidth
              id="combinationOne"
              label="Combination One"
              name="combinationOne"
              value={formData.combinationOne}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                }
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="combinationTwo"
              label="Combination Two"
              name="combinationTwo"
              value={formData.combinationTwo}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                }
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="combinationThree"
              label="Combination Three"
              name="combinationThree"
              value={formData.combinationThree}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                }
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="combinationFour"
              label="Combination Four"
              name="combinationFour"
              value={formData.combinationFour}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                }
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                backgroundColor: '#64b5f6', 
                '&:hover': { backgroundColor: '#42a5f5' } 
              }}
            >
              Add Combination
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default GameCombinationModal;