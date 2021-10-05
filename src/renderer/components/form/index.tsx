import * as React from 'react';
import Form, { FormProps } from '@rjsf/core';
import defaultFields from './fields';
// import defaultWidgets from './widgets';
import { ObjectFieldTemplate } from './template/ObjectFieldTemplate';
import ArrayFieldTemplate from './template/ArrayFieldTemplate';
import { FieldTemplate } from './template/FieldTemplate';

const setPredefinedData = (title: string): { uiSchema: any; formData: any } => {
  let predefinedData = { uiSchema: {}, formData: {} };
  switch (title) {
    case 'textareaTest':
      predefinedData = {
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
      break;
    case 'resource-aws_iam_policy':
      predefinedData = {
        uiSchema: {},
        formData: {
          description: 'My test policy',
          name: 'test_policy',
          path: '/',
          policy: `\${jsonencode({\r\n    Version = "2012-10-17"\r\n    Statement = [\r\n      {\r\n        Action = [\r\n          "ec2:Describe*",\r\n        ]\r\n        Effect   = "Allow"\r\n        Resource = "*"\r\n      },\r\n    ]\r\n  })}`,
        },
      };
      break;
    default:
  }
  return predefinedData;
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
        FieldTemplate={FieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        formData={formData}
        ArrayFieldTemplate={ArrayFieldTemplate}
        fields={{ ...defaultFields, ...fields }}
        // widgets={{ ...defaultWidgets }}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={(data) => console.log('result: ', data)}
      />
    </>
  );
};

DynamicForm.displayName = 'DynamicForm';

export default DynamicForm;
