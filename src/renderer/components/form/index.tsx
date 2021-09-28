import * as React from 'react';
import { FormProps } from '@rjsf/core';
import Form from '@rjsf/material-ui';

const DynamicForm = (props) => {
  const { fields = {}, schema = {}, formData } = props;
  return (
    <>
      <Form
        className=""
        fields={{ ...fields }}
        formData={formData}
        schema={schema}
        // onChange={(next) => onChange(next.formData)}
        // onSubmit={onSubmit}
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
