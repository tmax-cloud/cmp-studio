import * as React from 'react';
import { ReactElement } from 'react';
import { styled, Tooltip } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';

const SelectModuleButtonIcon = styled(AccountTreeOutlinedIcon)(({ theme }) => ({
  color: theme.palette.toolbar.button,
}));

const SelectModuleButton = (props: SelectModuleButtonProps) => {
  const {
    label = '모듈',
    icon = <SelectModuleButtonIcon fontSize="small" />,
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
