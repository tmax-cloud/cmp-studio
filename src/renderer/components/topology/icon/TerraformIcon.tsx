import * as React from 'react';

const TerraformIcon = (props: TerraformIconProps) => {
  const { size, color } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g fill={color}>
          <rect x="0" y="0" width={32} height={32} />
        </g>
        <path
          fill="#FFFFFF"
          d="M12.042 6.858l8.029 4.59v9.014l-8.029-4.594v-9.01zM20.5 20.415l7.959-4.575V6.887L20.5 11.429v8.986zM3.541 11.01l8.03 4.589V6.59L3.541 2v9.01zM12.042 25.41L20.071 30v-9.043l-8.029-4.589v9.042z"
        />
      </g>
    </svg>
  );
};

interface TerraformIconProps {
  size: number;
  color: string;
}

export default TerraformIcon;
