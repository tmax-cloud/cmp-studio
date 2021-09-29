import * as React from 'react';
import * as _ from 'lodash';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { fontSize } from '@mui/system';

export const AtomicFieldTemplate = ({
  children,
  id,
  label,
  rawErrors,
  description,
  required,
  schema,
  uiSchema,
}) => {
  return (
    <div id={`${id}_field`} className="form-group">
      {/* <label className="form-label" htmlFor={id}>
        {label}
      </label> */}
      {children}
      {description}
    </div>
  );
};

export const FieldTemplate = (props) => {
  const {
    hidden,
    schema = {},
    children,
    uiSchema = {},
    formContext = {},
  } = props;
  // const type = getSchemaType(schema);
  // const [dependencyMet, setDependencyMet] = React.useState(true);
  // React.useEffect(() => {
  //   const { dependency } = getUiOptions(uiSchema ?? {}) as DependencyUIOption; // Type defs for this function are awful
  //   if (dependency) {
  //     setDependencyMet(dependency.value === _.get(formContext.formData ?? {}, ['spec', ...(dependency.path ?? [])], '').toString());
  //   }
  // }, [uiSchema, formContext]);

  // if (hidden || !dependencyMet) {
  //   return null;
  // }
  const isGroup = 'properties' in schema;
  return isGroup ? children : <AtomicFieldTemplate {...props} />;
};

export const ObjectFieldTemplate = ({
  idSchema,
  properties,
  required,
  schema,
  title,
  uiSchema,
}) => {
  const normalProperties = _.groupBy(properties ?? []);
  return properties?.length ? (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id={`${idSchema.$id}_field-group`}
      >
        <Typography sx={{ font: 'bold', fontSize: '10px' }}>
          {title.toUpperCase()}
        </Typography>
      </AccordionSummary>
      <AccordionDetails id={`${idSchema.$id}_accordion-content`}>
        {_.map(properties, (p) => p.content)}
      </AccordionDetails>
    </Accordion>
  ) : null;
};
