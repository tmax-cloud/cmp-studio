import * as React from 'react';
import { ReactElement } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const SelectModuleButton = (props: SelectModuleButtonProps) => {
  const {
    label = '모듈',
    icon = <AccountTreeIcon />,
    onClick,
    className,
    ...rest
  } = props;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (typeof onClick === 'function') {
      onClick(event);
    }
  };

  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          aria-label={label}
          className={className}
          onClick={handleClick}
          {...rest}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};

interface Props {
  className?: string;
  icon?: ReactElement;
  label?: string;
  onClick?: (e: MouseEvent) => void;
}

export type SelectModuleButtonProps = Props & IconButtonProps;

export default SelectModuleButton;
