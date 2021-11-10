import * as React from 'react';
import { Box, Typography } from '@mui/material';
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { QUICK_START } from '@renderer/utils/graph';

const ErrorDetail = (props: ErrorDetailProps) => {
  const { message } = props;
  return (
    <>
      <RunningWithErrorsIcon
        color="primary"
        sx={{ fontSize: 50, marginTop: 12 }}
      />
      <Typography variant="h3" mt={2} mb={4}>
        Oh no! Something went wrong.
      </Typography>
      <Box sx={{ overflow: 'auto', width: '100%' }}>
        <Typography
          variant="subtitle1"
          sx={{ whiteSpace: 'pre-line', color: 'gray' }}
        >
          {message}
        </Typography>
      </Box>
    </>
  );
};

const InfoDetail = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        alignSelf: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignSelf: 'center',
          alignItems: 'center',
        }}
      >
        <AddTaskIcon color="primary" sx={{ fontSize: 50 }} />
        <Typography variant="h3" mt={2} mb={4}>
          CMP Studio 시작하기
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ whiteSpace: 'pre-line', color: 'gray' }}
        >
          라이브러리 탭에서 리소스를 추가하세요.
        </Typography>
      </Box>
    </Box>
  );
};

const Error = (props: ErrorProps) => {
  const { message, isLoading } = props;

  if (isLoading || !message) {
    return null;
  }

  return (
    <Box
      p={2}
      sx={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
      }}
    >
      {message === QUICK_START ? (
        <InfoDetail />
      ) : (
        <ErrorDetail message={message} />
      )}
    </Box>
  );
};

interface ErrorDetailProps {
  message: string;
}
interface ErrorProps {
  isLoading: boolean;
  // eslint-disable-next-line react/require-default-props
  message?: string;
}

export default Error;
