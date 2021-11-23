import * as React from 'react';
import * as _ from 'lodash-es';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import * as TerraformTypes from '@main/terraform-command/common/terraform';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { exportProject } from '@renderer/utils/ipc/workspaceIpcUtils';
import {
  selectCodeFileObjects,
  selectCodeSelectedObjectInfoInstanceName,
  selectCodeSelectedObjectInfoId,
  selectMapObjectTypeCollection,
} from '@renderer/features/codeSliceInputSelectors';
import { selectWorkspaceUid } from '@renderer/features/commonSliceInputSelectors';
import { setFileObjects } from '@renderer/features/codeSlice';
import { setSidePanel } from '@renderer/features/uiSlice';
import { setTerraformState } from '@renderer/features/commonSlice';
import { getTerraformPlan } from '@renderer/utils/ipc/terraformIpcUtils';

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
  const objectId = useAppSelector(selectCodeSelectedObjectInfoId);
  const workspaceUid = useAppSelector(selectWorkspaceUid);
  const selectedObjectInstanceName = useAppSelector(
    selectCodeSelectedObjectInfoInstanceName
  );
  const dispatch = useAppDispatch();

  const onDeleteObject = () => {
    const fileIdx = _.findIndex(fileObjects, (cur: any, idx) => {
      if (_.get(cur.fileJson, objectId.split('/').join('.'))) {
        return true;
      } else {
        return false;
      }
    });
    const [type, resourceName] = objectId.split('/');
    const newFileObjects = fileObjects.map((cur: any, idx: number) => {
      if (idx === fileIdx) {
        if (_.size(cur.fileJson) > 1) {
          // 타입이 여러개인 경우 (상관 안해도 됨.)
          if (_.size(cur.fileJson[type]) > 1) {
            return _.omit(cur, [`fileJson.${type}.${resourceName}`]);
          }
          return _.omit(cur, [`fileJson.${type}`]);
        } else {
          // 타입이 하나인 경우 (해당 타입의 리소스가 없을 경우에 대해 분기 처리 해줘야함.)
          if (_.size(cur.fileJson[type]) > 1) {
            // 리소스가 여러개인 경우 (상관 없음
            return _.omit(cur, [`fileJson.${type}.${resourceName}`]);
          }
          //리소스가 하나인 경우
          return null;
        }
      }
      return cur;
    });

    dispatch(
      setFileObjects(
        newFileObjects[fileIdx] === null
          ? _.without(newFileObjects, newFileObjects[fileIdx])
          : newFileObjects
      )
    );
    dispatch(setSidePanel(false));
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
            const fileIdx = _.findIndex(fileObjects, (cur: any, idx) => {
              if (_.get(cur.fileJson, objectId.split('/').join('.'))) {
                return true;
              } else {
                return false;
              }
            });
            const [type, resourceName] = objectId.split('/');
            const newFileObjects = fileObjects.map((cur: any, idx: number) => {
              if (idx === fileIdx) {
                return {
                  ...cur,
                  fileJson: {
                    ...cur.fileJson,
                    [type]: {
                      ...cur.fileJson[type],
                      [resourceName]: {
                        [selectedObjectInstanceName]: {
                          ...formState,
                        },
                      },
                    },
                  },
                };
              }
              return cur;
            });
            dispatch(setFileObjects(newFileObjects));

            // TemporaryDataPath에 변경사항 저장 (terraform plan 용도)
            const result = await exportProject({
              objects: fileObjects,
              workspaceUid,
              isAllSave: false,
              typeMap: mapObjectCollection,
            });

            await getTerraformPlan({ workspaceUid })
              .then((res: TerraformTypes.TerraformResponse) => {
                const { status, data } = res;
                if (status === TerraformTypes.TerraformStatusType.SUCCESS) {
                  console.log('Data: ', data);
                }
                dispatch(setTerraformState(data as string));
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
