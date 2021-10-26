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
      // TODO : 지금은 jsonToHcl결과물을 그대로 파일 write해주고 있지만,
      // 이렇게 구현할 시 기존 tf파일에 있는 주석정보들이 다 날라감.
      // 이후 오리지널tf와 새로변환된tf 파일을 비교해 변경점들만 합쳐주는 go모듈 개발되면(js라이브러리화하고) 그거 사용하는 로직 추가 구현하기
      fs.writeFileSync(filePath, this.getPrettyString(resultStr));
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
