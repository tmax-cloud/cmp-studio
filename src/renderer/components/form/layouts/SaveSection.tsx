import * as React from 'react';
import * as _ from 'lodash-es';
import { Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import {
  selectCodeFileObjects,
  selectCodeSelectedObjectInfoInstanceName,
  selectCodeSelectedObjectInfoId,
  selectCodeSelectedObjectInfoContent,
} from '@renderer/features/codeSliceInputSelectors';
import { setFileObjects } from '@renderer/features/codeSlice';

const SaveSection = (props: SaveSectionProps) => {
  const { saveLabel, cancelLabel, toggleSidePanel, formState } = props;
  const fileObjects = useAppSelector(selectCodeFileObjects);
  const objectId = useAppSelector(selectCodeSelectedObjectInfoId);
  const selectedObjectContent = useAppSelector(
    selectCodeSelectedObjectInfoContent
  );
  const selectedObjectInstanceName = useAppSelector(
    selectCodeSelectedObjectInfoInstanceName
  );
  const { type } = selectedObjectContent;

  const dispatch = useAppDispatch();
  return (
    <div style={{ textAlign: 'end', padding: '20px 10px' }}>
      <Button variant="outlined" onClick={() => toggleSidePanel(false)}>
        {cancelLabel || '취소'}
      </Button>
      <Button
        variant="contained"
        onClick={() => {
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
