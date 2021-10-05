import * as React from 'react';
import { ReactElement } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

const ZoomInButton = (props: ZoomInButtonProps) => {
  const {
    label = 'Zoom In',
    icon = <ZoomInIcon />,
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
