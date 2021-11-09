import * as React from 'react';
import * as _ from 'lodash-es';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useAppSelector } from '@renderer/app/store';
import { selectTerraformState } from '@renderer/features/commonSliceInputSelectors';
const useStyles = makeStyles({
  root: {
    overflow: 'auto',
  },
});

const StateTab = () => {
  const terraFormState = useAppSelector(selectTerraformState);
  return (
    <Typography
      variant="overline"
      noWrap={true}
      style={{ whiteSpace: 'pre-line', overflow: 'auto' }}
    >
      {terraFormState}
    </Typography>
  );
};

export default StateTab;
