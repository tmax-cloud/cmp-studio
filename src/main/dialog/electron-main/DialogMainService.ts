import { dialog, ipcMain } from 'electron';
import { StudioWindowInterface } from '../../windows/common/windows';
import { OpenType, OpenDialogArgs } from '../common/dialog';

export class DialogMainService {
  constructor(private readonly studioWindow: StudioWindowInterface) {
    this.registerListeners();
  }

  init() {}

  registerListeners() {
    ipcMain.on('studio:openDialog', (event, arg: OpenDialogArgs) => {
      if (this.studioWindow.win) {
        const { openTo, properties } = arg;
        dialog
          .showOpenDialog(this.studioWindow.win, {
            properties,
          })
          .then((result) => {
            switch (openTo) {
              case OpenType.OPEN_FOLDER:
                event.reply('studio:dirPathToOpen', result);
                break;
              case OpenType.CREATE_NEW_PROJECT:
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
