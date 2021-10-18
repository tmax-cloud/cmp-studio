import fs from 'fs';
import path from 'path';
import * as WorkspaceTypes from '../common/workspace';
const Converter = require('../../utils/hcljsonconverter');

export class WorkspaceConvertService
  implements WorkspaceTypes.WorkspaceConvertServiceInterface
{
  convertAllHclToJson(
    folderUri: string
  ): WorkspaceTypes.WorkspaceProjectJsonSuccessData {
    let resultArray: WorkspaceTypes.WorkspaceProjectJsonSuccessData = [];
    if (!fs.existsSync(folderUri)) {
      throw new Error(WorkspaceTypes.WorkspaceStatusType.ERROR_NO_PROJECT);
    }
    const files = fs.readdirSync(folderUri);
    files.forEach((file) => {
      const currPath = path.join(folderUri, file);
      if (fs.statSync(currPath).isDirectory()) {
        resultArray = [...resultArray, ...this.convertAllHclToJson(currPath)];
      } else if (path.extname(currPath) === '.tf') {
        const fileBuffer = fs.readFileSync(currPath);
        const result = Converter.HclToJson(fileBuffer, currPath);
        const resultStr = Buffer.from(result[0]?.buffer).toString();
        resultArray.push({
          filePath: currPath,
          fileJson: JSON.parse(resultStr),
        });
      }
    });
    return resultArray;
  }
}
