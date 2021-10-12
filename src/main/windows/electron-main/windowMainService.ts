import { ipcMain } from 'electron';
import { StudioWindowInterface } from '../common/windows';
export class WindowMainService {
  constructor(private readonly studioWindow: StudioWindowInterface) {
    this.registerListeners();
  }

  private registerListeners() {
    ipcMain.on(
      'studio:setWindowSize',
      (event, arg: { width: number; height: number }) => {
        this.studioWindow.setWindowSize(arg.width || 100, arg.height || 100);
      }
    );
    ipcMain.on('studio:maximizeWindowSize', (event, arg) => {
      this.studioWindow.maximizeWindowSize();
    });
  }
}
