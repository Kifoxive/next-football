import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    text: {
      primary: "#000000",
    },
  },
  typography: {
    allVariants: {
      color: "#000000",
    },
  },
  // components: {
  //   MuiSvgIcon: {
  //     styleOverrides: {
  //       root: {
  //         color: "#777",
  //       },
  //     },
  //   },
  // },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "#ffffff",
    },
  },
  typography: {
    allVariants: {
      color: "#ffffff",
    },
  },
});
