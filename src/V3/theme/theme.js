import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Inter !important",
          textTransform: "capitalize",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          fontFamily: "Inter !important",
        },
        outlined: {
          fontFamily: "Inter !important",
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: { fontFamily: "Inter !important", fontweight: "400" },
      },
    },
  },
});

export default theme;
