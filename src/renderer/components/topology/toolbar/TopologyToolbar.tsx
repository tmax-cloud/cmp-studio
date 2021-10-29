import * as React from 'react';
import _ from 'lodash';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { exportProject } from '@renderer/utils/ipc/workspaceIpcUtils';
import * as WorkspaceTypes from '@main/workspaces/common/workspace';
import { useSelector } from 'react-redux';
import { selectCodeFileObjects } from '@renderer/features/codeSliceInputSelectors';
import {
  FitScreenButton,
  SaveButton,
  ZoomInButton,
  ZoomOutButton,
} from './button';
import ViewBreadcrumbs from './breadcrumb/ViewBreadcrumb';
import { ModuleListModal } from '../modal';

const TopologyToolbar = (props: TopologyToolbarProps) => {
  const { handlers } = props;
  const [openModuleListModal, setOpenModuleListModal] = React.useState(false);

  //const handleModuleListModalOpen = () => setOpenModuleListModal(true);
  const handleModuleListModalClose = () => setOpenModuleListModal(false);
  let objects: WorkspaceTypes.TerraformFileJsonMeta[] = [];

  objects = useSelector(selectCodeFileObjects);
  return (
    <Toolbar
      style={{ minHeight: 48, paddingLeft: 12, paddingRight: 12 }}
      sx={{
        display: 'flex',
        flexShrink: 0,
        borderBottom: '1px solid',
        borderRight: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        backgroundColor: 'white',
      }}
    >
      <Grid container justifyContent="space-between">
        <Grid item justifyContent="center">
          <ViewBreadcrumbs />
        </Grid>
        <Grid item sx={{ display: 'flex' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <SaveButton
              onClick={async () => {
                const result = await exportProject({ objects });
                console.log('[INFO] File export result : ', result);
              }}
            />
            {/* <SelectModuleButton onClick={handleModuleListModalOpen} /> */}
            <ModuleListModal
              isOpen={openModuleListModal}
              onClose={handleModuleListModalClose}
            />
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ mx: 1 }}
            />
            <ZoomInButton onClick={handlers.handleZoomIn} />
            <ZoomOutButton onClick={handlers.handleZoomOut} />
            <FitScreenButton onClick={handlers.handleZoomToFit} />
          </Box>
        </Grid>
      </Grid>
    </Toolbar>
  );
};

export interface GraphHandlerProps {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleZoomToFit: () => void;
}
export interface TopologyToolbarProps {
  handlers: GraphHandlerProps;
}

export default TopologyToolbar;
