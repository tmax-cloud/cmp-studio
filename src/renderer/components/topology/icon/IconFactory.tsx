import * as React from 'react';
import { getAWSResourceIcon } from './AWSIconFactory';
import AWSIcon from './AWSIcon';
import TerraformIcon from './TerraformIcon';

export const getIcon = (type: string, name: string, size: number) => {
  const defaultIcon = <TerraformIcon size={size} />;

  switch (type) {
    case 'data':
      // datasource
      if (name.startsWith('aws')) {
        return getAWSResourceIcon(name, size) || defaultIcon;
      }
      return defaultIcon;
    case 'module':
      if (name.startsWith('aws')) {
        return <AWSIcon size={size} />;
      }
      return defaultIcon;
    case 'provider':
      if (name === 'aws') {
        return <AWSIcon size={size} />;
      }
      return defaultIcon;
    case 'resource':
      if (name.startsWith('aws')) {
        return getAWSResourceIcon(name, size) || defaultIcon;
      }
      return defaultIcon;
    default:
      return defaultIcon;
  }
};
