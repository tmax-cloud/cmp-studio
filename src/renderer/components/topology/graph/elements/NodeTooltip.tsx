import * as React from 'react';
import { Box, Typography } from '@mui/material';

const NodeTooltip = (props: NodeTooltipProps) => {
  const { name, type } = props;
  return (
    <Box
      px={1}
      py={0.5}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 120,
      }}
    >
      {type ? (
        <Typography
          sx={{
            color: '#fff',
            fontSize: '0.6875rem',
            fontFamily: 'Noto Sans KR',
            fontWeight: 'lighter',
            opacity: 0.8,
          }}
        >
          {type}
        </Typography>
      ) : null}
      <Typography
        sx={{
          color: '#fff',
          fontSize: '0.8125rem',
          fontFamily: 'Noto Sans KR',
          fontWeight: 'lighter',
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};

interface NodeTooltipProps {
  name: string;
  // eslint-disable-next-line react/require-default-props
  type?: string;
}

export default NodeTooltip;
