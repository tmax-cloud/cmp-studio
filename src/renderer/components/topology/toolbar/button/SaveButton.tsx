import * as React from 'react';
import { ReactElement } from 'react';
import { styled, Tooltip } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

const SaveButtonIcon = styled(SaveOutlinedIcon)(({ theme }) => ({
  color: theme.palette.toolbar.button,
}));

const SaveButton = (props: SaveButtonProps) => {
  const {
    label = '저장',
    icon = <SaveButtonIcon fontSize="small" />,
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
