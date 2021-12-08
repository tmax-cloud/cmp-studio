import * as React from 'react';
import { ReactElement } from 'react';
import { Badge, styled, Tooltip } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

const SaveButtonIcon = styled(SaveOutlinedIcon)(({ theme }) => ({
  color: theme.palette.toolbar.button,
}));

const SaveButton = (props: SaveButtonProps) => {
  const {
    label = '저장',
    icon = <SaveButtonIcon fontSize="small" />,
    visibleBadge,
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
          <Badge variant="dot" color="primary" invisible={!visibleBadge}>
            {icon}
          </Badge>
        </IconButton>
      </span>
    </Tooltip>
  );
};

interface Props {
  className?: string;
  icon?: ReactElement;
  label?: string;
  visibleBadge: boolean;
  onClick?: (e: MouseEvent) => void;
}

export type SaveButtonProps = Props & IconButtonProps;

export default SaveButton;
