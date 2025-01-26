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
          //border: "0px solid rgba(0, 0, 0, 0.0)",
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
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        },
      },
    },
    // MuiTablePagination: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: "#1F2937", // Background color of the root container
    //       overflow: "hidden", // Prevent overflow issues
    //     },
    //     toolbar: {
    //       display: "flex",
    //       justifyContent: "space-between", // Space out the left and right content
    //       padding: "0 16px", // Optional, if you want to control padding
    //     },
    //     selectLabel: {
    //       textAlign: "left",
    //       color: "#374151", // Text color for "Rows per page"
    //       marginRight: 8, // Small margin for spacing
    //     },
    //     displayedRows: {
    //       color: "#374151", // Text color for "1–10 of 100"
    //       marginLeft: 8, // Small margin for spacing
    //     },  
    //     actions: {
    //       display: "flex",
    //       justifyContent: "flex-end", // Align the pagination actions (previous/next) to the right
    //       alignItems: "center", // Optional, align items vertically
    //       "& .MuiIconButton-root": {
    //         border: "1px solid #ccc", // Border for the buttons
    //         marginX: 1, // Margin between buttons
    //         justifyContent: "flex-end",
    //         backgroundColor: "transparent", // Ensure the background color doesn't hide them
    //         color: "#ffffff", // Ensure icons are visible (white in dark mode)
    //       },
    //     },
    //   },
    // }
  },
});

export default darkTheme;