import * as React from 'react';
import { Box, Typography } from '@mui/material';
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';

const Error = (props: ErrorProps) => {
  const { message } = props;
  return (
    <Box
      p={2}
      sx={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
      }}
    >
      {message ? (
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
      ) : null}
    </Box>
  );
};

interface ErrorProps {
  // eslint-disable-next-line react/require-default-props
  message?: string;
}

export default Error;
