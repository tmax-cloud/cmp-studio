import { dialog, ipcMain } from 'electron';
import { StudioWindowInterface } from '../../windows/common/windows';

export class DialogMainService {
  constructor(private readonly studioWindow: StudioWindowInterface) {
    this.registerListeners();
  }

  init() {}

  registerListeners() {
    ipcMain.on('studio:openDialog', (event, arg: { openTo: string }) => {
      if (this.studioWindow.win) {
        dialog
          .showOpenDialog(this.studioWindow.win, {
            properties: ['openDirectory'],
          })
          .then((result) => {
            const { openTo } = arg;
            switch (openTo) {
              case 'OPEN_FOLDER':
                event.reply('studio:dirPathToOpen', result);
                break;
              case 'CREATE_NEW_PROJECT':
                event.reply('studio:dirPathToCreateProject', result);
                break;
              default:
                event.reply('studio:dirPathToOpen', result);
                break;
            }
            return result;
          })
          .catch((err) => {
            throw new Error(`[Error] Failed to open dialog : ${err}`);
          });
      }
    });
  }
}
