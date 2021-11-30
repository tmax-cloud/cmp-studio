import * as React from 'react';

export const TerraformIconInfo = {
  width: 32,
  height: 32,
  path: 'M12.042 6.858l8.029 4.59v9.014l-8.029-4.594v-9.01zM20.5 20.415l7.959-4.575V6.887L20.5 11.429v8.986zM3.541 11.01l8.03 4.589V6.59L3.541 2v9.01zM12.042 25.41L20.071 30v-9.043l-8.029-4.589v9.042z',
};

const TerraformIcon = (props: TerraformIconProps) => {
  const { size } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${TerraformIconInfo.width} ${TerraformIconInfo.height}`}
    >
      <path fill="#813cf3" d={TerraformIconInfo.path} />
    </svg>
  );
};

interface TerraformIconProps {
  size: number;
}

export default TerraformIcon;
