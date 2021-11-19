import * as React from 'react';
import * as _ from 'lodash-es';
import { useSelector } from 'react-redux';
import { Drawer } from '@mui/material';
import { getSchemaMap } from '@renderer/utils/storageAPI';
import { selectCode } from '@renderer/features/codeSliceInputSelectors';
import { selectUiToggleSidePanel } from '@renderer/features/uiSliceInputSelectors';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import FormHeader from './state/form/Header';
import FormTabs from './state/StateTabs';
import preDefinedData from './state/form/utils/preDefinedData';
import { setSelectedSourceSchema } from '../../features/codeSlice';
import { TOPOLOGY_TOOLBAR_HEIGHT } from './toolbar/TopologyToolbar';

export const SIDEPANEL_WIDTH = 500;
// 저장 버튼 누르면 redux objects에 content 덮어씌우기나이ㅓㄻ
const TopologySidePanel = () => {
  const {
    selectedObjectInfo: { id, content, sourceSchema, instanceName },
  } = useSelector(selectCode);

  const dispatch = useAppDispatch();
  const isSidePanelOpen = useAppSelector(selectUiToggleSidePanel);
  const terraformSchemaMap: Map<any, any> = React.useMemo(
    () => getSchemaMap(),
    []
  );
  const currentSchema = _.isEmpty(sourceSchema)
    ? terraformSchemaMap.get(id.replace('/', '-'))
    : sourceSchema;
  // if (_.isEmpty(sourceSchema)) {
  //   return terraformSchemaMap.get(id.replace('/', '-'));
  // }
  // return sourceSchema;

  // if (_.isEmpty(sourceSchema)) {
  //   dispatch(setSelectedSourceSchema(currentSchema));
  // }
  // schema
  const {
    customUISchema = {},
    formData = {},
    fixedSchema = {},
  } = id && preDefinedData(currentSchema, content);
  React.useEffect(() => {
    dispatch(setSelectedSourceSchema(fixedSchema));
  }, [id]);
  return (
    <>
      <Drawer
        PaperProps={{
          sx: {
            width: SIDEPANEL_WIDTH,
            backgroundColor: '#eff2fd',
            top: TOP_NAVBAR_HEIGHT + TOPOLOGY_TOOLBAR_HEIGHT,
            height: `calc(100% - ${TOP_NAVBAR_HEIGHT}px - ${TOPOLOGY_TOOLBAR_HEIGHT}px)`,
            overflow: 'hidden',
          },
        }}
        open={isSidePanelOpen}
        anchor="right"
        variant="persistent"
      >
        <FormHeader title={instanceName} />
        <FormTabs
          schema={fixedSchema}
          formData={formData}
          uiSchema={customUISchema}
        />
      </Drawer>
    </>
  );
};

export default TopologySidePanel;
