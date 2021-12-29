import { PaletteColor } from '@mui/material';

declare module '@mui/material/styles' {
  export interface Palette {
    toolbar: {
      button: string;
      butonClicked: string;
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
      buttonClicked: string;
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
