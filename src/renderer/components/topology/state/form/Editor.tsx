import * as React from 'react';
import * as _ from 'lodash-es';
import { JSONSchema7 } from 'json-schema';
import SaveSection from '@renderer/components/topology/state/form/SaveSection';
import DynamicForm from './index';
import AddFieldSection from './AddFieldSection';

const EditorTab = (props: EditorTabProps) => {
  const { schema, formData, uiSchema } = props;

  const [formState, setFormState] = React.useState(formData);

  React.useEffect(() => {
    setFormState(formData);
  }, [formData]);

  const validateFormData = (obj: any) => {
    let target = Object.keys(
      _.pickBy(obj, (cur) => typeof cur === 'object' && _.isEmpty(cur))
    )[0];
    Object.keys(obj).forEach((currObjKey) => {
      if (typeof obj[currObjKey] === 'object') {
        if (
          !_.isEmpty(obj[currObjKey]) &&
          Object.values(obj[currObjKey]).filter((cur) => !_.isEmpty(cur))
            .length === 0
        ) {
          target = currObjKey;
          return _.omit(obj, [`${currObjKey}`]);
        }
      }
    });
    if (uiSchema[target]?.['ui:dependency'].type === 'parent') {
      return _.omitBy(obj, (cur) => typeof cur === 'object');
      // && _.isEmpty(cur));
    }
    return obj;
  };

  const getCustomedSchema = (schema: JSONSchema7, formState: any): any => {
    if (_.isEmpty(schema) || _.isEmpty(formData)) {
      return schema;
    }
    const currentFormData = validateFormData(formState);
    const filteredValues = _.xor(
      Object.keys(currentFormData),
      Object.keys(formData)
    );

    return !!filteredValues.length
      ? {
          customizedFormData: currentFormData,
          customizedSchema: _.omit(
            schema,
            filteredValues.map((property) => `properties.${property}`)
          ),
        }
      : {
          customizedFormData: currentFormData,
          customizedSchema: schema,
        };
  };

  const { customizedFormData, customizedSchema } = getCustomedSchema(
    schema,
    formState
  );

  const onChange = React.useCallback(({ formData }, e) => {
    setFormState(formData);
  }, []);
  return (
    <>
      <div
        style={{
          paddingTop: '12px',
          height: '663px',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginBottom: '5px',
        }}
      >
        <DynamicForm
          schema={customizedSchema}
          formData={_.defaultsDeep(customizedFormData)}
          uiSchema={uiSchema}
          onChange={onChange}
        />
      </div>
      <AddFieldSection
        formData={customizedFormData}
        sourceSchema={customizedSchema}
      />
      <SaveSection
        saveLabel="저장"
        cancelLabel="취소"
        formState={customizedFormData}
      />
    </>
  );
};

type EditorTabProps = {
  schema: any;
  formData: any;
  uiSchema: any;
};

export default EditorTab;
