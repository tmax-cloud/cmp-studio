import * as React from 'react';

const CustomIcon = (props: CustomIconProps) => {
  const { size, viewBox, color, transform, d } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g fill={color}>
          <rect x="0" y="0" width={viewBox || size} height={viewBox || size} />
        </g>
        <g transform={transform} fill="#FFFFFF">
          <path d={d} />
        </g>
      </g>
    </svg>
  );
};

interface CustomIconProps {
  size: number;
  viewBox?: number;
  color: string;
  // eslint-disable-next-line react/require-default-props
  transform?: string;
  d: string;
}

CustomIcon.defaultProps = {
  viewBox: 24,
};

export default CustomIcon;
