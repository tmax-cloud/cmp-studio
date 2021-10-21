import { ipcMain } from 'electron';
import { StudioWindowInterface, WindowSetSizeArgs } from '../common/windows';
export class WindowMainService {
  constructor(private readonly studioWindow: StudioWindowInterface) {
    this.registerListeners();
  }

  private registerListeners() {
    ipcMain.on('studio:setWindowSize', (event, arg: WindowSetSizeArgs) => {
      this.studioWindow.setWindowSize(arg.width || 100, arg.height || 100);
    });
    ipcMain.on('studio:maximizeWindowSize', (event, arg) => {
      this.studioWindow.maximizeWindowSize();
    });
    ipcMain.on('studio:closeWindow', (event, arg) => {
      this.studioWindow.close();
    });
  }
}
