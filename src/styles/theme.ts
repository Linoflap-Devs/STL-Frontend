import { createTheme } from "@mui/material/styles";
import {Montserrat} from "@next/font/google"

// Load Montserrat font properly
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"], // Load Regular (400) and Bold (700)
  display: "swap",
});
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#212121",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#b0b0b0",
    },
  },
  typography: {
    fontFamily:  montserrat.style.fontFamily,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          color: "#ffffff", 
          borderRadius: 5,
          backgroundColor: "#CCA1FD",
          "&:hover": {
            backgroundColor: "#A070D3",
          // backgroundColor: "#65308B",
   },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#282828",
          borderRadius: 5,
          borderCollapse: "collapse",
          padding: 1,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "#D1D5D8",
          fontSize: "13px",
          padding: "auto",
          borderBottom: "1px solid #3F3F3F",
        },
        head: {
          color: "#FFFFFF",
          fontWeight: "bold",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#3F3F3F",
          lineHeight: "1.5rem",
          textTransform: "uppercase",
          fontWeight: "bold",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          borderBottom: "0.5px solid #282828",
          "&:hover": {
            backgroundColor: "#3F3F3F",
          },
          "&.Mui-selected": {
            backgroundColor: "#616161",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#D1D5D8",
          "&.Mui-checked": {
            color: "#e5e7eb",
          },
          "&:hover": {
            backgroundColor: "#3F3F3F",
          },
          "& .MuiSvgIcon-root": {
            fill: "#6C7480",
            padding: 0,
            margin: 0,
            fontSize: "21px",
            backgroundColor: "#3F3F3F !important",
            borderRadius: "5px",
            height: "20px",
            width: "20px",
          },
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
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
          backgroundImage: "none",
          borderRadius: "6px",
          padding: "25px 8px 27px 8px",
          backgroundColor: '#181A1B',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          height: "auto",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "25px",
          fontWeight: "700",
          marginBottom: "-0.3rem",
        },
      },
    },

  },
});

export const buttonStyles = {
  paddingX: 3.9,
  paddingY: 0.9,
  textTransform: "none",
  fontSize: 12,
  borderRadius: "8px",
  backgroundColor: "#CCA1FD",
  width: "auto",
  color: '#181A1B',
};

export const deleteStyles = {
  paddingX: 3,
  paddingY: 0.9,
  textTransform: "none",
  fontSize: 12,
  borderRadius: "8px",
  backgroundColor: "#F05252",
  width: "auto",
  marginRight: "0.9rem",
  '&:hover': {
    backgroundColor: '#D43D38',
  }
};

export const inputStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#D1D5DB", 
      padding: "14px 40px 10px 14px" },
    "&.Mui-error fieldset": { borderColor: "#F05252" },
  },
};

export const selectStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { 
      borderColor: "#D1D5DB !important",
      padding: "14px 40px 10px 14px",
    },

  },
};

export const inputErrorStyles = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  color: "#F05252",
  marginTop: "4px",
  fontSize: "12px",
};

export const filterStyles = {
  marginTop: 0,
  marginBottom: 0,
  padding: "4px",
  backgroundColor: "none",
  "& .MuiFilledInput-root": {
    paddingTop: "8px",
    paddingBottom: "8px",
    backgroundColor: "transparent  !important",
  },
  "& .MuiInputBase-input": {
    padding: 0,
  },
};

export const cardDashboardStyles = {
  height: "auto",
  border: "1px solid",
  borderColor: "#171717",
  backgroundColor: "#171717",
  borderRadius: "8px",
  paddingY: "1.9rem",
  paddingX: "1rem",
  margin: "0 auto",
};

export const buttonDrawStyles = {
  width: 'auto',
  height: 'auto',
  border: '1px solid',
  borderColor: '#575757',
  borderRadius: '8px',
  py: 1.5,
  paddingLeft: '0.8rem',
  paddingRight: '3.7rem',
};

export const buttonNumberStyles = {
  width: "100%", // Takes the full width of the parent container
  height: "auto",
  border: "1px solid",
  borderColor: "#303030",
  borderRadius: "8px",
  mt: "0.5rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minWidth: 0, // Prevents overflow issues
};

export default darkTheme;
      