import React from 'react';

import TextField, {
  StandardTextFieldProps as TextFieldProps,
} from '@mui/material/TextField';

import { WidgetProps, utils } from '@rjsf/core';

const { getDisplayLabel } = utils;

type CustomWidgetProps = WidgetProps & {
  options: any;
};

const TextFieldWidget = ({
  id,
  placeholder,
  required,
  readonly,
  disabled,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  autofocus,
  options,
  schema,
  uiSchema,
  rawErrors = [],
  formContext,
  registry, // pull out the registry so it doesn't end up in the textFieldProps
  ...textFieldProps
}: CustomWidgetProps) => {
  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    return onChange(value === '' ? options.emptyValue : value);
  };
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

  const displayLabel = getDisplayLabel(schema, uiSchema);

  return (
    <div>
      <TextField
        id={id}
        placeholder={placeholder}
        label={displayLabel ? label || schema.title : false}
        autoFocus={autofocus}
        required={required}
        disabled={disabled || readonly}
        value={value || value === 0 ? value : ''}
        error={rawErrors.length > 0}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        {...(textFieldProps as TextFieldProps)}
      />
    </div>
  );
};

export default TextFieldWidget;
