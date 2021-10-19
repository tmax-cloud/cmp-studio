import React from 'react';
import { Button } from '@mui/material';
import { WidgetProps } from '@rjsf/core';
import TextFieldWidget from './TextFieldWidget';
import TextareaWidget from './TextareaWidget';

const TextWidget = (props: WidgetProps) => {
  const [isTextField, changeTextType] = React.useState(true);
  return (
    <div>
      {isTextField ? (
        <TextFieldWidget {...props} />
      ) : (
        <TextareaWidget {...props} />
      )}
      <Button
        onClick={() => {
          changeTextType(!isTextField);
        }}
      >
        변환
      </Button>
    </div>
  );
};

export default TextWidget;
