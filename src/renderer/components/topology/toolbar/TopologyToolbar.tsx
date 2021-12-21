import * as React from 'react';
import _ from 'lodash';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { exportProject } from '@renderer/utils/ipc/workspaceIpcUtils';
import {
  selectCodeFileObjects,
  selectMapObjectTypeCollection,
} from '@renderer/features/codeSliceInputSelectors';
import { selectWorkspaceUid } from '@renderer/features/commonSliceInputSelectors';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { useWorkspaceName } from '@renderer/hooks/useWorkspaceName';
import { watchGraphData } from '@renderer/features/graphSlice';
import { WorkspaceStatusType } from '@main/workspaces/common/workspace';
import { selectFileDirty } from '@renderer/features/uiSliceInputSelectors';
import {
  setFileDirty,
  setLoadingModal,
  setLoadingMsg,
} from '@renderer/features/uiSlice';
import { fetchTerraformPlanDataByWorkspaceId } from '@renderer/features/commandSlice';
import {
  FitScreenButton,
  TerraformApplyButton,
  SaveButton,
  SelectModuleButton,
  ZoomInButton,
  ZoomOutButton,
  TerraformPlanButton,
} from './button';
import ViewBreadcrumbs from './breadcrumb/ViewBreadcrumb';
import { ModuleListModal } from '../modal';

export const TOPOLOGY_TOOLBAR_HEIGHT = 50;

const TopologyToolbar = (props: TopologyToolbarProps) => {
  const { handlers } = props;
  const [openModuleListModal, setOpenModuleListModal] = React.useState(false);

  const handleModuleListModalOpen = () => setOpenModuleListModal(true);
  const handleModuleListModalClose = () => setOpenModuleListModal(false);

  const fileObjects = useAppSelector(selectCodeFileObjects);
  const workspaceUid = useAppSelector(selectWorkspaceUid);
  const mapObjectCollection = useAppSelector(selectMapObjectTypeCollection);
  const fileDirty = useAppSelector(selectFileDirty);
  const workspaceName = useWorkspaceName(workspaceUid);

  const dispatch = useAppDispatch();

  const handleSaveButtonClick = async () => {
    const result = await exportProject({
      objects: fileObjects,
      workspaceUid,
      isAllSave: true,
      typeMap: mapObjectCollection,
      deleteTypeInfo: { isFileDeleted: false, filePath: '' },
    });
    if (result.status === WorkspaceStatusType.SUCCESS) {
      dispatch(setFileDirty(false));
      dispatch(watchGraphData(workspaceUid));
    }
    // console.log('[INFO] File export result : ', result);
  };

  const handleTerraformPlanButton = async () => {
    dispatch(fetchTerraformPlanDataByWorkspaceId(workspaceUid));
    dispatch(setLoadingModal(true));
  };

  return (
    <Toolbar
      style={{ minHeight: 48, paddingLeft: 20, paddingRight: 20 }}
      sx={{
        display: 'flex',
        flexShrink: 0,
        borderBottom: '1px solid',
        borderRight: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}
    >
      <ViewBreadcrumbs workspaceName={workspaceName} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          ml: 5,
        }}
      >
        <TerraformApplyButton
          onClick={() => {
            console.log('apply');
          }}
        />
        <TerraformPlanButton onClick={handleTerraformPlanButton} />
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ mx: 1 }}
        />
        <SaveButton visibleBadge={fileDirty} onClick={handleSaveButtonClick} />
        <SelectModuleButton onClick={handleModuleListModalOpen} />
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
