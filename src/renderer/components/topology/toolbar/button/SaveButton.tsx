import * as React from 'react';
import { ReactElement } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';

const SaveButton = (props: SaveButtonProps) => {
  const {
    label = '저장',
    icon = <SaveIcon />,
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

export type SaveButtonProps = Props & IconButtonProps;

export default SaveButton;
