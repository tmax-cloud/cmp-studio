import * as React from 'react';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ViewBreadcrumbs from './breadcrumb/ViewBreadcrumb';
import SaveButton from './button/SaveButton';
import ZoomInButton from './button/ZoomInButton';
import ZoomOutButton from './button/ZoomOutButton';
import FitScreenButton from './button/FitScreenButton';

const TopologyToolbar = () => {
  return (
    <Toolbar
      style={{ minHeight: 48, paddingLeft: 12, paddingRight: 12 }}
      sx={{
        display: 'flex',
        flexShrink: 0,
        borderBottom: '1px solid',
        borderRight: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        backgroundColor: 'white',
        zIndex: 2,
      }}
    >
      <Grid container justifyContent="space-between">
        <Grid item justifyContent="center">
          <ViewBreadcrumbs />
        </Grid>
        <Grid item sx={{ display: 'flex' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <SaveButton disabled />
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ mx: 1 }}
            />
            <ZoomInButton />
            <ZoomOutButton />
            <FitScreenButton />
          </Box>
        </Grid>
      </Grid>
    </Toolbar>
  );
};

export default TopologyToolbar;
