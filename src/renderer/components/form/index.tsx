import * as React from 'react';
import Form, { FormProps } from '@rjsf/core';
import defaultFields from './fields';
import defaultWidgets from './widgets';
import { ObjectFieldTemplate } from './template/ObjectFieldTemplate';
import ArrayFieldTemplate from './template/ArrayFieldTemplate';
import { FieldTemplate } from './template/FieldTemplate';

const DynamicForm = (props: FormProps<any>) => {
  const {
    fields = {},
    schema = {},
    formData = {},
    uiSchema = {},
    onChange,
  } = props;
  return (
    <>
      <Form
        className=""
        noHtml5Validate
        FieldTemplate={FieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        formData={formData}
        ArrayFieldTemplate={ArrayFieldTemplate}
        fields={{ ...defaultFields, ...fields }}
        widgets={{ ...defaultWidgets }}
        onChange={onChange}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={(data) => console.log('result: ', data)}
      />
    </>
  );
};

DynamicForm.displayName = 'DynamicForm';

export default DynamicForm;
