import { createTheme } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[400],
    },
    secondary: {
      main: "#673AB7",
    },
  },
});

export default theme;
