import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customColors: {
      danger: string;
      success: string;
    };
  }
  interface PaletteOptions {
    customColors: {
      danger: string;
      success: string;
    };
  }
}
