import * as React from 'react';
import { ReactElement } from 'react';
import { styled, Tooltip } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import LocalAirportOutlinedIcon from '@mui/icons-material/LocalAirportOutlined';

const TerraformPlanButtonIcon = styled(LocalAirportOutlinedIcon)(
  ({ theme }) => ({
    color: theme.palette.toolbar.button,
  })
);

const TerraformPlanButton = (props: TerraformPlanButtonProps) => {
  const {
    label = '플랜',
    icon = <TerraformPlanButtonIcon fontSize="small" />,
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

export type TerraformPlanButtonProps = Props & IconButtonProps;

export default TerraformPlanButton;
