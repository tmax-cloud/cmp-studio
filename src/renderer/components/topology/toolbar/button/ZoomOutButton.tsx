import * as React from 'react';
import { ReactElement } from 'react';
import { styled, Tooltip } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ZoomOutOutlinedIcon from '@mui/icons-material/ZoomOutOutlined';

const ZoomOutButtonIcon = styled(ZoomOutOutlinedIcon)(({ theme }) => ({
  color: theme.palette.toolbar.button,
}));

const ZoomOutButton = (props: ZoomOutButtonProps) => {
  const {
    label = '축소',
    icon = <ZoomOutButtonIcon fontSize="small" />,
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
