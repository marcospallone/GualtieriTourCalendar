// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fff', 
    },
    secondary: {
      main: '#dc004e', 
    },
  },
  spacing: (factor:number) => `${factor / 16}rem`
});

export default theme;
