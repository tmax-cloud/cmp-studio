import * as React from 'react';
import * as _ from 'lodash-es';
import { selectCodeSelectedObjectInfoId } from '@renderer/features/codeSliceInputSelectors';
import { useAppSelector } from '@renderer/app/store';
import SaveSection from '@renderer/components/topology/state/form/SaveSection';
import DynamicForm from './index';
import AddFieldSection from './AddFieldSection';

const EditorTab = (props: EditorTabProps) => {
  const { schema, formData, uiSchema, toggleSidePanel } = props;

  const [formState, setFormState] = React.useState(formData);
  const resoureId = useAppSelector(selectCodeSelectedObjectInfoId);

  React.useEffect(() => {
    setFormState(formData);
  }, [resoureId]);

  const onChange = React.useCallback(({ formData }, e) => {
    console.log('formData: ', formData);
    setFormState(formData);
  }, []);
  return (
    <>
      <div
        style={{
          paddingTop: '12px',
          height: '676px',
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
