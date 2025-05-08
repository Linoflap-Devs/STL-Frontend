import React, {useState} from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Modal,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import CloseIcon from '@mui/icons-material/Close';
import { useOperatorsStore } from '../../../store/useOperatorStore';

import { useForm,SubmitHandler } from 'react-hook-form'; // manage form state
import { zodResolver } from '@hookform/resolvers/zod';// validate the form based my zod rules.
import { updateOperatorSchema } from '~/schemas/operatorSchema';
import { z } from 'zod';
import { UpdateOperatorFormData } from '~/types/types';

import Swal from 'sweetalert2'
import ModalConfirmIdentity from './ConfirmIdentityModal';

type UpdateOperatorFormSchema = z.infer<typeof updateOperatorSchema>;
interface UpdateOperatorModalProps {
  open: boolean;
  onClose: () => void;
}

const  ModalUpdateOperator = ({ open, onClose }: UpdateOperatorModalProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "If you go back, all your progress will be lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF7A7A",
      cancelButtonColor: "#808080",
      confirmButtonText: "Yes, go back",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        onClose(); // Close the parent modal
      }
    });
  };
  
  const handleModalConfirm = ()=>{
    // Close Modal
    setModalOpen(false)
    Swal.fire({
      title: "Operator Updated",
      text: "Bet and Win Gaming Corporation has been successfully.",
      icon: "success",
      confirmButtonColor: "#67ABEB"
    });  
  }

  const {
    updateOperatorForm,
    setUpdateOperatorFormData
  } = useOperatorsStore();

    // initialize form w/ useForm
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<UpdateOperatorFormSchema>({
      resolver: zodResolver(updateOperatorSchema),
      defaultValues: {
        status: ' ',
        companyName:' ',
        email: ' ',
        phone: ' ',
        dateOfOperations: ' ',
        areaOfOperations: ' ',
        gameTypes: {
          stlPares: false,
          stlSwer2: false,
          stlSwer3: false,
          stlSwer4: false,
          allGames: false,
        },
        createdBy: ' ',
        latestUpdateBy: ' ',
        creationDate: ' ',
        latestUpdateDate: ' ',
        remarks: ''
      }
    })
    
    const onSubmit: SubmitHandler<UpdateOperatorFormData> = (data: z.infer<typeof updateOperatorSchema>) => {
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
        title: "Update Confirmation",
        text: "Did you enter the correct details?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#67ABEB",
        cancelButtonColor: "#808080",
        confirmButtonText: "Yes, I did",
        cancelButtonText: "No, let me check",
      }).then((result) => {
        if (result.isConfirmed) {
          setModalOpen(true);
          // Swal.fire({
          //   title: "Operator Added",
          //   text: "The operator has beed added successfully.",
          //   icon: "success",
          //   confirmButtonColor: "#67ABEB"
          // });
        }
      });
      setUpdateOperatorFormData(data);
    };
    const onError = (err: any) => {
      console.log('Validation Errors:', err);
      console.log(errors)
    };
    // Debugging
    console.log('updateOperatorForm', updateOperatorForm)
  return (
    <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="view-operator-modal-title"
    aria-describedby="view-operator-modal-description">
      <Box 
        sx={{  
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 848,
            height: 870,
            bgcolor: '#212121',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2 
          }}>
          <Typography id="view-operator-modal-title" variant="h6" component="h2">
            Update Operator
          </Typography>
          <IconButton  aria-label="close" onClick={handleModalCancel} >
            <CloseIcon />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
            }}>
            <FormControl 
              sx={{
                width: 132,
              }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                label="Status"
                {...register('status')}
                error={!!errors.status}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
              {errors.status && (
                <Typography variant="caption" color="error">
                  {errors.status.message}
                </Typography>
              )}
            </FormControl>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Personal Information
          </Typography>
          <Grid container spacing={2}>
            <Grid  size={6}>
              <TextField  
              fullWidth 
              label="Company Name" 
              variant="outlined" 
              // value={companyName}
              {...register('companyName')}
              error={!!errors.companyName}
              helperText={errors.companyName?.message}
              />
            </Grid>
            <Grid  size={6}>
              <TextField  
              fullWidth 
              label="Date of Operations" variant="outlined" 
              // value={dateOfOperations}
              {...register('dateOfOperations')}
              error={!!errors.dateOfOperations}
              helperText={errors.dateOfOperations?.message}
              />
            </Grid>
            <Grid  size={6}>
              <TextField  
              fullWidth 
              label="Email Address" 
              variant="outlined" 
              // value={emailAddress} 
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              />
            </Grid>
            <Grid  size={6}>
              <TextField
              fullWidth
              label="Area of Operations"
              variant="outlined"
              // value={areaOfOperations}
              {...register('areaOfOperations')}
              error={!!errors.areaOfOperations}
              helperText={errors.areaOfOperations?.message}
              multiline
              rows={1}
            />
            </Grid>
            <Grid  size={6}>
              <TextField  
              fullWidth 
              label="Phone Number" 
              variant="outlined"
              // value={phoneNumber}
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" gutterBottom>
            Game Type Included
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
            <FormControlLabel  control={<Checkbox  {...register('gameTypes.stlPares')}/>} label="STL Pares" />
            <FormControlLabel  control={<Checkbox  {...register('gameTypes.stlSwer2')}  />} label="STL Swer2" />
            <FormControlLabel  control={<Checkbox  {...register('gameTypes.stlSwer3')}/>} label="STL Swer3" />
            <FormControlLabel  control={<Checkbox  {...register('gameTypes.stlSwer4')} />}label="STL Swer4" />
            <FormControlLabel  control={<Checkbox  {...register('gameTypes.allGames')} />} label="All Games Included" />
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            History
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <TextField  
              fullWidth 
              label="Created by" 
              variant="outlined" 
              // value={createdBy} 
              // InputProps={{ : true }}
              {...register('createdBy')}
              error={!!errors.createdBy}
              helperText={errors.createdBy?.message}
            />
            <TextField  
              fullWidth 
              label="Latest Update by" 
              variant="outlined" 
              {...register('latestUpdateBy')}
              error={!!errors.latestUpdateBy}
              helperText={errors.latestUpdateBy?.message}
            />
            <TextField
              fullWidth
              label="Creation Date"
              variant="outlined"
              {...register('creationDate')}
              error={!!errors.creationDate}
              helperText={errors.creationDate?.message}
            />
            <TextField
              fullWidth
              label="Latest Update Date"
              variant="outlined"
              {...register('latestUpdateDate')}
              error={!!errors.latestUpdateDate}
              helperText={errors.latestUpdateDate?.message}
            />
          </Box>
          <TextField
            fullWidth
            label="Remarks"
            variant="outlined"
            {...register('remarks')}
            error={!!errors.remarks}
            helperText={errors.remarks?.message}
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant="contained" type="submit">
            Update Operator 
          </Button>
        </form>
        {modalOpen && (
          <ModalConfirmIdentity 
            open={modalOpen} 
            onClose={() => setModalOpen(false)}
            onConfirm={handleModalConfirm}
          />
        )}
      </Box>
  </Modal>
  )
}

export default ModalUpdateOperator