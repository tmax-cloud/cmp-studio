import * as React from 'react';
import Form, { JSONSchema7, FormProps } from '@rjsf/material-ui';

const DynamicForm = (props) => {
  const { fields = {}, schema = {}, formData } = props;
  return (
    <>
      <Form
        className=""
        fields={{ ...fields }}
        formData={formData}
        // onChange={(next) => onChange(next.formData)}
        // onSubmit={onSubmit}
        schema={schema}
      />
    </>
  );
};

DynamicForm.displayName = 'DynamicForm';

export default DynamicForm;

type DynamicFormProps = FormProps<any> & {
  errors?: string[];
  ErrorTemplate?: React.FC<{ errors: string[] }>;
  create?: boolean;
};
