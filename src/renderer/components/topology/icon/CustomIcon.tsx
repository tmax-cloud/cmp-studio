import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

const CustomIcon = (props: CustomIconProps) => {
  const { useRect, size, viewBox, startColor, endColor, transform, d } = props;
  const uid = uuidv4();
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id={`lg-${uid}`}>
          <stop stopColor={startColor} offset="0%" />
          <stop stopColor={endColor} offset="100%" />
        </linearGradient>
      </defs>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        {useRect ? (
          <g fill={`url(#lg-${uid})`}>
            <rect
              x="0"
              y="0"
              width={viewBox || size}
              height={viewBox || size}
            />
          </g>
        ) : null}
        <g transform={transform} fill={useRect ? '#FFFFFF' : `url(#lg-${uid})`}>
          <path d={d} />
        </g>
      </g>
    </svg>
  );
};

interface CustomIconProps {
  useRect?: boolean; // backgrund에 rect 요소를 사용할 지 여부
  size: number;
  viewBox?: number;
  startColor: string;
  endColor: string;
  // eslint-disable-next-line react/require-default-props
  transform?: string;
  d: string;
}

CustomIcon.defaultProps = {
  useRect: true,
  viewBox: 24,
};

export default CustomIcon;
