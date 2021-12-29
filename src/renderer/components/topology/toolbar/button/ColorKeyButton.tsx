import * as React from 'react';
import { Tooltip } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';

const ColorKeyButton = (props: ColorKeyButtonProps) => {
  const { label = 'Color Key', onClick, className, clicked, ...rest } = props;

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
          sx={{ p: '4px' }}
        >
          <ColorLensOutlinedIcon
            fontSize="small"
            sx={{
              color: clicked ? '#0066CC' : '#5b6c7f',
              backgroundColor: clicked ? '#D6E4FC' : 'transparent',
              p: '4px',
            }}
          />
        </IconButton>
      </span>
    </Tooltip>
  );
};

interface Props {
  className?: string;
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  clicked: boolean;
}

export type ColorKeyButtonProps = Props & IconButtonProps;

export default ColorKeyButton;
