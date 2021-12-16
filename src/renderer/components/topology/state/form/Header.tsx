import * as React from 'react';
import * as _ from 'lodash-es';
import * as TerraformTypes from '@main/terraform-command/common/terraform';
import { Box, IconButton, Typography, TextField } from '@mui/material';
import { Close, Save } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { setFileDirty, setSidePanel } from '@renderer/features/uiSlice';
import { setFileObjects } from '@renderer/features/codeSlice';
import {
  selectCodeFileObjects,
  selectCodeSelectedObjectInfo,
  selectMapObjectTypeCollection,
} from '@renderer/features/codeSliceInputSelectors';
import { getObjectDataType, TerraformType } from '@renderer/types/terraform';
import { exportProject } from '@renderer/utils/ipc/workspaceIpcUtils';
import { selectWorkspaceUid } from '@renderer/features/commonSliceInputSelectors';
import { setTerraformState } from '@renderer/features/commonSlice';
import { getTerraformPlan } from '@renderer/utils/ipc/terraformIpcUtils';
import { WorkspaceStatusType } from '@main/workspaces/common/workspace';
import { watchGraphData } from '@renderer/features/graphSlice';
import { getIcon } from '../../icon/IconFactory';

const FormHeader = (props: FormHeaderProps) => {
  const { title, resourceName, type } = props;
  const dispatch = useAppDispatch();
  const fileObjects = useAppSelector(selectCodeFileObjects);
  const [newTitle, setNewTitle] = React.useState('');
  const workspaceUid = useAppSelector(selectWorkspaceUid);
  const mapObjectCollection = useAppSelector(selectMapObjectTypeCollection);
  const isInstanceName = (type: TerraformType) => {
    switch (getObjectDataType[type]) {
      case 'THREE_DEPTH_DATA_TYPE': {
        return true;
      }
      case 'TWO_DEPTH_DATA_TYPE': {
        return true;
      }
      case 'ONE_DEPTH_DATA_TYPE': {
        return false;
      }
      default:
        return false;
    }
  };
  const [isFixed, setIsFixed] = React.useState<boolean>();
  const { instanceName } = useAppSelector(selectCodeSelectedObjectInfo);
  const newTitleChange = (event: any) => {
    setNewTitle(event.target.value);
  };
  React.useEffect(() => {
    setNewTitle(title);
    setIsFixed(!isInstanceName(type));
  }, [title, type]);

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

  const setNewInstanceName = (
    type: TerraformType,
    fileObject: any,
    instancename: string,
    newInstancename: string
  ) => {
    switch (getObjectDataType[type]) {
      case 'THREE_DEPTH_DATA_TYPE': {
        const resourceObjects = fileObject.fileJson[type][resourceName];
        const newResourceObjects: any = {};

        for (const key in resourceObjects) {
          if (key === instanceName) {
            newResourceObjects[newInstancename] = resourceObjects[key];
          } else {
            newResourceObjects[key] = resourceObjects[key];
          }
        }

        /*

        for (const key in resourceObjects) {
          if (key === instanceName) {
            newResourceObjects[newInstancename] = resourceObjects[key];
          } else {
            newResourceObjects[key] = resourceObjects[key];
          }
        }
        */
        return {
          ...fileObject,
          fileJson: {
            ...fileObject.fileJson,
            [type]: {
              ...fileObject.fileJson[type],
              [resourceName]: newResourceObjects,
            },
          },
        };
      }
      case 'TWO_DEPTH_DATA_TYPE': {
        const instanceObjects = fileObject.fileJson[type];
        const newinstanceObjects: any = {};

        for (const key in instanceObjects) {
          if (key === instanceName) {
            newinstanceObjects[newInstancename] = instanceObjects[key];
          } else {
            newinstanceObjects[key] = instanceObjects[key];
          }
        }
        return {
          ...fileObject,
          fileJson: {
            ...fileObject.fileJson,
            [type]: newinstanceObjects,
          },
        };
      }
      default:
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ margin: '16px', display: 'flex', alignItems: 'center' }}>
        {getIcon(resourceName || title, 64)}
        {isFixed ? (
          <Typography variant="h3" sx={{ ml: 1.5 }}>
            {title}
          </Typography>
        ) : (
          <>
            <TextField
              value={newTitle}
              placeholder="Name"
              label="InstanceName"
              onChange={newTitleChange}
              style={{ marginLeft: '10px' }}
              fullWidth
            />
            <IconButton
              aria-label="Save"
              onClick={async () => {
                // redux fileObjects에 변경된 부분 저장하기
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
                      return setNewInstanceName(
                        type,
                        fileObject,
                        title,
                        newTitle
                      );
                    }
                    return fileObject;
                  }
                );
                dispatch(setFileObjects(newFileObjects));

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
                    const { message } =
                      data as TerraformTypes.TerraformErrorData;
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
              <Save />
            </IconButton>
            <IconButton />
          </>
        )}
      </Box>
      <IconButton
        aria-label="Close"
        onClick={() => {
          dispatch(setSidePanel(false));
        }}
      >
        <Close />
      </IconButton>
    </div>
  );
};

type FormHeaderProps = {
  title: string;
  resourceName: string;
  type: TerraformType;
};

export default FormHeader;
