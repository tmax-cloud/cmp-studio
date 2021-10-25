import fs from 'fs';
import path from 'path';
import * as FileUtils from '../../base/common/fileUtils';
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
        const resultStr = Buffer.from(result[0]).toString();
        resultArray.push({
          filePath: currPath,
          fileJson: JSON.parse(resultStr),
        });
      }
    });
    return resultArray;
  }

  convertAllJsonToHcl(objList: WorkspaceTypes.TerraformFileJsonMeta[]) {
    objList.forEach((obj) => {
      const { filePath, fileJson } = obj;
      const buf = Buffer.from(JSON.stringify(fileJson));
      const result = Converter.JsonToHcl(buf);
      const resultStr = Buffer.from(result).toString();
      if (!fs.existsSync(FileUtils.getDirName(filePath))) {
        fs.mkdirSync(FileUtils.getDirName(filePath), { recursive: true });
      }
      fs.writeFileSync(filePath, resultStr);
    });
    console.log('[INFO] File Export Finished.');
  }
}
