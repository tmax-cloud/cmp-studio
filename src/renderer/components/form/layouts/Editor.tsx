import * as React from 'react';
import * as _ from 'lodash-es';
import SaveSection from '@renderer/components/form/layouts/SaveSection';
import DynamicForm from '../index';
import AddFieldSection from './AddFieldSection';

const EditorTab = (props: EditorTabProps) => {
  const { schema, formData, uiSchema, toggleSidePanel } = props;

  const [formState, setFormState] = React.useState(formData);

  const onChange = React.useCallback(({ formData }, e) => {
    console.log('formData: ', formData);
    setFormState(formData);
  }, []);
  return (
    <>
      <div
        style={{
          paddingTop: '12px',
          height: '650px',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <DynamicForm
          schema={schema}
          formData={formState}
          uiSchema={uiSchema}
          onChange={onChange}
        />
      </div>
      <AddFieldSection formData={formData} />
      <SaveSection
        saveLabel="저장"
        cancelLabel="취소"
        toggleSidePanel={toggleSidePanel}
        formState={formState}
      />
    </>
  );
};

type EditorTabProps = {
  schema: any;
  formData: any;
  uiSchema: any;
  toggleSidePanel: any;
};

export default EditorTab;
