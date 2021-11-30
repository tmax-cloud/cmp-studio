import * as React from 'react';
import * as _ from 'lodash-es';
import { Box, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAppDispatch } from '@renderer/app/store';
import { setSidePanel } from '@renderer/features/uiSlice';
import { getIcon } from '../../icon/IconFactory';

const FormHeader = (props: FormHeaderProps) => {
  const { title, resourceName } = props;
  const dispatch = useAppDispatch();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ margin: '16px', display: 'flex' }}>
        {getIcon(resourceName || title, 32)}
        <Typography variant="h3" sx={{ ml: 1.5 }}>
          {title}
        </Typography>
      </Box>
      <IconButton
        aria-label="Close"
        onClick={() => {
          dispatch(setSidePanel(false));
        }}
      >
        <Close />
      </IconButton>
    </div>
  );
};

type FormHeaderProps = {
  title: string;
  resourceName: string;
};

export default FormHeader;
