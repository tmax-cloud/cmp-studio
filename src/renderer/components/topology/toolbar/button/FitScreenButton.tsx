import * as React from 'react';
import { ReactElement } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import FitScreenIcon from '@mui/icons-material/FitScreen';

const FitScreenButton = (props: FitScreenButtonProps) => {
  const {
    label = '화면에 맞춤',
    icon = <FitScreenIcon />,
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
