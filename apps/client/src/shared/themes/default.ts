import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'rgb(20, 24, 28)',
      paper: 'rgb(44, 52, 64)', // dialogs, cards, menus, etc.
    },
    text: {
      primary: 'rgb(157, 186, 201)',
      secondary: 'rgb(255, 255, 255)',
    },
    customColors: {
      like: 'rgb(34, 197, 94)',
      dislike: 'rgb(239, 68, 68)',
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
});

export default theme;
