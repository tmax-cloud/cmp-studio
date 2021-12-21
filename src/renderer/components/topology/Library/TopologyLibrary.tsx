import * as React from 'react';
import _ from 'lodash';
import { Box, MenuItem, InputLabel, Select, TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useAppSelector } from '@renderer/app/store';
import { selectCodeFileObjects } from '@renderer/features/codeSliceInputSelectors';
import TopologyLibararyItemList from './TopologyLibararyItemList';
import parseJson from '../state/form/utils/json2JsonSchemaParser';

const defaultList = [
  {
    title: 'defaults-provider',
    resourceName: 'provider',
    type: 'default',
  },
  {
    title: 'defaults-variable',
    resourceName: 'variable',
    type: 'default',
  },
  {
    title: 'defaults-output',
    resourceName: 'output',
    type: 'default',
  },
  {
    title: 'defaults-terraform',
    resourceName: 'terraform',
    type: 'default',
  },
  {
    title: 'defaults-locals',
    resourceName: 'locals',
    type: 'default',
  },
];

function seartchByName(searchText: string, name: string) {
  if (name.toUpperCase().indexOf(searchText.toUpperCase()) !== -1) {
    return true;
  } else {
    return false;
  }
}
function isLocalModule(item: Item) {
  return item.isLocalModule;
}
/*
function getModuleList(items: Item[]) {
  //get Module 구현 필요
  //test Module
  items.push({
    provider: 'aws',
    title: 'module-security-group',
    displayName: 'security-group',
    type: 'module',
    source: 'terraform-aws-modules/security-group/aws',
    version: '4.4.0',
  });
}
*/

interface Item {
  path?: string;
  objectCount?: number;
  provider?: string;
  title: string;
  instanceName?: string;
  resourceName: string;
  type: string;
  source?: string | any;
  version?: string;
  isLocalModule?: boolean;
}
let selectedProvider = '';

const TopologyLibrary = () => {
  const [provider, setProvider] = React.useState(selectedProvider || 'aws');
  const [resourceItems, setResourceItems] = React.useState<Item[]>([]);
  const [datasourceItems, setdatasourceItems] = React.useState<Item[]>([]);
  const providerHandleChange = (event: any) => {
    setProvider(event.target.value);
  };
  //const [terraformModuleItems, setTerraformModuleItems] = React.useState<Item[]>([]);
  const [searchText, setSearchText] = React.useState('');
  const searchTextChange = (event: any) => {
    setSearchText(event.target.value);
  };
  const deleteSearchText = (event: any) => {
    setSearchText('');
  };
  const [isSearchResultEmpty, setIsSearchResultEmpty] = React.useState(false);

  /*
  const [openModuleListModal, setOpenModuleListModal] = React.useState(false);
  const [importModule, setImportModule] = React.useState('');

  const handleModuleListModalOpen = (event: any) => {
    setImportModule(event.target?.value || event);
    setOpenModuleListModal(true);
  };
  const handleModuleListModalClose = () => setOpenModuleListModal(false);
  const dispatch = useAppDispatch();
  */

  const objResult: any[] = [];

  // useSelector로 반환한 배열에 대해 반복문을 돌면서 objResult를 변경시킴... refactor할 예정

  useAppSelector(selectCodeFileObjects).forEach(
    (file: { filePath: string; fileJson: any }) => {
      // eslint-disable-next-line guard-for-in
      for (const currKey in file.fileJson) {
        objResult.push(
          ..._.entries(file.fileJson[currKey]).map((object) => ({
            [object[0]]: object[1],
            type: currKey,
          }))
        );
      }
    }
  );

  const itemsList: Item[] = [];
  objResult
    .map((result) => {
      const { type, ...object } = result;
      const resourceName = Object.keys(object)[0];
      const instanceName = Object.keys(object[resourceName])[0];
      const keySource = 'source';
      const source = object[resourceName][keySource];
      const title = type + '-' + resourceName;
      return { type, resourceName, title, instanceName, source };
    })
    .forEach((i: Item) => {
      if (i.type === 'module') {
        const isLocal = i.source.charAt(0) === '.';

        itemsList.push({
          title: i.title,
          source: i.source,
          resourceName: i.resourceName,
          type: i.type,
          isLocalModule: isLocal,
        });
      }
    });

  React.useEffect(() => {
    let schemaMap;

    try {
      schemaMap = parseJson([provider]);
    } catch (e) {
      console.log('Cannot get schema in ' + provider);
      schemaMap = new Map();
    }
    const items: Item[] = [];
    schemaMap.forEach((schema) => {
      const schemaProvider = provider;
      const schemaTitle = schema.title;
      const schemaResourceName = schema.title.split('-')[1];
      const schemaType = schema.title.split('-')[0];
      items.push({
        provider: schemaProvider,
        title: schemaTitle,
        resourceName: schemaResourceName,
        type: schemaType,
      });
    });
    const resourceList: Item[] = [];
    const datasourceList: Item[] = [];

    items.forEach((i: Item) => {
      if (seartchByName(searchText, i.resourceName)) {
        if (i.type === 'resource') {
          resourceList.push({
            provider: i.provider,
            title: i.title,
            resourceName: i.resourceName,
            type: i.type,
          });
        }
        if (i.type === 'data') {
          datasourceList.push({
            provider: i.provider,
            title: i.title,
            resourceName: i.resourceName,
            type: i.type,
          });
        }
      }
    });
    setResourceItems(resourceList);
    setdatasourceItems(datasourceList);
    //setTerraformModuleItems(moduleList);

    if (resourceList.length || datasourceList.length) {
      setIsSearchResultEmpty(false);
    } else {
      setIsSearchResultEmpty(true);
    }
    selectedProvider = provider;
  }, [provider, searchText]);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <InputLabel>프로바이더 선택</InputLabel>
        <Select
          value={provider}
          onChange={providerHandleChange}
          defaultValue="aws"
          fullWidth
          displayEmpty
          style={{ marginTop: '10px' }}
        >
          <MenuItem value="aws">AWS</MenuItem>
          <MenuItem value="tls">TLS</MenuItem>
          {/*
          <MenuItem value="azure">Microsoft Azure</MenuItem>
          <MenuItem value="gcp">Google Cloud Platform</MenuItem>
          <MenuItem value="openstack">OpenStack</MenuItem>
          <MenuItem value="vmware">Vmware vSphere</MenuItem>
          */}
        </Select>
        <div>
          <TextField
            value={searchText}
            placeholder="검색"
            label="검색"
            onChange={searchTextChange}
            style={{ marginTop: '10px', marginBottom: '10px' }}
            fullWidth
          />
          <Delete
            onClick={deleteSearchText}
            style={{
              marginTop: '25px',
              marginBottom: '30px',
              position: 'absolute',
              right: '30px',
              color: 'gray',
            }}
          />
        </div>
        <TopologyLibararyItemList
          items={itemsList.filter((item) => {
            return item?.type === 'module' && isLocalModule(item);
          })}
          title="로컬 모듈"
        />
        <TopologyLibararyItemList
          items={defaultList}
          title="테라폼 디폴트"
          provider={provider}
        />
        {isSearchResultEmpty ? (
          <div>
            <InputLabel>------</InputLabel>
            <InputLabel>{searchText}</InputLabel>
            <InputLabel>검색 결과가 없습니다.</InputLabel>
          </div>
        ) : (
          <>
            {/* 모듈 추후 추가 */}
            {/* <TopologyLibararyItemList items={terraformModuleItems} title="테라폼 모듈" />*/}
            <TopologyLibararyItemList
              items={resourceItems}
              title="테라폼 리소스"
            />
            <TopologyLibararyItemList
              items={datasourceItems}
              title="테라폼 데이터소스"
            />
          </>
        )}
        {/* 테스트용 Object 표시 */}
        {/* 테스트 코드 주석 처리
        <Button onClick={handleModuleListModalOpen} value="test1">
          Modal Test
        </Button>
        <ModuleImportModal
          isOpen={openModuleListModal}
          onClose={handleModuleListModalClose}
          moduleName={importModule}
        />
        */}
      </Box>
    </>
  );
};
export default TopologyLibrary;
