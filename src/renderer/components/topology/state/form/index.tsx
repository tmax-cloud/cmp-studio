import * as React from 'react';
import Form, { FormProps } from '@rjsf/core';
import defaultFields from './fields';
import defaultWidgets from './widgets';
import { ObjectFieldTemplate } from './templates/ObjectFieldTemplate';
import ArrayFieldTemplate from './templates/ArrayFieldTemplate';
import { FieldTemplate } from './templates/FieldTemplate';

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
