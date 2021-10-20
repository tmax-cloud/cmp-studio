import * as React from 'react';
import { Box, Typography } from '@mui/material';

const Error = (props: ErrorProps) => {
  const { message } = props;
  const errorMsg = 'Oh no! Something went wrong.';
  return (
    <Box p={2}>
      <Typography variant="h1" gutterBottom>
        {errorMsg}
      </Typography>
      <Typography variant="subtitle1">{message}</Typography>
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
