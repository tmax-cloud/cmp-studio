import * as React from 'react';
import { ReactElement } from 'react';
import { styled, Tooltip } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';

const ZoomInButtonIcon = styled(ZoomInOutlinedIcon)(({ theme }) => ({
  color: theme.palette.toolbar.button,
}));

const ZoomInButton = (props: ZoomInButtonProps) => {
  const {
    label = '확대',
    icon = <ZoomInButtonIcon fontSize="small" />,
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

export type ZoomInButtonProps = Props & IconButtonProps;

export default ZoomInButton;
