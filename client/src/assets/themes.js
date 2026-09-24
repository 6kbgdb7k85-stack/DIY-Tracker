import { createTheme } from "@mui/material/styles";

const woodThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#3b2921",
    },
    secondary: {
      main: "#b8895b",
    },
    background: {
      default: "#f5efe6",
      paper: "#e9ddcd",
    },
    text: {
      primary: "#292725",
    },
  },
};

const metalThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#252a2d",
    },
    secondary: {
      main: "#d96b27",
    },
    background: {
      default: "#f1f0ec",
      paper: "#d9dcde",
    },
    text: {
      primary: "#17191a",
    },
  },
};

export const woodTheme = createTheme(woodThemeOptions);
export const metalTheme = createTheme(metalThemeOptions);
