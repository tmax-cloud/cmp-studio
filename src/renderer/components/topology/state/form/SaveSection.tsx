import * as React from 'react';
import * as _ from 'lodash-es';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
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
          // ????????? ????????? ????????? ???????????? ??????
          if (_.size(fileObject.fileJson[type]) > 1) {
            // ????????? ????????? ???????????? ???????????? ??????
            if (resourceName) {
              // resourceName??? ?????? ??????
              // ????????? ????????? ?????????????????? ???????????? ??????
              if (_.size(fileObject.fileJson[type][resourceName]) > 1) {
                // ????????? ?????????????????? ??????????????? ???????????? ??????
                return _.omit(fileObject, [
                  `fileJson.${type}.${resourceName}.${instanceName}`,
                ]);
              }
            }
            // resourceName??? ?????? instanceName??? ?????? ??????
            if (_.size(fileObject.fileJson[type][instanceName]) > 1) {
              // ????????? ????????? instanceName??? ???????????? ??????
              return _.omit(fileObject, [`fileJson.${type}.${instanceName}`]);
            }
          }
          // ????????? ????????? ???????????? ????????? ??????
          else if (resourceName) {
            // ????????? ????????? ?????? ??????
            if (_.size(fileObject.fileJson[type][resourceName]) > 1) {
              // ?????? ?????????????????? ??????????????? ???????????? ??????
              return _.omit(fileObject, [
                `fileJson.${type}.${resourceName}.${instanceName}`,
              ]);
            }
          } else if (
            instanceName &&
            _.size(fileObject.fileJson[type][instanceName]) > 1
          ) {
            // ????????? ????????? instanceName??? ???????????? ??????
            return _.omit(fileObject, [`fileJson.${type}.${instanceName}`]);
          }
          return _.omit(fileObject, [`fileJson.${type}`]);
        } else {
          // ????????? ????????? ????????? ????????? ??????
          if (_.size(fileObject.fileJson[type]) > 1) {
            // ????????? ????????? ???????????? ???????????? ??????
            if (resourceName) {
              // resourceName??? ?????? ??????
              if (_.size(fileObject.fileJson[type][resourceName]) > 1) {
                // ????????? ?????????????????? ??????????????? ???????????? ??????
                return _.omit(fileObject, [
                  `fileJson.${type}.${resourceName}.${instanceName}`,
                ]);
              }
              // ????????? ?????????????????? ??????????????? ????????? ??????
              return _.omit(fileObject, [`fileJson.${type}.${resourceName}`]);
            } else if (
              instanceName &&
              _.size(fileObject.fileJson[type][instanceName]) > 1
            ) {
              // resourceName??? ?????? ?????? (terraform?????? locals??? ?????? type????????? ????????? ??? ?????? ?????? ??? - ????????? ?????? ??????)
              return _.omit(fileObject, [`fileJson.${type}.${instanceName}`]);
            }
          }
          //????????? ????????? ???????????? ????????? ??????
          if (resourceName) {
            if (_.size(fileObject.fileJson[type][resourceName]) > 1) {
              // ????????? ?????????????????? ??????????????? ???????????? ??????
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
        ???????????? ??????
      </Button>
      <div>
        <Button
          className={classes.cancelBtn}
          variant="outlined"
          onClick={() => dispatch(setSidePanel(false))}
        >
          {cancelLabel || '??????'}
        </Button>
        <Button
          className={classes.saveBtn}
          variant="contained"
          onClick={async () => {
            // redux fileObjects??? ????????? ?????? ????????????
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

            // TemporaryDataPath??? ???????????? ?????? (terraform plan ??????)
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
          }}
        >
          {saveLabel || '??????'}
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
