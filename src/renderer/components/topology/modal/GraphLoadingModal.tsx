/* eslint-disable  @typescript-eslint/ban-types */
import * as React from 'react';
import { Box, Modal, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { INIT_FINISHED } from '@renderer/utils/graph/terraform';
import LoadingIcon from '../../../../../assets/images/loading64x64.gif';

const GraphLoadingModal = (props: GraphLoadingModalProps) => {
  const { isOpen, message } = props;

  const isFinished = message === INIT_FINISHED;

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
          {isFinished ? (
            <CheckCircleIcon color="primary" sx={{ fontSize: 100 }} />
          ) : (
            <img
              alt="loading"
              src={LoadingIcon}
              style={{ width: 96, height: 96 }}
            />
          )}
        </Box>
        <Typography
          align="center"
          variant="h4"
          my={4}
          sx={{ fontWeight: 'bold' }}
        >
          {isFinished ? '' : '시각화 중...'}
        </Typography>
        <Typography
          align="center"
          variant="subtitle2"
          mt={2}
          sx={{ color: 'gray' }}
        >
          {message}
        </Typography>
        {isFinished ? (
          <Typography align="center" variant="subtitle2" sx={{ color: 'gray' }}>
            테라폼 그래프를 불러오는 중입니다.
          </Typography>
        ) : null}
      </Box>
    </Modal>
  );
};

export interface GraphLoadingModalProps {
  isOpen: boolean;
  message?: string;
}

GraphLoadingModal.defaultProps = {
  message: '테라폼 그래프를 불러오는 중입니다.',
};

export default GraphLoadingModal;
