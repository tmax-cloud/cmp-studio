import * as React from 'react';
import { getAWSResourceIcon } from './AWSIconFactory';
import AWSIcon from './AWSIcon';
import TerraformIcon from './TerraformIcon';

export const getIconColor = (type: string, opacity: number) => {
  switch (type) {
    case 'data':
      // datasource
      return `rgba(144, 157, 255, ${opacity})`;
    case 'module':
      return `rgba(255, 173, 48, ${opacity})`;
    case 'provider':
      return `rgba(255, 87, 134, ${opacity})`;
    case 'resource':
      return `rgba(0, 183, 189, ${opacity})`;
    case 'output':
    case 'variable':
      return `rgba(129, 60, 243, ${opacity})`;
    default:
      return `rgba(211, 211, 211, ${opacity})`;
  }
};

export const getIcon = (type: string, name: string, size: number) => {
  const color = getIconColor(type, 1);
  const defaultIcon = <TerraformIcon size={size} color={color} />;

  switch (type) {
    case 'data':
      // datasource
      if (name.startsWith('aws')) {
        return getAWSResourceIcon(name, size, color) || defaultIcon;
      }
      return defaultIcon;
    case 'module':
      if (name.startsWith('aws')) {
        return <AWSIcon size={size} color={color} />;
      }
      return defaultIcon;
    case 'provider':
      if (name === 'aws') {
        return <AWSIcon size={size} color={color} />;
      }
      return defaultIcon;
    case 'resource':
      if (name.startsWith('aws')) {
        return getAWSResourceIcon(name, size, color) || defaultIcon;
      }
      return defaultIcon;
    default:
      return defaultIcon;
  }
};
