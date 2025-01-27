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
    fontFamily: '"Inter", sans-serif',
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
            fontSize: 14,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
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
          padding: 10,
          borderBottom: "1.5px solid #374151",
        },
        head: {
          color: '#9CA3AF',
          fontWeight: 'bold',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#374151',
          lineHeight: "1.5rem",
          textTransform: 'uppercase',
          fontWeight: 'bold',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          borderBottom: "0.5px solid #374151",
          '&:hover': {
            backgroundColor: '#374151',
          },
        },
      },
    },    
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#D1D5D8',
          '&.Mui-checked': {
            color: '#e5e7eb',
          },
          '&:hover': {
            backgroundColor: '#374151',
          },
          '& .MuiSvgIcon-root': {
            fill: '#6C7480',
            //backgroundColor: '#374151',
            padding: 0,
            margin: 0,
            fontSize: '21px',
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: "0px",
          borderRadius: "0px",
          boxShadow: "none",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: "0px 5px 5px -2px rgba(0,0,0,0.2)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          color: "#ffffff",
          padding: "16px 55px 16px 12px",  
          borderRadius: "0px",
          fontSize: 14,
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          overflow: "hidden",
          maxHeight: "48px",
        },
        displayedRows: {
          color: "#D1D5D8",
        },  
        actions: {
          "& .MuiIconButton-root": {
            color: "#D1D5D8",
            padding: "0",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
          backgroundImage: "none",
          borderRadius: '6px',
          padding: '25px 8px 27px 8px',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '27px',
          fontWeight: '700',
        },
      },
    }, // input types
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          bgcolor: "#374151",
          color: "#ffffff",
          fontSize: '0.85rem',
          "&:hover fieldset": {
            borderColor: "#D1D5DB",
          },
          "&.Mui-error fieldset": {
            borderColor: "#F05252",
          },
        },
        input: {
          color: "#ffffff",
          padding: "10px 16px",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#374151",
          borderColor: "#D1D5DB",
        },
        icon: {
          color: "#ffffff",
        },
        select: {
          color: "#9CA3AF", // Change to your desired font color
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "::placeholder": {
            color: "#9CA3AF", // Customize the placeholder color here
          },
        },
      },
    },    
    MuiFormHelperText : {
      styleOverrides: {
        root: {
          fontSize: '0.80rem',
          marginLeft: '0px',
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          textAlign: "left",
          marginBottom: "0.3rem",
          fontSize: "0.93rem",
        },
      },
    },
    
  },
});

export default darkTheme;