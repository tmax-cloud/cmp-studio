import * as React from 'react';
import * as _ from 'lodash';
import { useAppSelector, useAppDispatch } from '@renderer/app/store';
import { selectTerraformState } from '@renderer/features/commonSliceInputSelectors';
import { Box, Typography } from '@mui/material';

const TopologyCommand = () => {
  const dispatch = useAppDispatch();
  const { status, data, message } = useAppSelector(selectTerraformState);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="overline"
        noWrap={true}
        style={{
          whiteSpace: 'pre-wrap',
          overflow: 'auto',
          width: '100%',
          marginTop: '100px',
          marginLeft: '30px',
        }}
      >
        {status === 'SUCCESS' ? data : message}
      </Typography>
    </Box>
  );
};

export default TopologyCommand;
