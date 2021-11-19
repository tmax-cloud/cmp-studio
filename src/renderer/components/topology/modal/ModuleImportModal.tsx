/* eslint-disable  @typescript-eslint/ban-types */
import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Button, InputLabel } from '@mui/material';

function importMoudle(moduleName: string) {
  alert('Import ' + moduleName);
}

const ModuleImportModal = (props: ModuleImportModalProps) => {
  const { isOpen, onClose, moduleName } = props;

  const onImport = () => {
    importMoudle(moduleName);
    onClose();
  };

  const content = (
    <Box sx={{ width: '100%' }}>
      <InputLabel>Overview</InputLabel>
      <InputLabel>Description</InputLabel>
      <Button onClick={onClose} style={{ alignContent: 'left' }}>
        취소
      </Button>
      <Button onClick={onImport} style={{ alignContent: 'left' }}>
        확인
      </Button>
    </Box>
  );

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="module-list-modal-title"
      aria-describedby="module-list-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          pt: 2,
        }}
      >
        <Toolbar sx={{ mb: 2 }} style={{ padding: 0 }}>
          <Typography variant="h3" sx={{ flexGrow: 1 }}>
            {'테라폼 모듈 : '}
            {moduleName}
          </Typography>
          <IconButton color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Box sx={{ width: 600, maxHeight: 400 }}>{content}</Box>
      </Box>
    </Modal>
  );
};

export interface ModuleImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: any;
}

export default ModuleImportModal;
