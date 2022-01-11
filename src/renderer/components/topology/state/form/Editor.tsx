import * as React from 'react';
import * as _ from 'lodash-es';
import SaveSection from '@renderer/components/topology/state/form/SaveSection';
import { useAppDispatch } from '@renderer/app/store';
import { setSelectedObjectInfo } from '@renderer/features/codeSlice';
import DynamicForm from './index';
import AddFieldSection from './AddFieldSection';

let tempType: any;
let tempResourceName: any;
let tempInstanceName: any;
let tempSourceSchema: any;

const EditorTab = (props: EditorTabProps) => {
  const { schema, formData, uiSchema, id } = props;
  const { type, resourceName, instanceName, sourceSchema } = props;

  if (type && type !== '') {
    tempType = type;
    tempResourceName = resourceName;
    tempInstanceName = instanceName;
    tempSourceSchema = sourceSchema;
  }

  const [formState, setFormState] = React.useState(formData);
  const [formSchema, setFormSchema] = React.useState(schema);
  const [currentId, setCurrentId] = React.useState(id);

  React.useEffect(() => {
    if (currentId !== id) {
      setCurrentId(id);
      setFormState(formData);
    }
    const filteredValues = _.xor(Object.keys(formState), Object.keys(formData));
    setFormSchema(
      _.omit(
        schema,
        filteredValues.map((property) => `properties.${property}`)
      )
    );
  }, [formState, formData, id]);
  const dispatch = useAppDispatch();

  const onChange = React.useCallback(({ formData }, e) => {
    setFormState(formData);

    const object = {
      type: tempType,
      resourceName: tempResourceName,
      instanceName: tempInstanceName,
      content: formData,
      sourceSchema: tempSourceSchema,
    };
    dispatch(setSelectedObjectInfo(object));
  }, []);
  return (
    <>
      <div
        style={{
          paddingTop: '12px',
          height: '530px',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginBottom: '5px',
        }}
      >
        <DynamicForm
          schema={formSchema}
          formData={_.defaultsDeep(formState)}
          uiSchema={uiSchema}
          onChange={onChange}
        />
      </div>
      <AddFieldSection
        formData={formState}
        sourceSchema={formSchema}
        setFormState={setFormState}
      />
      <SaveSection saveLabel="저장" cancelLabel="취소" formState={formState} />
    </>
  );
};

type EditorTabProps = {
  schema: any;
  formData: any;
  uiSchema: any;
  id: string;
  type: any;
  resourceName: any;
  instanceName: any;
  sourceSchema: any;
};

export default EditorTab;
