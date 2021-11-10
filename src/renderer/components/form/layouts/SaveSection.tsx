import * as React from 'react';
import * as _ from 'lodash-es';
import { Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { exportProject } from '@renderer/utils/ipc/workspaceIpcUtils';
import {
  selectCodeFileObjects,
  selectCodeSelectedObjectInfoInstanceName,
  selectCodeSelectedObjectInfoId,
} from '@renderer/features/codeSliceInputSelectors';
import { selectWorkspaceUid } from '@renderer/features/commonSliceInputSelectors';
import { setFileObjects } from '@renderer/features/codeSlice';

const SaveSection = (props: SaveSectionProps) => {
  const { saveLabel, cancelLabel, toggleSidePanel, formState } = props;
  const fileObjects = useAppSelector(selectCodeFileObjects);
  const objectId = useAppSelector(selectCodeSelectedObjectInfoId);
  const selectedObjectInstanceName = useAppSelector(
    selectCodeSelectedObjectInfoInstanceName
  );
  const workspaceUid = useAppSelector(selectWorkspaceUid);

  const dispatch = useAppDispatch();
  return (
    <div style={{ textAlign: 'end', padding: '20px 10px' }}>
      <Button variant="outlined" onClick={() => toggleSidePanel(false)}>
        {cancelLabel || '취소'}
      </Button>
      <Button
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
          console.log('[INFO] File export result : ', result);
        }}
      >
        {saveLabel || '저장'}
      </Button>
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
