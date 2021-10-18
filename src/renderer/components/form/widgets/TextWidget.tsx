import React from 'react';
import { WidgetProps } from '@rjsf/core';
import TextareaWidget from './TextareaWidget';

const TextWidget = (props: WidgetProps) => {
  return (
    <div>
      <TextareaWidget {...props} />
    </div>
  );
};

export default TextWidget;
