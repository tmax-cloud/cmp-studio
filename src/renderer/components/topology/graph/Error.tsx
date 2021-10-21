import * as React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const Error = (props: ErrorProps) => {
  const { message } = props;
  const errorMsg = 'Oh no! Something went wrong.';
  return (
    <Box sx={{ flexGrow: 1 }}>
      <LinearProgress />
      <Box p={2}>
        <Typography variant="h1" gutterBottom>
          {errorMsg}
        </Typography>
        <Typography variant="subtitle1">{message}</Typography>
      </Box>
    </Box>
  );
};

interface ErrorProps {
  message?: string;
}

Error.defaultProps = {
  message: '',
};

export default Error;
