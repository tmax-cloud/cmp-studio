import React from 'react';
import * as _ from 'lodash-es';
import { Delete } from '@mui/icons-material';
import { FieldTemplateProps } from '@rjsf/core';
import {
  FormControl,
  FormHelperText,
  List,
  ListItem,
  Typography,
  IconButton,
} from '@mui/material';

import WrapIfAdditional from './WrapIfAdditional';

export const FieldTemplate = (props: FieldTemplateProps) => {
  const {
    id,
    children,
    classNames,
    disabled,
    displayLabel,
    hidden,
    label,
    onDropPropertyClick,
    onKeyChange,
    readonly,
    required,
    rawErrors = [],
    rawHelp,
    rawDescription,
    schema,
    uiSchema,
  } = props;
  const firstChildProperty: string[] = [];
  if (hidden) {
    return children;
  }

  const isRemovableProperty = (label: string) => {
    if (
      !label ||
      ('ui:dependency' in uiSchema &&
        uiSchema['ui:dependency'].type === 'child')
    ) {
      return false;
    }
    if (firstChildProperty.findIndex((property) => property === label) < 0) {
      firstChildProperty.push(label);
      return true;
    } else {
      return false;
    }
  };

  return (
    <WrapIfAdditional
      classNames={classNames}
      disabled={disabled}
      id={id + '-' + label}
      label={label}
      onDropPropertyClick={onDropPropertyClick}
      onKeyChange={onKeyChange}
      readonly={readonly}
      required={required}
      schema={schema}
    >
      <FormControl fullWidth error={!!rawErrors.length} required={required}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flexGrow: 9 }}>
            {children}
            {displayLabel && rawDescription ? (
              <Typography variant="caption" color="textSecondary">
                {rawDescription}
              </Typography>
            ) : null}
            {rawErrors.length > 0 && (
              <List dense disablePadding>
                {rawErrors.map((error, i: number) => {
                  return (
                    <ListItem key={i} disableGutters>
                      <FormHelperText id={id}>{error}</FormHelperText>
                    </ListItem>
                  );
                })}
              </List>
            )}
            {rawHelp && <FormHelperText id={id}>{rawHelp}</FormHelperText>}
          </div>
          {isRemovableProperty(label) && (
            <div>
              <IconButton
                aria-label="delete"
                onClick={onDropPropertyClick && onDropPropertyClick(label)}
              >
                <Delete
                  style={{
                    lineHeight: '100%',
                    flexGrow: 1,
                    color: 'gray',
                  }}
                />
              </IconButton>
            </div>
          )}
        </div>
      </FormControl>
    </WrapIfAdditional>
  );
};
