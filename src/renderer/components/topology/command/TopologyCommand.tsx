import * as React from 'react';
import * as _ from 'lodash';
import { useAppSelector } from '@renderer/app/store';
import { selectCommandTerraformResponseData } from '@renderer/features/commandSliceInputSelectors';
import { Box, Typography } from '@mui/material';
import { useTerraformApplyOutput } from '@renderer/hooks/useTerraformApplyOutput';

const INIT_STRING = '데이터가 없습니다.';

const TopologyCommand = () => {
  const { status, data, message } = useAppSelector(
    selectCommandTerraformResponseData
  );

  const print = (status: string, data: string, message: string) => {
    switch (status) {
      case 'SUCCESS': {
        return data;
      }
      case 'ERROR': {
        return message;
      }
      case 'INIT': {
        return INIT_STRING;
      }
      default:
        return '';
    }
  };

  useTerraformApplyOutput();
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
        {print(status, data, message)}
      </Typography>
    </Box>
  );
};

export default TopologyCommand;
