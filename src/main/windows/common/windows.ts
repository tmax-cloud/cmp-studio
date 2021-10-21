import { BrowserWindow } from 'electron';

export interface StudioWindowInterface {
  readonly id: number;
  readonly win: BrowserWindow | null /* `null` after being disposed */;
  setWindowSize(width: number, height: number): void;
  maximizeWindowSize(): void;
  close(): void;
}

export type WindowSetSizeArgs = {
  width: number;
  height: number;
};

export const WindowMinimumSize = {
  WIDTH: 400,
  WIDTH_WITH_VERTICAL_PANEL: 600,
  HEIGHT: 270,
};

export type WindowCreationOptions = {
  preloadPath: string;
  state: WindowState;
};

export type WindowState = {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  display?: number;
};
