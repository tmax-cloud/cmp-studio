import * as React from 'react';
import { FormProps } from '@rjsf/core';
import Form from '@rjsf/material-ui';
import { ObjectFieldTemplate } from './template/ObjectFieldTemplate';

const DynamicForm = (props: FormProps<any>) => {
  const { fields = {}, schema = {} } = props;
  let { uiSchema, formData } = props;
  if (schema.title === 'textareaTest') {
    uiSchema = {
      analyzer_name: { 'ui:widget': 'textarea', classNames: 'pleasedoitagain' },
    };
    formData = {
      analyzer_name: `jsonencode({
      "Statement" = [{
        # This policy allows software running on the EC2 instance to
        # access the S3 API.
        "Action" = "s3:*",
        "Effect" = "Allow",
      }],
    })`,
    };
  }
  // const selectSchema = isTestSchemaActivate(testtest, schema);
  return (
    <>
      <Form
        className=""
        noHtml5Validate
        fields={{ ...fields }}
        ObjectFieldTemplate={ObjectFieldTemplate}
        formData={formData}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={(data) => console.log('result: ', data)}
      />
    </>
  );
};

DynamicForm.displayName = 'DynamicForm';

export default DynamicForm;
