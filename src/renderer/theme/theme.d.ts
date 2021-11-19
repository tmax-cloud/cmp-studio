import { PaletteColor } from '@mui/material';

declare module '@mui/material/styles' {
  export interface Palette {
    toolbar: {
      button: string;
    };
    object: {
      accordion: string;
      accordionHeader: {
        primary: string;
        secondary: string;
      };
    };
  }
  export interface PaletteOptions {
    toolbar: {
      button: string;
    };
    object: {
      accordion: string;
      accordionHeader: {
        primary: string;
        secondary: string;
      };
    };
  }
}
