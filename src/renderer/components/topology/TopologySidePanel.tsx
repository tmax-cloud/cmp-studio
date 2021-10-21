import * as React from 'react';
import * as _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { Drawer, IconButton } from '@mui/material';
// import { createSelector } from '@reduxjs/toolkit';
import { Close } from '@mui/icons-material';
import { getSchemaMap } from 'renderer/utils/storageAPI';
import { RootState } from 'renderer/app/store';
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import DynamicForm from '../form';
import preDefinedData from '../form/utils/preDefinedData';

export const SIDEPANEL_WIDTH = 500;

const TopologySidePanel: React.FC<TopologySidePanelProps> = ({
  isSidePanelOpen,
  toggleSidePanel,
}) => {
  const selectObject = createSelector(
    [(state: RootState) => _.defaultsDeep(state.code)],
    (code) => _.defaultsDeep(code)
  );
  const {
    selectedObjectInfo: { id, content },
    selectedObjectInfo,
  } = useSelector(selectObject);

  console.log('selected redux object info: ', selectedObjectInfo);

  // schema
  const terraformSchemaMap = getSchemaMap();
  const currentSchema = terraformSchemaMap.get(id);
  console.log('current schema: ', currentSchema);
  const {
    customUISchema = {},
    formData = {},
    fixedSchema = {},
  } = id && preDefinedData(currentSchema, content);

  return (
    <>
      <Drawer
        PaperProps={{
          sx: {
            width: SIDEPANEL_WIDTH,
            backgroundColor: '#eff2fd',
            top: TOP_NAVBAR_HEIGHT,
            height: `calc(100% - ${TOP_NAVBAR_HEIGHT}px)`,
          },
        }}
        open={isSidePanelOpen}
        anchor="right"
        variant="persistent"
      >
        <div style={{ textAlign: 'end' }}>
          <IconButton
            aria-label="Close"
            onClick={() => {
              toggleSidePanel(false);
            }}
          >
            <Close />
          </IconButton>
        </div>
        <div style={{ padding: '50px' }}>
          <DynamicForm
            schema={fixedSchema}
            formData={formData}
            uiSchema={customUISchema}
          />
        </div>
      </Drawer>
    </>
  );
};

type TopologySidePanelProps = {
  isSidePanelOpen: boolean;
  toggleSidePanel: any;
};

export default TopologySidePanel;
