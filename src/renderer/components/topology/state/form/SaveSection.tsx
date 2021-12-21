import * as React from 'react';
import * as _ from 'lodash-es';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import * as TerraformTypes from '@main/terraform-command/common/terraform';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { exportProject } from '@renderer/utils/ipc/workspaceIpcUtils';
import {
  selectCodeFileObjects,
  selectCodeSelectedObjectInfo,
  selectMapObjectTypeCollection,
} from '@renderer/features/codeSliceInputSelectors';
import { selectWorkspaceUid } from '@renderer/features/commonSliceInputSelectors';
import { TerraformType, getObjectDataType } from '@renderer/types/terraform';
import {
  setFileObjects,
  setSelectedContent,
} from '@renderer/features/codeSlice';
import {
  setFileDirty,
  setLoadingMsg,
  setSidePanel,
} from '@renderer/features/uiSlice';
import { setTerraformState } from '@renderer/features/commonSlice';
import { getTerraformPlan } from '@renderer/utils/ipc/terraformIpcUtils';
import {
  fetchGraphDataByWorkspaceId,
  watchGraphData,
} from '@renderer/features/graphSlice';
import { WorkspaceStatusType } from '@main/workspaces/common/workspace';
import { LOADING } from '@renderer/utils/graph';

const useStyles = makeStyles({
  root: {
    overflow: 'auto',
  },
  saveSection: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: '20px 0px',
  },
  deleteBtn: {
    height: '34px',
    color: '#FF4E80',
  },
  saveBtn: {
    width: '97px',
    height: '34px',
  },
  cancelBtn: {
    width: '97px',
    height: '34px',
    marginRight: '10px',
  },
});

const SaveSection = (props: SaveSectionProps) => {
  const { saveLabel, cancelLabel, formState } = props;
  const classes = useStyles();
  const fileObjects = useAppSelector(selectCodeFileObjects);
  const mapObjectCollection = useAppSelector(selectMapObjectTypeCollection);
  const workspaceUid = useAppSelector(selectWorkspaceUid);
  const { type, resourceName, instanceName } = useAppSelector(
    selectCodeSelectedObjectInfo
  );

  const getPath = (type: TerraformType) => {
    switch (getObjectDataType[type]) {
      case 'THREE_DEPTH_DATA_TYPE': {
        return `${type}.${resourceName}.${instanceName}`;
      }
      case 'TWO_DEPTH_DATA_TYPE': {
        return `${type}.${instanceName}`;
      }
      case 'ONE_DEPTH_DATA_TYPE': {
        return `${type}`;
      }
      default:
        return '';
    }
  };

  const path = getPath(type);

  const dispatch = useAppDispatch();
  const onDeleteObject = async () => {
    dispatch(setLoadingMsg(LOADING));
    let isFileDeleted = false;
    const fileIdx = _.findIndex(fileObjects, (cur: any, idx) => {
      if (_.get(cur.fileJson, path as string)) {
        return true;
      } else {
        return false;
      }
    });
    const { filePath } = fileObjects[fileIdx];
    const newFileObjects = fileObjects.map((fileObject: any, idx: number) => {
      if (idx === fileIdx) {
        if (_.size(fileObject.fileJson) > 1) {
          // 동일한 파일에 타입이 여러개인 경우
          if (_.size(fileObject.fileJson[type]) > 1) {
            // 동일한 타입의 데이터가 여러개인 경우
            if (resourceName) {
              // resourceName이 있는 경우
              // 동일한 타입의 리소스이름이 여러개인 경우
              if (_.size(fileObject.fileJson[type][resourceName]) > 1) {
                // 동일한 리소스이름의 인스턴스가 여러개인 경우
                return _.omit(fileObject, [
                  `fileJson.${type}.${resourceName}.${instanceName}`,
                ]);
              }
            }
            // resourceName이 없고 instanceName만 있는 경우
            if (_.size(fileObject.fileJson[type][instanceName]) > 1) {
              // 동일한 타입의 instanceName이 여러개인 경우
              return _.omit(fileObject, [`fileJson.${type}.${instanceName}`]);
            }
          }
          // 동일한 타입의 데이터가 하나인 경우
          else if (resourceName) {
            // 리소스 이름이 있을 경우
            if (_.size(fileObject.fileJson[type][resourceName]) > 1) {
              // 해당 리소스이름인 인스턴스가 여러개인 경우
              return _.omit(fileObject, [
                `fileJson.${type}.${resourceName}.${instanceName}`,
              ]);
            }
          } else if (
            instanceName &&
            _.size(fileObject.fileJson[type][instanceName]) > 1
          ) {
            // 동일한 타입의 instanceName이 여러개인 경우
            return _.omit(fileObject, [`fileJson.${type}.${instanceName}`]);
          }
          return _.omit(fileObject, [`fileJson.${type}`]);
        } else {
          // 동일한 파일에 타입이 하나인 경우
          if (_.size(fileObject.fileJson[type]) > 1) {
            // 동일한 타입의 데이터가 여러개인 경우
            if (resourceName) {
              // resourceName이 있는 경우
              if (_.size(fileObject.fileJson[type][resourceName]) > 1) {
                // 동일한 리소스이름의 인스턴스가 여러개인 경우
                return _.omit(fileObject, [
                  `fileJson.${type}.${resourceName}.${instanceName}`,
                ]);
              }
              // 동일한 리소스이름의 인스턴스가 하나인 경우
              return _.omit(fileObject, [`fileJson.${type}.${resourceName}`]);
            } else if (
              instanceName &&
              _.size(fileObject.fileJson[type][instanceName]) > 1
            ) {
              // resourceName이 없는 경우 (terraform이나 locals는 단일 type으로서 존재할 수 밖에 없는 것 - 아니면 수정 필요)
              return _.omit(fileObject, [`fileJson.${type}.${instanceName}`]);
            }
          }
          //동일한 타입의 데이터가 하나인 경우
          if (resourceName) {
            if (_.size(fileObject.fileJson[type][resourceName]) > 1) {
              // 동일한 리소스이름의 인스턴스가 여러개인 경우
              return _.omit(fileObject, [
                `fileJson.${type}.${resourceName}.${instanceName}`,
              ]);
            }
          }
        }
        isFileDeleted = true;
        return _.omit(fileObject, [`fileJson`]);
      }
      return fileObject;
    });

    dispatch(
      setFileObjects(
        newFileObjects[fileIdx] === null
          ? _.without(newFileObjects, newFileObjects[fileIdx])
          : newFileObjects
      )
    );
    const result = await exportProject({
      objects: newFileObjects,
      workspaceUid,
      isAllSave: false,
      typeMap: mapObjectCollection,
      deleteTypeInfo: { isFileDeleted, filePath },
    });
    if (result.status === WorkspaceStatusType.SUCCESS) {
      dispatch(setFileDirty(true));
      dispatch(fetchGraphDataByWorkspaceId(workspaceUid));
    }
    dispatch(setSidePanel(false));
  };

  const setFileObject = (type: TerraformType, fileObject: any) => {
    switch (getObjectDataType[type]) {
      case 'THREE_DEPTH_DATA_TYPE': {
        return {
          ...fileObject,
          fileJson: {
            ...fileObject.fileJson,
            [type]: {
              ...fileObject.fileJson[type],
              [resourceName]: {
                ...fileObject.fileJson[type][resourceName],
                [instanceName]: !_.isEmpty(formState) ? formState : {},
              },
            },
          },
        };
      }
      case 'TWO_DEPTH_DATA_TYPE': {
        return {
          ...fileObject,
          fileJson: {
            ...fileObject.fileJson,
            [type]: {
              ...fileObject.fileJson[type],
              [instanceName]: !_.isEmpty(formState) ? formState : {},
            },
          },
        };
      }
      case 'ONE_DEPTH_DATA_TYPE': {
        return {
          ...fileObject,
          fileJson: {
            ...fileObject.fileJson,
            [type]: !_.isEmpty(formState) ? formState : {},
          },
        };
      }
      default:
    }
  };

  return (
    <div className={classes.saveSection}>
      <Button className={classes.deleteBtn} onClick={onDeleteObject}>
        오브젝트 삭제
      </Button>
      <div>
        <Button
          className={classes.cancelBtn}
          variant="outlined"
          onClick={() => dispatch(setSidePanel(false))}
        >
          {cancelLabel || '취소'}
        </Button>
        <Button
          className={classes.saveBtn}
          variant="contained"
          onClick={async () => {
            // redux fileObjects에 변경된 부분 저장하기
            dispatch(setLoadingMsg(LOADING));
            const fileIdx = _.findIndex(fileObjects, (cur: any, idx) => {
              if (_.get(cur.fileJson, path as string)) {
                return true;
              } else {
                return false;
              }
            });
            const newFileObjects = fileObjects.map(
              (fileObject: any, idx: number) => {
                if (idx === fileIdx) {
                  return setFileObject(type, fileObject);
                }
                return fileObject;
              }
            );
            dispatch(setFileObjects(newFileObjects));
            dispatch(
              setSelectedContent({
                ...formState,
              })
            );

            // TemporaryDataPath에 변경사항 저장 (terraform plan 용도)
            const result = await exportProject({
              objects: newFileObjects,
              workspaceUid,
              isAllSave: false,
              typeMap: mapObjectCollection,
              deleteTypeInfo: { isFileDeleted: false, filePath: '' },
            });
            if (result.status === WorkspaceStatusType.SUCCESS) {
              dispatch(setFileDirty(true));
              dispatch(watchGraphData(workspaceUid));
            }

            await getTerraformPlan({ workspaceUid })
              .then((res: TerraformTypes.TerraformResponse) => {
                const { status, data } = res;
                const { planData } =
                  data as TerraformTypes.TerraformPlanSuccessData;
                const { message } = data as TerraformTypes.TerraformErrorData;
                dispatch(
                  setTerraformState({
                    status,
                    data: planData,
                    message,
                  })
                );
                return res;
              })
              .catch((e: any) => {
                console.log(e);
              });
            console.log('[INFO] File export result : ', result);
          }}
        >
          {saveLabel || '저장'}
        </Button>
      </div>
    </div>
  );
};

type SaveSectionProps = {
  saveLabel: string;
  cancelLabel: string;
  formState: any;
};

export default SaveSection;
