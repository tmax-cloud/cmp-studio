/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { StudioWindow } from './windows/electron-main/window';
import { StorageMainService } from './storage/electron-main/storageMainService';
import { AppConfigurationMainService } from './configs/electron-main/appConfigurationMainService';
import { WorkspaceMainService } from './workspaces/electron-main/workspaceMainService';
import { WindowMainService } from './windows/electron-main/windowMainService';
import { TerraformMainService } from './terraform-command/electron-main/terraformMainService';
import { DialogMainService } from './files/electron-main/DialogMainService';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('studio:ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('studio:ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const studioWindow = new StudioWindow({
    preloadPath: path.join(__dirname, 'preload.js'),
    state: {
      width: 1024,
      height: 700,
    },
  });

  mainWindow = studioWindow.win;

  // TODO : 생성해놓은 service들을 어떻게 관리할 것인지 정하기
  const windowMainService = new WindowMainService(studioWindow);
  const storageMainService = new StorageMainService();
  const configurationMainService = new AppConfigurationMainService();
  const workspaceMainService = new WorkspaceMainService(storageMainService);
  const terraformMainService = new TerraformMainService(workspaceMainService);
  const dialogMainService = new DialogMainService(studioWindow);

  const menuBuilder = new MenuBuilder(studioWindow.win);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
