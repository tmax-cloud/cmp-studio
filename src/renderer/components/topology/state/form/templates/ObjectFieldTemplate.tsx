import * as React from 'react';
import * as _ from 'lodash-es';

import { makeStyles } from '@mui/styles';

import { ObjectFieldTemplateProps, utils } from '@rjsf/core';
import { Grid } from '@mui/material';
import AddButton from '../AddButton';

const { canExpand } = utils;

const useStyles = makeStyles({
  root: {
    '& .MuiPaper-elevation2': {
      overflow: 'auto',
    },
  },
});

export const ObjectFieldTemplate = ({
  DescriptionField,
  description,
  TitleField,
  title,
  properties,
  required,
  disabled,
  readonly,
  uiSchema,
  idSchema,
  schema,
  formData,
  onAddClick,
}: ObjectFieldTemplateProps) => {
  const classes = useStyles();

  return (
    <>
      {(uiSchema['ui:title'] || title) && (
        <TitleField
          id={`${idSchema.$id}-title`}
          title={title}
          required={required}
        />
      )}
      {description && (
        <DescriptionField
          id={`${idSchema.$id}-description`}
          description={description}
        />
      )}
      <Grid container spacing={2} className={classes.root}>
        {properties.map((element, index) =>
          // Remove the <Grid> if the inner element is hidden as the <Grid>
          // itself would otherwise still take up space.
          element.hidden ? (
            element.content
          ) : (
            <Grid item xs={12} key={index} style={{ marginBottom: '10px' }}>
              {element.content}
            </Grid>
          )
        )}
        {canExpand(schema, uiSchema, formData) && (
          <Grid container>
            <Grid item>
              <AddButton
                className="object-property-expand"
                onClick={onAddClick(schema)}
                disabled={disabled || readonly}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};
