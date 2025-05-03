import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Modal,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2'
import AuditLogModal from './ViewSummaryModal';
interface ViewOperatorModalProps {
  open: boolean;
  onClose: () => void;
  operatorData?: {
    companyName: string;
    dateOfOperations: string;
    emailAddress: string;
    areaOfOperations: string;
    phoneNumber: string;
    stlPares: boolean;
    stlSwer2: boolean;
    stlSwer3: boolean;
    stlSwer4: boolean;
    allGamesIncluded: boolean;
    createdBy: string;
    creationDate: string;
    latestUpdateBy: string;
    latestUpdateDate: string;
    status: 'Active' | 'Inactive';
  };
}


function ModalViewOperator({ open, onClose, operatorData }: ViewOperatorModalProps) {
  const [viewModalOpen, setViewModalOpen] = useState(true)
  const [auditModalOpen, setAuditModalOpen] = useState(false)

   // Dummy audit logs (replace with actual data later)
  const dummyAuditLogs = [
    {
      editedBy: 'Admin1',
      timeEdited: '2024-05-01 12:34',
      previousValue: 'Inactive',
      newValue: 'Active',
      remarks: 'Re-activated account',
    },
    {
      editedBy: 'Admin2',
      timeEdited: '2024-05-02 15:12',
      previousValue: 'stlPares: false',
      newValue: 'stlPares: true',
      remarks: 'Enabled STL Pares',
    },
  ];

  const {
    companyName,
    dateOfOperations,
    emailAddress,
    areaOfOperations,
    phoneNumber,
    stlPares,
    stlSwer2,
    stlSwer3,
    stlSwer4,
    allGamesIncluded,
    createdBy,
    creationDate,
    latestUpdateBy,
    latestUpdateDate,
    status,
  } = operatorData || {};

  return (
  <>
    {viewModalOpen && 
        <Modal
          open={open}
          onClose={onClose}
          aria-labelledby="view-operator-modal-title"
          aria-describedby="view-operator-modal-description"
        >
          <Box 
            sx={{  
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 848,
                height: 684,
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
                View Operator
              </Typography>
              <IconButton aria-label="close" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
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
                  value={status}
                  disabled
                  // onChange={(event) => handleInputChange('status', event.target.value)} // Add your change handler
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Button 
                  variant="contained" 
                  onClick={() => console.log('Update Clicked')}
                  disabled
              >
                Update
              </Button>
            </Box>
    
            <Typography variant="subtitle1" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid  size={6}>
                <TextField disabled fullWidth label="Company Name" variant="outlined" value={companyName} InputProps={{ readOnly: true }}/>
              </Grid>
              <Grid  size={6}>
                <TextField disabled fullWidth label="Date of Operations" variant="outlined" value={dateOfOperations} InputProps={{ readOnly: true }} />
              </Grid>
              <Grid  size={6}>
                <TextField disabled fullWidth label="Email Address" variant="outlined" value={emailAddress} InputProps={{ readOnly: true }} />
              </Grid>
              <Grid  size={6}>
                <TextField
                fullWidth
                label="Area of Operations"
                variant="outlined"
                value={areaOfOperations}
                InputProps={{ readOnly: true }}
                multiline
                rows={1}
                disabled
              />
              </Grid>
              <Grid  size={6}>
                <TextField disabled fullWidth label="Phone Number" variant="outlined" value={phoneNumber} InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>
    
            <Typography variant="subtitle1" gutterBottom>
              Game Type Included
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
              <FormControlLabel disabled control={<Checkbox checked={stlPares} readOnly />} label="STL Pares" />
              <FormControlLabel disabled control={<Checkbox checked={stlSwer2} readOnly />} label="STL Swer2" />
              <FormControlLabel disabled control={<Checkbox checked={stlSwer3} readOnly />} label="STL Swer3" />
              <FormControlLabel disabled control={<Checkbox checked={stlSwer4} readOnly />} label="STL Swer4" />
              <FormControlLabel disabled control={<Checkbox checked={allGamesIncluded} readOnly />} label="All Games Included" />
            </Box>
    
            <Typography variant="subtitle1" gutterBottom>
              History
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
              <TextField disabled fullWidth label="Created by" variant="outlined" value={createdBy} InputProps={{ readOnly: true }} />
              <TextField disabled fullWidth label="Latest Update by" variant="outlined" value={latestUpdateBy} InputProps={{ readOnly: true }} />
              <TextField
                disabled
                fullWidth
                label="Creation Date"
                variant="outlined"
                value={creationDate}
                InputProps={{ readOnly: true }}
              />
              <TextField
                disabled
                fullWidth
                label="Latest Update Date"
                variant="outlined"
                value={latestUpdateDate}
                InputProps={{ readOnly: true }}
              />
            </Box>
    
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'start' }}>
              <Typography
                variant="body2"
                component="a"
                onClick={() => {
                  setAuditModalOpen(true)
                  setViewModalOpen(false)
                }}
                sx={{ 
                  cursor: 'pointer', 
                  color: 'primary.main', 
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'none',
                  },
                }}
              >
                View Summary
              </Typography>
            </Box>
          </Box>
        </Modal>
    }
    { auditModalOpen &&
      <AuditLogModal
        open={auditModalOpen}
        onClose={()=> setAuditModalOpen(false)}
        title="LiFlap Gaming Industries"
        auditLogs={dummyAuditLogs}
      />
    }
  </>
  );
}

export default ModalViewOperator;