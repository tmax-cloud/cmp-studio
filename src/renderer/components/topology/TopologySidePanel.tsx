import * as React from 'react';
import * as _ from 'lodash-es';
import { useSelector } from 'react-redux';
import { Drawer } from '@mui/material';
import { getSchemaMap } from '@renderer/utils/storageAPI';
import { selectCode } from '@renderer/features/codeSliceInputSelectors';
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import FormHeader from '../form/layouts/Header';
import FormTabs from '../form/layouts/Tabs';
import preDefinedData from '../form/utils/preDefinedData';

export const SIDEPANEL_WIDTH = 500;
// 저장 버튼 누르면 redux objects에 content 덮어씌우기나이ㅓㄻ
const TopologySidePanel: React.FC<TopologySidePanelProps> = ({
  isSidePanelOpen,
  toggleSidePanel,
}) => {
  const {
    selectedObjectInfo: { id, content },
  } = useSelector(selectCode);

  // schema
  const terraformSchemaMap = getSchemaMap();
  const currentSchema: any = terraformSchemaMap.get(id);
  console.log('current schema: ', currentSchema);
  const {
    customUISchema = {},
    formData = {},
    fixedSchema = {},
  } = id && preDefinedData(currentSchema, content);

  return (
    <>
      <Drawer
        PaperProps={{
          sx: {
            width: SIDEPANEL_WIDTH,
            backgroundColor: '#eff2fd',
            top: TOP_NAVBAR_HEIGHT,
            height: `calc(100% - ${TOP_NAVBAR_HEIGHT}px)`,
          },
        }}
        open={isSidePanelOpen}
        anchor="right"
        variant="persistent"
      >
        <FormHeader title={id} toggleSidePanel={toggleSidePanel} />
        <FormTabs
          schema={fixedSchema}
          formData={formData}
          uiSchema={customUISchema}
        />
      </Drawer>
    </>
  );
};

type TopologySidePanelProps = {
  isSidePanelOpen: boolean;
  toggleSidePanel: any;
};

export default TopologySidePanel;
