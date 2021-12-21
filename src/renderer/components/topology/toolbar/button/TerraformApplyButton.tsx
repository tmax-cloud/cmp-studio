import * as React from 'react';
import { ReactElement } from 'react';
import { styled, Tooltip } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

const TerraformApplyButtonIcon = styled(CheckOutlinedIcon)(({ theme }) => ({
  color: theme.palette.toolbar.button,
}));

const TerraformApplyButton = (props: TerraformApplyButtonProps) => {
  const {
    label = '어플라이',
    icon = <TerraformApplyButtonIcon fontSize="small" />,
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

export type TerraformApplyButtonProps = Props & IconButtonProps;

export default TerraformApplyButton;
