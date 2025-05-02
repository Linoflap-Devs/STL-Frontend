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
  FormControl
} from '@mui/material';
import Grid from '@mui/material/Grid2'
import CloseIcon from '@mui/icons-material/Close';
import { useOperatorsStore } from '../../../store/useOperatorStore';

import { useForm,SubmitHandler } from 'react-hook-form'; // manage form state
import { zodResolver } from '@hookform/resolvers/zod';// validate the form based my zod rules.
import { operatorSchema } from '~/schemas/operatorSchema';
import { z } from 'zod';
import { AddOperatorFormData } from '~/types/types';

import Swal from 'sweetalert2'
type OperatorFormSchema = z.infer<typeof operatorSchema>;
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
  // const handleChange= (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value} = e.target;
  //   setOperatorFormData({ [name]: value})
  // }
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAllGameTypes({ [name]: checked });
  }


  // initialize form w/ useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OperatorFormSchema>({
    resolver: zodResolver(operatorSchema),
    defaultValues: {
      companyName: '',
      email: '',
      phone: '',
      dateOfOperations: '',
      areaOfOperations: '',
      gameTypes: {
        stlPares: false,
        stlSwer2: false,
        stlSwer3: false,
        stlSwer4: false,
        allGames: false
      }
    }
  })
  
  const onSubmit: SubmitHandler<AddOperatorFormData> = (data: z.infer<typeof operatorSchema>) => {
    console.log("Validated Data: ", data);
    // create POST request
    // axios.post('/my-api-endpoint', data)
    //   .then(response => {
    //     console.log('Operator added:', response.data);
    //     onClose(); // close modal on success
    //   })
    //   .catch(error => {
    //     console.error('Error adding operator:', error);
    //   });

    // Sync validated data to Zustand store
    Swal.fire({
      title: "Add Confirmation",
      text: "Did you enter the correct details?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#67ABEB",
      cancelButtonColor: "#808080",
      confirmButtonText: "Yes, I did",
      cancelButtonText: "No, let me check",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Operator Added",
          text: "The operator has beed added successfully.",
          icon: "success",
          confirmButtonColor: "#67ABEB"
        });
      }
    });
    setOperatorFormData(data);
  };
  const onError = (err: any) => {
    console.log('Validation Errors:', err);
    console.log(errors)
  };
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
        <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Grid container spacing={2} mb={1}>
            <Grid size={6}>
              <TextField 
                  fullWidth 
                  label="Company Name" 
                  // name="companyName"
                  variant="outlined"
                  margin="normal"
                  // value={ addOperatorForm.companyName} 
                  // onChange={handleChange}
                  {...register('companyName')}
                  error={!!errors.companyName}
                  helperText={errors.companyName?.message}
                  />
              <TextField 
                  fullWidth 
                  label="Email Address"
                  // name="email"
                  variant="outlined" 
                  margin="normal" 
                  // value={addOperatorForm.email}
                  // onChange={handleChange}
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
              />
              <TextField 
                  fullWidth 
                  label="Phone Number" 
                  // name="phone"
                  variant="outlined" 
                  margin="normal" 
                  // value={addOperatorForm.phone}
                  // onChange={handleChange}
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
              />
            </Grid>
            <Grid size={6}>
              <TextField 
                  fullWidth 
                  label="Date of Operations"
                  // name="dateOfOperations"
                  variant="outlined" 
                  margin="normal" 
                  // value={addOperatorForm.dateOfOperations}
                  // onChange={handleChange}
                  {...register('dateOfOperations')}
                  error={!!errors.dateOfOperations}
                  helperText={errors.dateOfOperations?.message}
              />
              <TextField 
                  fullWidth 
                  label="Area of Operations"
                  // name="areaOfOperations" 
                  variant="outlined" 
                  margin="normal"
                  multiline rows={3} 
                  // value={addOperatorForm.areaOfOperations}
                  // onChange={handleChange}
                  {...register('areaOfOperations')}
                  error={!!errors.areaOfOperations}
                  helperText={errors.areaOfOperations?.message}
              />
            </Grid>
        </Grid>
        <Typography variant="subtitle1" gutterBottom>
          Game Type Included
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <FormControlLabel 
              control={<Checkbox {...register('gameTypes.stlPares')}/>} 
              label="STL Pares"
              // checked={addOperatorForm.gameTypes.stlPares}
              // onChange={handleCheckboxChange}
          />
          <FormControlLabel 
              control={<Checkbox {...register('gameTypes.stlSwer2')}/>} 
              label="STL Swer2" 
              // checked={addOperatorForm.gameTypes.stlSwer2}
              // onChange={handleCheckboxChange}
          />
          <FormControlLabel 
              control={<Checkbox {...register('gameTypes.stlSwer3')}/>} 
              label="STL Swer3"
              // checked={addOperatorForm.gameTypes.stlSwer3}
              // onChange={handleCheckboxChange}
          />
          <FormControlLabel 
              control={<Checkbox {...register('gameTypes.stlSwer4')} />} 
              label="STL Swer4"
              // checked={addOperatorForm.gameTypes.stlSwer4}
              // onChange={handleCheckboxChange}
          />
          <FormControlLabel 
              control={<Checkbox {...register('gameTypes.allGames')}/>} 
              label="All Games Included"
              // checked={addOperatorForm.gameTypes.allGames}
              // onChange={handleCheckboxChange}
          />
        </Box>
        <Button fullWidth variant="contained" type="submit">
          Add Operator
        </Button>
        </form>
      </Box>
    </Modal>

  );
}

export default ModalAddOperator;