import { dialog, ipcMain } from 'electron';
import { StudioWindowInterface } from '../../windows/common/windows';

export class DialogMainService {
  constructor(private readonly studioWindow: StudioWindowInterface) {
    this.registerListeners();
  }

  init() {}

  registerListeners() {
    ipcMain.on('studio:openDialog', (event, arg) => {
      if (this.studioWindow.win) {
        dialog
          .showOpenDialog(this.studioWindow.win, {
            properties: ['openDirectory'],
          })
          .then((result) => {
            event.reply('studio:dirSelectionResponse', result);
            return result;
          })
          .catch((err) => {
            throw new Error(`[Error] Failed to open dialog : ${err}`);
          });
      }
    });
  }
}
