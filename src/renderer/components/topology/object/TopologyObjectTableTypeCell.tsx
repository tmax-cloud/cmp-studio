import * as React from 'react';
import { styled, Typography, Tooltip } from '@mui/material';

const TypeText = styled(Typography)(({ theme }) => ({
  color: theme.palette.object.accordionHeader.primary,
  fontSize: '0.75rem',
  cursor: 'default',
}));

const TopologyObjectTableTypeCell = (props: TypeCellProps) => {
  const { type } = props;
  return (
    <Tooltip title={type}>
      <TypeText noWrap>{type}</TypeText>
    </Tooltip>
  );
};

interface TypeCellProps {
  type: string;
}

export default TopologyObjectTableTypeCell;
