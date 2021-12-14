import fs from 'fs';
import path from 'path';
import * as FileUtils from '../../base/common/fileUtils';
import * as WorkspaceTypes from '../common/workspace';
import { WorkspaceManagementService } from './workspaceManagementService';
import {
  getObjectDataType,
  TerraformType,
  DeleteTypeInfo,
} from '../common/workspace';
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

  convertAllJsonToHcl(
    objList: WorkspaceTypes.TerraformFileJsonMeta[],
    typeMap: any,
    workspaceUid: string,
    isAllSave: boolean,
    deleteTypeInfo: DeleteTypeInfo
  ) {
    const workspaceManagementService = new WorkspaceManagementService();
    const folderUri = workspaceManagementService.getFolderUriByWorkspaceId(
      workspaceUid
    ) as string;
    const temporaryDataFolderUri =
      workspaceManagementService.getWorkspaceTemporaryFolderPath(workspaceUid);

    const getExactFolderUri = (filePath: string) => {
      if (!isAllSave) {
        return temporaryDataFolderUri + filePath.split(folderUri)[1];
      }
      return filePath;
    };

    if (deleteTypeInfo.isFileDeleted) {
      const targetPath = getExactFolderUri(deleteTypeInfo.filePath);
      fs.unlinkSync(targetPath);
      return;
    }

    objList.forEach((obj) => {
      const { fileJson, filePath } = obj;
      console.log('obj: ************', obj);

      // 임시저장 path or 전체 저장 path
      const targetPath = getExactFolderUri(filePath);
      console.log('Is this file empty? => ', this.isFileObjectEmpty(fileJson));
      console.log('fileJson => ', fileJson);

      // function replacer(key: string, value: any): any {
      //   if (typeof value === 'object' && Object.keys(value).length === 0) {
      //     return '{}';
      //   }
      //   return value;
      // }

      if (!this.isFileObjectEmpty(fileJson)) {
        console.log('buff: ', JSON.stringify(fileJson));
        const buf = Buffer.from(JSON.stringify(fileJson));
        console.log('buf#####:', buf);
        const result = Converter.JsonToHcl(buf, JSON.stringify(typeMap || {}));
        console.log('result %%%%:', result);
        const resultStr = Buffer.from(result).toString();
        console.log('resultStr: ', resultStr);
        if (!fs.existsSync(FileUtils.getDirName(targetPath))) {
          fs.mkdirSync(FileUtils.getDirName(targetPath), { recursive: true });
        }

        if (fs.existsSync(targetPath)) {
          // MEMO : 원본파일이 있는 경우 원본과 저장할 파일 내용 비교 후 합침
          const originalTf = FileUtils.readFileString(targetPath);
          const prettyNewTf = this.getPrettyString(resultStr);
          const finalTf = Converter.HclToHcl(originalTf, prettyNewTf);
          console.log('originalTf', originalTf);
          console.log('prettyNewTf', prettyNewTf);
          console.log('finalTf', finalTf);
          fs.writeFileSync(targetPath, finalTf);
        } else {
          // MEMO : 원본파일이 없는 경우 그냥 새 파일 생성
          fs.writeFileSync(targetPath, this.getPrettyString(resultStr));
        }
      } else {
        console.log('error');
        if (!fs.existsSync(FileUtils.getDirName(targetPath))) {
          fs.mkdirSync(FileUtils.getDirName(targetPath), { recursive: true });
        }

        if (fs.existsSync(targetPath)) {
          // MEMO : 원본파일이 있는 경우 원본과 저장할 파일 내용 비교 후 합침
          fs.writeFileSync(targetPath, '');
        } else {
          // MEMO : 원본파일이 없는 경우 그냥 새 파일 생성
          fs.writeFileSync(targetPath, this.getPrettyString(''));
        }
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

  isFileObjectEmpty(fileObject: any): boolean {
    let result = true;
    Object.keys(fileObject).forEach((currObjectType) => {
      switch (getObjectDataType[currObjectType as TerraformType]) {
        case 'THREE_DEPTH_DATA_TYPE': {
          Object.keys(fileObject[currObjectType]).forEach(
            (currObjectResourceName) => {
              Object.keys(
                fileObject[currObjectType][currObjectResourceName]
              ).forEach((currObjectInstanceName) => {
                if (
                  result &&
                  Object.keys(
                    fileObject[currObjectType][currObjectResourceName][
                      currObjectInstanceName
                    ]
                  ).length > 0
                ) {
                  result = false;
                }
              });
            }
          );
          break;
        }
        case 'TWO_DEPTH_DATA_TYPE': {
          Object.keys(fileObject[currObjectType]).forEach(
            (currObjectInstanceName) => {
              if (
                result &&
                Object.keys(fileObject[currObjectType][currObjectInstanceName])
                  .length > 0
              ) {
                result = false;
              }
            }
          );
          break;
        }
        case 'ONE_DEPTH_DATA_TYPE': {
          if (result && Object.keys(fileObject[currObjectType]).length > 0) {
            console.log('great job!!');
            result = false;
          }
          break;
        }
        default:
      }
    });
    return result;
  }
}
