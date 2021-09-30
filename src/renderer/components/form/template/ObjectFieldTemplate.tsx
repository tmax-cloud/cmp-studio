import * as React from 'react';
import * as _ from 'lodash';

import { makeStyles } from '@mui/styles';

import { ObjectFieldTemplateProps } from '@rjsf/core';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

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

// Accordion Object 용
export const ObjectFieldTemplateAccordion = ({
  idSchema,
  properties,
  required,
  schema,
  title,
  uiSchema,
}: ObjectFieldTemplateProps) => {
  return properties?.length ? (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id={`${idSchema.$id}_field-group`}
      >
        <Typography sx={{ font: 'bold', fontSize: '10px' }}>
          {title?.toUpperCase()}
        </Typography>
      </AccordionSummary>
      <AccordionDetails id={`${idSchema.$id}_accordion-content`}>
        {_.map(properties, (p: any) => p.content)}
      </AccordionDetails>
    </Accordion>
  ) : null;
};
