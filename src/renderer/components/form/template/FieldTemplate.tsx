import * as React from 'react';
import * as _ from 'lodash-es';
import { FieldTemplateProps } from '@rjsf/core';

// eslint-disable-next-line import/no-cycle
import { AtomicFieldTemplate } from './AtomicFieldTemplate';

export const FieldTemplate: React.FC<FieldTemplateProps> = (props) => {
  const {
    hidden,
    schema = {},
    children,
    uiSchema = {},
    formContext = {},
  } = props;
  const isGroup = 'properties' in schema;
  return isGroup ? children : <AtomicFieldTemplate {...props} />;
};
