import React from 'react';
import { Button } from '@mui/material';
import { Add, ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';

const mappings: any = {
  remove: Remove,
  plus: Add,
  'arrow-up': ArrowUpward,
  'arrow-down': ArrowDownward,
};

// type IconButtonProps = MuiIconButtonProps & {
//   icon: string;
//   // eslint-disable-next-line react/require-default-props
//   iconProps?: any;
// };

const IconButton = (props: any) => {
  const { icon, onClick, iconProps } = props;
  const IconComp = mappings[icon];
  return (
    <Button size="small" onClick={onClick}>
      <IconComp {...iconProps} />
    </Button>
  );
};

export default IconButton;
