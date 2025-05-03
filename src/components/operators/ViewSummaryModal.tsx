import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Search as SearchIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { useState } from 'react';

interface AuditLog {
  editedBy: string;
  timeEdited: string;
  previousValue: string;
  newValue: string;
  remarks: string;
}

interface AuditLogModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  auditLogs: AuditLog[];
}

const ModalAuditLog: React.FC<AuditLogModalProps> = ({
  open,
  onClose,
  title,
  auditLogs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page on search
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const filteredAuditLogs = auditLogs.filter((log) =>
    Object.values(log).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filteredAuditLogs.length - page * rowsPerPage);
    
  const totalPages = Math.ceil(filteredAuditLogs.length / rowsPerPage);
  const startIndex = page * rowsPerPage + 1;
  const endIndex = Math.min((page + 1) * rowsPerPage, filteredAuditLogs.length);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <Typography>Operator</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleChangeSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2, mt: 2 }}
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="audit log table">
            <TableHead>
              <TableRow>
                <TableCell>Edited By</TableCell>
                <TableCell>Time Edited</TableCell>
                <TableCell>Previous Value</TableCell>
                <TableCell>New Value</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredAuditLogs.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredAuditLogs
              ).map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.editedBy}
                  </TableCell>
                  <TableCell>{row.timeEdited}</TableCell>
                  <TableCell>{row.previousValue}</TableCell>
                  <TableCell>{row.newValue}</TableCell>
                  <TableCell>{row.remarks}</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent:'flex-end', 
          mt: 2, 
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="body2">Rows per page:</Typography>
          <FormControl sx={{ minWidth: 80 }} size="small">
            <Select
              value={rowsPerPage.toString()}
              onChange={handleChangeRowsPerPage}
            >
              {[5, 10, 25].map((count) => (
                <MenuItem key={count} value={count.toString()}>
                  {count}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="body2">
            {filteredAuditLogs.length > 0 
              ? `${startIndex}-${endIndex} of ${filteredAuditLogs.length}`
              : '0-0 of 0'}
          </Typography>
          
          <IconButton
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0}
            aria-label="previous page"
          >
            <NavigateBeforeIcon />
          </IconButton>
          
          <IconButton
            onClick={() => handleChangePage(page + 1)}
            disabled={page >= totalPages - 1}
            aria-label="next page"
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAuditLog;