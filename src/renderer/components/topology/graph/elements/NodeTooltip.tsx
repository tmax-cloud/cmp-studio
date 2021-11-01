import * as React from 'react';
import { Box, Typography } from '@mui/material';

const NodeTooltip = (props: NodeTooltipProps) => {
  const { name, type } = props;
  return (
    <Box
      p={1}
      pt={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 120,
      }}
    >
      {type ? (
        <Typography
          variant="overline"
          sx={{ fontSize: '0.625rem', color: '#ab8037' }}
        >
          {type}
        </Typography>
      ) : null}
      <Typography sx={{ fontSize: '0.875rem', lineHeight: 1 }}>
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
