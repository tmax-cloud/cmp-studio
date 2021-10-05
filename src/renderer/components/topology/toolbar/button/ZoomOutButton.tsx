import * as React from 'react';
import { ReactElement } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

const ZoomOutButton = (props: ZoomOutButtonProps) => {
  const {
    label = '축소',
    icon = <ZoomOutIcon />,
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

export type ZoomOutButtonProps = Props & IconButtonProps;

export default ZoomOutButton;
