import { PaletteColor } from '@mui/material';

declare module '@mui/material/styles' {
  export interface Palette {
    toolbar: {
      button: string;
    };
  }
  export interface PaletteOptions {
    toolbar: {
      button: string;
    };
  }
}
