/* eslint-disable  @typescript-eslint/ban-types */
import * as React from 'react';
import { Box, Modal, Typography } from '@mui/material';
import LoadingIcon from '../../../../../assets/images/loading64x64.gif';

const TerraformPlanLoadingModal = (props: TerraformPlanLoadingModalProps) => {
  const { isOpen, initMsg, loadingMsg } = props;

  return (
    <Modal
      open={isOpen}
      aria-labelledby="loading-modal-title"
      aria-describedby="loading-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 400,
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          outline: 'none',
          p: 4,
          pb: 2,
        }}
      >
        <Box mb={5} sx={{ display: 'flex', justifyContent: 'center' }}>
          <img
            alt="loading"
            src={LoadingIcon}
            style={{ width: 96, height: 96 }}
          />
        </Box>
        <Typography
          align="center"
          variant="h4"
          mt={4}
          mb={2}
          sx={{ fontWeight: 'bold' }}
        >
          시각화 중...
        </Typography>
        <Typography align="center" variant="subtitle2" sx={{ color: 'gray' }}>
          {initMsg || loadingMsg}
        </Typography>
      </Box>
    </Modal>
  );
};

export interface TerraformPlanLoadingModalProps {
  isOpen: boolean;
  initMsg?: string;
  loadingMsg: string | null;
}

export default TerraformPlanLoadingModal;
