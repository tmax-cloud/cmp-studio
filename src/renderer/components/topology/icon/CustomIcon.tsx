import * as React from 'react';

const CustomIcon = (props: CustomIconProps) => {
  const { size, viewBox, color, d } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g fill={color}>
          <rect x="0" y="0" width={viewBox} height={viewBox} />
        </g>
        <path d={d} fill="#FFFFFF" />
      </g>
    </svg>
  );
};

interface CustomIconProps {
  size: number;
  viewBox: number;
  color: string;
  d: string;
}

export default CustomIcon;
