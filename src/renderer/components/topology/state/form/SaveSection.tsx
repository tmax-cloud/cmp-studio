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
} from '@renderer/features/codeSliceInputSelectors';
import { selectWorkspaceUid } from '@renderer/features/commonSliceInputSelectors';
import { setFileObjects } from '@renderer/features/codeSlice';
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
  const { saveLabel, cancelLabel, toggleSidePanel, formState } = props;
  const classes = useStyles();
  const fileObjects = useAppSelector(selectCodeFileObjects);
  const objectId = useAppSelector(selectCodeSelectedObjectInfoId);
  const workspaceUid = useAppSelector(selectWorkspaceUid);
  const selectedObjectInstanceName = useAppSelector(
    selectCodeSelectedObjectInfoInstanceName
  );
  const dispatch = useAppDispatch();

  const onDeleteObject = () => {
    const fileIdx = _.findIndex(fileObjects, (cur: any, idx) => {
      if (_.get(cur.fileJson, objectId.split('-').join('.'))) {
        return true;
      } else {
        return false;
      }
    });
    const [type, resourceName] = objectId.split('-');
    const newFileObjects = fileObjects.map((cur: any, idx: number) => {
      // const deletedObject = _.defaultsDeep(cur.fileJson[type]);
      // if (idx === fileIdx) {
      //   delete deletedObject[resourceName];
      // }
      // return deletedObject;
      if (idx === fileIdx) {
        const newObject = Object.entries(cur.fileJson[type])
          .filter(([key, value]) => key !== resourceName)
          .reduce((obj, item) => {
            return { ...obj, [item[0]]: item[1] };
          }, {});

        return { ...cur, fileJson: { fileJson: { [type]: newObject } } };
      }
      return cur;
    });
    dispatch(setFileObjects(newFileObjects));
    toggleSidePanel(false);
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
          onClick={() => toggleSidePanel(false)}
        >
          {cancelLabel || '취소'}
        </Button>
        <Button
          className={classes.saveBtn}
          variant="contained"
          onClick={async () => {
            // redux fileObjects에 변경된 부분 저장하기
            const fileIdx = _.findIndex(fileObjects, (cur: any, idx) => {
              if (_.get(cur.fileJson, objectId.split('-').join('.'))) {
                return true;
              } else {
                return false;
              }
            });
            const [type, resourceName] = objectId.split('-');
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
  toggleSidePanel: any;
  formState: any;
};

export default SaveSection;
