import React from 'react';

import { WidgetProps } from '@rjsf/core';
import { makeStyles } from '@mui/styles';

import TextField from '@mui/material/TextField';

type CustomWidgetProps = WidgetProps & {
  options: any;
};
const useStyles = makeStyles({
  root: {
    '& .css-1sqnrkk-MuiInputBase-input-MuiOutlinedInput-input': {
      resize: 'vertical',
      minHeight: '23px',
    },
  },
});

const TextWidget = ({
  id,
  placeholder,
  value,
  required,
  disabled,
  autofocus,
  label,
  readonly,
  onBlur,
  onFocus,
  onChange,
  options,
  schema,
  rawErrors = [],
}: CustomWidgetProps) => {
  const classes = useStyles();
  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    onChange(value === '' ? options.emptyValue : value);
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

  return (
    <TextField
      id={id}
      sx={{ width: '100%' }}
      className={classes.root}
      label={label || schema.title}
      placeholder={placeholder}
      disabled={disabled || readonly}
      value={value || value === 0 ? value : ''}
      required={required}
      autoFocus={autofocus}
      multiline
      rows={1}
      error={rawErrors.length > 0}
      onChange={_onChange}
      onBlur={_onBlur}
      onFocus={_onFocus}
    />
  );
};

export default TextWidget;
