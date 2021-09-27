import * as React from 'react';
import { Drawer, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import DynamicForm from '../form';
import { sampleSchema } from '../form/test-sample';

export const SIDEPANEL_WIDTH = 500;

const TopologySidePanel: React.FC<TopologySidePanelProps> = ({
  open,
  toggleSidePanel,
  data,
}) => {
  const id = data.id || 'testIdDummy';

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
        open={open}
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
          <DynamicForm schema={sampleSchema} />
        </div>
      </Drawer>
    </>
  );
};

type TopologySidePanelProps = {
  open: boolean;
  data: any;
  toggleSidePanel: any;
};

export default TopologySidePanel;
