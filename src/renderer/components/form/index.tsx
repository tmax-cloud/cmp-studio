import * as React from 'react';
import Form, { FormProps } from '@rjsf/core';
import defaultFields from './fields';
// import Form from '@rjsf/material-ui';
import { ObjectFieldTemplate } from './template/ObjectFieldTemplate';
import { FieldTemplate } from './template/FieldTemplate';

// eslint-disable-next-line consistent-return
const setPredefinedData = (title: string) => {
  switch (title) {
    case 'textareaTest':
      return {
        formData: {
          analyzer_name: `jsonencode({
        "Statement" = [{
          # This policy allows software running on the EC2 instance to
          # access the S3 API.
          "Action" = "s3:*",
          "Effect" = "Allow",
        }],
      })`,
        },
        uiSchema: {
          analyzer_name: {
            'ui:widget': 'textarea',
            classNames: 'pleasedoitagain',
          },
        },
      };
    case 'resource-aws_iam_policy':
      return {
        formData: {
          description: 'My test policy',
          name: 'test_policy',
          path: '/',
          policy: `\${jsonencode({\r\n    Version = "2012-10-17"\r\n    Statement = [\r\n      {\r\n        Action = [\r\n          "ec2:Describe*",\r\n        ]\r\n        Effect   = "Allow"\r\n        Resource = "*"\r\n      },\r\n    ]\r\n  })}`,
        },
      };
    default:
  }
};

const DynamicForm = (props: FormProps<any>) => {
  const { fields = {}, schema = {} } = props;
  const { uiSchema, formData } =
    setPredefinedData(schema.title as string) || props;

  // const selectSchema = isTestSchemaActivate(testtest, schema);
  return (
    <>
      <Form
        className=""
        noHtml5Validate
        // FieldTemplate={FieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        formData={formData}
        fields={{ ...defaultFields }}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={(data) => console.log('result: ', data)}
      />
    </>
  );
};

DynamicForm.displayName = 'DynamicForm';

export default DynamicForm;
