import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  shell,
} from 'electron';
import { getAssetPath } from '../../base/common/pathUtils';
import {
  WindowCreationOptions,
  WindowMinimumSize,
  StudioWindowInterface,
} from '../common/windows';
import { resolveHtmlPath } from '../../util';

export class StudioWindow implements StudioWindowInterface {
  public id: number;

  public win: BrowserWindow;

  constructor(config: WindowCreationOptions) {
    const options: BrowserWindowConstructorOptions = {
      width: config.state.width,
      height: config.state.height,
      minWidth: WindowMinimumSize.WIDTH,
      minHeight: WindowMinimumSize.HEIGHT,
      show: false,
      icon: getAssetPath('icon.png'),
      title: 'IaC Studio',
      webPreferences: {
        preload: config.preloadPath,
        enableWebSQL: false,
        spellcheck: false,
        nativeWindowOpen: true,
      },
    };

    this.win = new BrowserWindow(options);
    this.id = this.win.id;

    this.win.setMenuBarVisibility(false);
    this.win.loadURL(resolveHtmlPath('index.html'));
    this.win.webContents.openDevTools();

    // Eventing
    this.registerListeners();
  }

  private registerListeners(): void {
    this.win.webContents.on('did-finish-load', () => {
      if (!this.win) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        this.win.minimize();
      } else {
        this.win.show();
        this.win.focus();
      }
    });

    this.win.on('closed', () => {
      this.win = null!;
    });

    this.win.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });
  }

  setWindowSize(width: number, height: number): void {
    if (this.win) {
      this.win.setSize(width, height);
    }
  }

  close(): void {
    if (this.win) {
      this.win.close();
    }
  }
}
