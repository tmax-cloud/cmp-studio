import * as React from 'react';
import * as _ from 'lodash-es';

import { makeStyles } from '@mui/styles';

import { ObjectFieldTemplateProps } from '@rjsf/core';
import { Grid } from '@mui/material';

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
      <Grid
        container
        spacing={2}
        className={classes.root}
        style={{ marginLeft: '10px' }}
      >
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
      </Grid>
    </>
  );
};
