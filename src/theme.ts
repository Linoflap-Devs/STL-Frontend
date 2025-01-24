// src/styles/theme.ts
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#252526',
      paper: '#1F2937',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Monserrat", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          color: '#ffffff',
          borderRadius: 5,
          backgroundColor: '#3f51b5',
          '&:hover': {
            backgroundColor: '#303f9f',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            //padding: '7px 12px',
            border: 'none',
            borderRadius: 5,
            backgroundColor: '#374151',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#475569',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#475569',
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#374151',
            transition: 'border-color 0.3s ease',
          },
          '& .MuiOutlinedInput-input': {
            //padding: '0.5px 0',
            fontSize: 14,
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#1F2937',
          borderRadius: 5,
          borderCollapse: 'collapse',
          padding: 1,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#D1D5D8',
          fontSize: '12px',
          padding: 12,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#374151',
          color: '#D1D5D8',
          lineHeight: "2rem",
          textTransform: 'uppercase',
          fontWeight: 'bold',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          color: '#D1D5D8',
          borderBottom: "1px solid #4B5563",
          '&:hover': {
            backgroundColor: '#374151',
          },
        },
      },
    },
  },
});

export default darkTheme;