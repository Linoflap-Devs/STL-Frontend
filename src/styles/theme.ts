import { createTheme } from "@mui/material/styles";

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
    fontFamily: `'Montserrat', sans-serif`,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          color: "#181A1B",
          borderRadius: 5,
          backgroundColor: "#67ABEB",
          "&:hover": {
            backgroundColor: "#559AD6",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            border: "none",
            borderRadius: 5,
            backgroundColor: "#282828",
            transition: "background-color 0.3s ease, border-color 0.3s ease",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FFFFFF",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FFFFFF",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3F3F3F",
            transition: "border-color 0.3s ease",
          },
          "& .MuiOutlinedInput-input": {
            fontSize: 14,
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d32f2f", // Default MUI error color (red)
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          backgroundColor: "#171717",
          padding: '5px 12px',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#171717",
          borderRadius: 5,
          borderCollapse: "collapse",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "#D1D5D8",
          fontSize: "13px",
          borderBottom: "1px solid #3F3F3F",
          //padding: '12px 16px !important',
        },
        head: {
          padding: "13px",
          color: "#FFFFFF",
          fontWeight: "bold",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#2F2F2F",
          lineHeight: "1.5rem",
          textTransform: "uppercase",
          fontWeight: "bold",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          borderBottom: "0.5px solid #2F2F2F",
          "&:hover": {
            backgroundColor: "#212121",
          },
          "&.Mui-selected": {
            backgroundColor: "#2F2F2F",
          },
        },
      },
    },
    // checkbox
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
        root: {
          borderRadius: "0px",
        },
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
          padding: "17px 55px 17px 12px",
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
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
          backgroundImage: "none",
          borderRadius: "6px",
          padding: "25px 8px 27px 8px",
          backgroundColor: '#212121',
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
    MuiInput: {
      styleOverrides: {
        root: {
          fontSize: "0.85rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '15px',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "0.80rem",
        },
        input: {
          "::placeholder": {
            color: "#9CA3AF",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "0.80rem",
          marginBottom: "0px !important",
          marginLeft: "0px",
          color: '#FF7A7A !important', // Custom color for error text
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          color: "#ffffff",
          //padding: "10px 16px",
          width: "100% !important",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#2F2F2F !important", // Custom background color
          color: "#fff",
          fontSize: "12px",
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
    input: {
      padding: "12px 16px !important",
    },
    "& fieldset": {
      borderColor: "#D1D5DB",
       padding: "10px 16px !important",
    },
    "&.Mui-error fieldset": { borderColor: "#FF7A7A" },
  },
};

export const selectStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#D1D5DB",
      padding: "14px 40px 10px 14px",
    },

  },
};

export const inputErrorStyles = {
  display: "flex",
  color: "#FF7A7A",
  fontSize: "13px",
  paddingTop: "0.3rem",
};

export const filterStyles = {
  marginTop: 0,
  marginBottom: 0,
  padding: "4px",
  fontSize: "12px",
  backgroundColor: "none",
  "& .MuiFilledInput-root": {
    paddingTop: "1px",
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
  backgroundColor: "transparent",
  border: '1px solid #303030',
  borderRadius: "8px",
  textAlign: "center",
  padding: "0.1rem 0",
};

export const skeletonRowStyles = {
  display: "flex",
  flexWrap: "wrap",
  gap: 2,
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  mt: 2,
};

export const buttonUpdateStyles = {
  backgroundColor: "#67ABEB",
  textTransform: "none",
  borderRadius: "8px",
  color: "#181A1B",
};

export default darkTheme;
