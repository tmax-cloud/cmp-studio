import * as React from 'react';
import AWSIcon from './AWSIcon';
import { getAWSResourceIcon } from './AWSIconFactory';
import TerraformIcon from './TerraformIcon';

export const getIcon = (name: string, size: number) => {
  const defaultIcon = <TerraformIcon size={size} />;
  if (!name) {
    return defaultIcon;
  }
  if (name.startsWith('aws')) {
    return getAWSResourceIcon(name, size) || <AWSIcon size={size} />;
  }
  return defaultIcon;
};
