import * as React from 'react';
import AWSIcon, { AWSIconInfo } from './AWSIcon';
import { getAWSResourceIcon } from './AWSIconFactory';
import TerraformIcon, { TerraformIconInfo } from './TerraformIcon';

// get icon component
export const getIcon = (name: string, size: number) => {
  const defaultIcon = <TerraformIcon size={size} />;
  if (!name) {
    return defaultIcon;
  }
  if (name.startsWith('aws')) {
    return getAWSResourceIcon(name, size)?.icon || <AWSIcon size={size} />;
  }
  return defaultIcon;
};

// get icon info (그래프에서 사용)
export const getIconInfo = (name: string) => {
  const defaultIconInfo = TerraformIconInfo;
  if (!name) {
    return defaultIconInfo;
  }
  if (name.startsWith('aws')) {
    return getAWSResourceIcon(name)?.info || AWSIconInfo;
  }
  return defaultIconInfo;
};
