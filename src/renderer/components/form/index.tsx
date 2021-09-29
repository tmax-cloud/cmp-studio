import * as React from 'react';
import { FormProps } from '@rjsf/core';
import Form from '@rjsf/material-ui';
import { ObjectFieldTemplate, FieldTemplate } from './template';

const DynamicForm = (props: FormProps<any>) => {
  const { fields = {}, schema = {}, formData } = props;
  return (
    <>
      <Form
        className=""
        noHtml5Validate
        fields={{ ...fields }}
        ObjectFieldTemplate={ObjectFieldTemplate}
        FieldTemplate={FieldTemplate}
        formData={formData}
        schema={schema}
        onSubmit={(data) => console.log('result: ', data)}
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
