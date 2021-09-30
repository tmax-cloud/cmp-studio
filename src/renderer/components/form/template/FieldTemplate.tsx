import * as React from 'react';
import * as _ from 'lodash';
import { JSONSchema6 } from '@rjsf/core';

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
export type FieldTemplateProps = {
  id: string;
  classNames: string;
  label: string;
  description: React.ReactElement;
  rawDescription: string;
  children: React.ReactElement;
  errors: React.ReactElement;
  rawErrors: string[];
  help: React.ReactElement;
  rawHelp: string;
  hidden: boolean;
  required: boolean;
  readonly: boolean;
  disabled: boolean;
  displayLabel: boolean;
  fields: any[];
  schema: JSONSchema6;
  uiSchema: any;
  formContext: any;
};
