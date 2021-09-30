import * as React from 'react';
import { FormProps } from '@rjsf/core';
import Form from '@rjsf/material-ui';
import { ObjectFieldTemplate } from './template/ObjectFieldTemplate';

const DynamicForm = (props: FormProps<any>) => {
  const { fields = {}, schema = {}, formData, testtest } = props;
  const textareaTestSchema = {
    properties: {
      analyzer_name: {
        type: 'string',
      },
      arn: {
        type: 'string',
        computed: true,
      },
      id: {
        type: 'string',
        optional: true,
        computed: true,
      },
      type: {
        type: 'string',
        optional: true,
      },
    },
    title: 'resource-aws_accessanalyzer_analyzer',
    required: ['analyzer_name'],
  };
  const arrayTestSchema = {
    properties: {
      singleString: {
        type: 'array',
        optional: true,
        items: {
          type: 'string',
        },
      },
      multiString: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            test1: {
              type: 'string',
            },
            test2: {
              type: 'string',
            },
          },
        },
      },
      nestedObject: {
        type: 'array',
        items: {
          title: 'items',
          type: 'object',
          properties: {
            obj1: {
              type: 'object',
              properties: {
                obj1_child_str1: {
                  type: 'string',
                },
                obj1_child_str2: {
                  type: 'string',
                },
                obj1_child_obj1: {
                  type: 'object',
                  properties: {
                    obj1_child_obj1_child_str1: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    title: 'provider-aws',
    type: 'object',
    additionalProperties: {
      type: 'string',
    },
    required: ['singleString'],
  };
  return (
    <>
      <Form
        className=""
        noHtml5Validate
        fields={{ ...fields }}
        ObjectFieldTemplate={ObjectFieldTemplate}
        // ArrayFieldTemplate={ArrayFieldTemplate}
        // FieldTemplate={FieldTemplate}
        formData={formData}
        schema={testtest ? arrayTestSchema : schema}
        // formContext={{
        //   semantic: {
        //     wrapLabel: true,
        //     wrapContent: true,
        //   },
        // }}
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
