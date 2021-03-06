import * as React from 'react';
import * as _ from 'lodash-es';
import { useSelector } from 'react-redux';
import { Drawer } from '@mui/material';
import { getSchemaMap } from '@renderer/utils/storageAPI';
import { selectCodeSelectedObjectInfo } from '@renderer/features/codeSliceInputSelectors';
import { selectUiToggleSidePanel } from '@renderer/features/uiSliceInputSelectors';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { getObjectDataType, getId } from '@renderer/types/terraform';
import { TOP_NAVBAR_HEIGHT } from '../MainNavbar';
import FormHeader from './state/form/Header';
import FormTabs from './state/StateTabs';
import preDefinedData from './state/form/utils/preDefinedData';
import { setSelectedSourceSchema, ObjcectInfo } from '../../features/codeSlice';
import { TOPOLOGY_TOOLBAR_HEIGHT } from './toolbar/TopologyToolbar';
export const SIDEPANEL_WIDTH = 500;
// 저장 버튼 누르면 redux objects에 content 덮어씌우기나이ㅓㄻ
const TopologySidePanel = () => {
  const {
    type,
    resourceName,
    content,
    sourceSchema,
    instanceName,
  }: ObjcectInfo = useSelector(selectCodeSelectedObjectInfo);

  const id = getId(type, resourceName, instanceName);

  const dispatch = useAppDispatch();
  const isSidePanelOpen = useAppSelector(selectUiToggleSidePanel);
  const terraformSchemaMap: Map<any, any> = React.useMemo(
    () => getSchemaMap(),
    []
  );
  const jsonSchema = terraformSchemaMap.get(id);
  // const currentSchema = _.isEmpty(sourceSchema) ? jsonSchema : sourceSchema;
  const {
    customUISchema = {},
    formData = {},
    fixedSchema = {},
  } = React.useMemo(
    () => preDefinedData(jsonSchema, content, type),
    [jsonSchema, content, type]
  );
  const title = React.useMemo(() => {
    if (getObjectDataType[type] === 'ONE_DEPTH_DATA_TYPE') {
      return type;
    } else {
      return instanceName;
    }
  }, [type, instanceName]);
  React.useEffect(() => {
    dispatch(setSelectedSourceSchema(fixedSchema));
  }, [instanceName]);
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
        <FormHeader title={title} resourceName={resourceName} type={type} />
        <FormTabs
          schema={fixedSchema}
          formData={formData}
          uiSchema={customUISchema}
          id={id}
          type={type}
          resourceName={resourceName}
          instanceName={instanceName}
          sourceSchema={sourceSchema}
        />
      </Drawer>
    </>
  );
};

export default TopologySidePanel;
