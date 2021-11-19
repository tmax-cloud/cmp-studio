import * as React from 'react';
import { ReactElement } from 'react';
import { styled, Tooltip } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ZoomOutMapOutlinedIcon from '@mui/icons-material/ZoomOutMapOutlined';

const FitScreenButtonIcon = styled(ZoomOutMapOutlinedIcon)(({ theme }) => ({
  color: theme.palette.toolbar.button,
}));

const FitScreenButton = (props: FitScreenButtonProps) => {
  const {
    label = '화면에 맞춤',
    icon = <FitScreenButtonIcon fontSize="small" />,
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

export type FitScreenButtonProps = Props & IconButtonProps;

export default FitScreenButton;
