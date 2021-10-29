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

      if (fs.existsSync(filePath)) {
        // MEMO : 원본파일이 있는 경우 원본과 저장할 파일 내용 비교 후 합침
        const originalTf = FileUtils.readFileString(filePath);
        const prettyNewTf = this.getPrettyString(resultStr);
        const finalTf = Converter.HclToHcl(originalTf, prettyNewTf);
        fs.writeFileSync(filePath, finalTf);
      } else {
        // MEMO : 원본파일이 없는 경우 그냥 새 파일 생성
        fs.writeFileSync(filePath, this.getPrettyString(resultStr));
      }
    });
    console.log('[INFO] File Export Finished.');
  }

  getPrettyString(str: string): string {
    return str
      .replace(/"\${/g, '')
      .replace(/}"/g, '')
      .replace(/\\"/g, '"')
      .replace(/@@@{/g, '${')
      .replace(/}@@@/g, '}')
      .replace(
        /\\n/g,
        `
    `
      );
  }
}
