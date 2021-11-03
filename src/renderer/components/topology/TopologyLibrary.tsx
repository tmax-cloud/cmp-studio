import * as React from 'react';
import {
  Box,
  Button,
  List,
  MenuItem,
  InputLabel,
  Select,
  TextField,
} from '@mui/material';
import {
  AcUnit,
  FilterVintage,
  Storage,
  Mode,
  Circle,
  ArrowDownward,
  ArrowUpward,
  Delete,
  Explore,
} from '@mui/icons-material';
import { useAppSelector } from '@renderer/app/store';
import { selectCode } from '@renderer/features/codeSliceInputSelectors';
import parseJson from '../form/utils/json2JsonSchemaParser';
import { ModuleImportModal } from './modal';

const getIcon = (type: string) => {
  switch (type) {
    case 'provider':
      return <AcUnit />;
    case 'resource':
      return <FilterVintage />;
    case 'datasource':
      return <Storage />;
    case 'module':
      return <Mode />;
    case 'localModule':
      return <Explore />;
    default:
      return <Circle />;
  }
};

function seartchDisplayName(searchText: string, displayName: string) {
  if (displayName.toUpperCase().indexOf(searchText.toUpperCase()) !== -1) {
    return true;
  } else {
    return false;
  }
}

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
  items.push({
    provider: 'aws',
    title: 'module-consul',
    displayName: 'consul',
    type: 'module',
    source: 'hashicorp/consul/aws',
    version: '0.11.0',
  });
}

function openSidePanel(obj: { id: string }) {
  alert('OpenForm ' + obj.id);
}
function clickLocalModule(afterAction: any, obj: { id: string }) {
  alert('Local Module ' + obj.id);
  afterAction(obj);
}
function clickDefault(afterAction: any, obj: { id: string }) {
  alert('Default ' + obj.id);
  afterAction(obj);
}
function clickModule(afterAction: any, obj: { id: string }) {
  alert('Module ' + obj.id);
  afterAction(obj);
}
function clickResource(afterAction: any, obj: { id: string }) {
  alert('Resource ' + obj.id);
  afterAction(obj);
}
function clickDatasource(afterAction: any, obj: { id: string }) {
  alert('Data Source ' + obj.id);
  afterAction(obj);
}

const ShowItemList: React.FC<ShowItemListProps> = ({
  items,
  title,
  clickAction,
  afterAction,
}) => {
  const [isShow, setIsShow] = React.useState(false);

  return (
    <>
      {items.length > 0 && (
        <>
          <Button
            onClick={() => setIsShow(!isShow)}
            color="inherit"
            fullWidth
            style={{ textAlign: 'left', alignContent: 'left' }}
          >
            {title}
            {'(' + items.length + ')'}
            <span style={{ marginLeft: '10px', float: 'left' }}>
              {isShow ? <ArrowUpward /> : <ArrowDownward />}
            </span>
          </Button>
          <List>
            {isShow &&
              items.map((item, index) => {
                return (
                  <Button
                    key={`button-${index}`}
                    startIcon={getIcon(item.type)}
                    onClick={() => {
                      clickAction(afterAction, { id: item.title });
                    }}
                    fullWidth
                    style={{ textAlign: 'left' }}
                  >
                    {item.type === 'localModule' ? item.path : item.displayName}
                  </Button>
                );
              })}
          </List>
        </>
      )}
    </>
  );
};
type ShowItemListProps = {
  items: Item[];
  title: string;
  clickAction: any;
  afterAction: any;
};

interface Item {
  path?: string;
  objectCount?: number;
  provider?: string;
  title: string;
  displayName: string;
  type: string;
  source?: string;
  version?: string;
}
//const TopologyLibrary: React.FC<TopologyLibraryProps> = ({ items }) => {
const TopologyLibrary = () => {
  const [provider, setProvider] = React.useState('aws');
  const [defaltItems, setDefaltItems] = React.useState<Item[]>([]);
  const [resourceItems, setResourceItems] = React.useState<Item[]>([]);
  const [datasourceItems, setdatasourceItems] = React.useState<Item[]>([]);
  const providerHandleChange = (event: any) => {
    setProvider(event.target.value);
  };
  const [localModuleItems, setLocalModuleItems] = React.useState<Item[]>([]);
  const [terraformModuleItems, setTerraformModuleItems] = React.useState<
    Item[]
  >([]);
  const [searchText, setSearchText] = React.useState('');
  const searchTextChange = (event: any) => {
    setSearchText(event.target.value);
  };
  const deleteSearchText = (event: any) => {
    setSearchText('');
  };
  const [isSearchResultEmpty, setIsSearchResultEmpty] = React.useState(false);

  const [openModuleListModal, setOpenModuleListModal] = React.useState(false);
  const [importModule, setImportModule] = React.useState('');

  const handleModuleListModalOpen = (event: any) => {
    setImportModule(event.target?.value || event);
    setOpenModuleListModal(true);
  };
  const handleModuleListModalOpen2 = (obj: { id: string }) => {
    setImportModule(obj.id);
    setOpenModuleListModal(true);
  };
  const handleModuleListModalClose = () => setOpenModuleListModal(false);

  const originCode = useAppSelector(selectCode);

  React.useEffect(() => {
    let schemaMap;

    try {
      schemaMap = parseJson(provider);
    } catch (e) {
      console.log('Cannot get schema in ' + provider);
      schemaMap = new Map();
    }
    const items2: Item[] = [];
    schemaMap.forEach((schema) => {
      const schemaProvider = provider;
      const schemaTitle = schema.title;
      const schemaDisplayName = schema.title.split('-')[1];
      const schemaType = schema.title.split('-')[0];
      items2.push({
        provider: schemaProvider,
        title: schemaTitle,
        displayName: schemaDisplayName,
        type: schemaType,
      });
    });

    getModuleList(items2);

    const defaultList: Item[] = [];
    const resourceList: Item[] = [];
    const datasourceList: Item[] = [];
    const moduleList: Item[] = [];
    items2.forEach((i: Item) => {
      if (i.provider === provider) {
        if (seartchDisplayName(searchText, i.displayName)) {
          /*
          if (i.type === 'provider') {
            defaultList.push({
              provider: i.provider,
              title: i.title,
              displayName: 'provider',
              type: i.type,
            });
          }
          */
          if (i.type === 'resource') {
            resourceList.push({
              provider: i.provider,
              title: i.title,
              displayName: i.displayName,
              type: i.type,
            });
          }
          if (i.type === 'datasource') {
            datasourceList.push({
              provider: i.provider,
              title: i.title,
              displayName: i.displayName,
              type: i.type,
            });
          }
          if (i.type === 'module') {
            moduleList.push({
              provider: i.provider,
              title: i.title,
              displayName: i.displayName,
              type: i.type,
            });
          }
        }
      }
    });
    const localList: Item[] = [];
    const localItems = [
      {
        path: '/',
        title: 'localModule-Project_Root',
        objectCount: 20,
        displayName: 'Project_root',
        type: 'localModule',
      },
      {
        path: '/Network-config',
        title: 'localModule-Network-config',
        objectCount: 12,
        displayName: 'Network-config',
        type: 'localModule',
      },
      {
        path: '/Network-config2',
        title: 'localModule-Network-config-2',
        objectCount: 3,
        displayName: 'Network-config 2',
        type: 'localModule',
      },
      {
        path: '/Network-config/defaultName',
        title: 'localModule-defaultName',
        objectCount: 13,
        displayName: 'defaultName',
        type: 'localModule',
      },
      {
        path: '/Network-config/defaultName/pathTest',
        title: 'localModule-defaultName',
        objectCount: 13,
        displayName: 'defaultName',
        type: 'localModule',
      },
      {
        path: '/Network-config/defaultName/pathTest2',
        title: 'localModule-defaultName',
        objectCount: 13,
        displayName: 'defaultName',
        type: 'localModule',
      },
      {
        path: '/Network-config2/defaultName/pathTest2',
        title: 'localModule-defaultName',
        objectCount: 13,
        displayName: 'defaultName',
        type: 'localModule',
      },
      {
        path: '/Network-config3/defaultName/pathTest2',
        title: 'localModule-defaultName',
        objectCount: 13,
        displayName: 'defaultName',
        type: 'localModule',
      },
      {
        path: '/Network-config3/defaultName/pathTest2',
        title: 'localModule-defaultName',
        objectCount: 13,
        displayName: 'defaultName',
        type: 'localModule',
      },
    ];
    localItems.sort(function (a, b) {
      if (a.path < b.path) return -1;
      if (a.path > b.path) return 1;
      return 0;
    });
    /*
    localItems.forEach((item) => {
      let newPath = '';
      for (let i = 0; i < item.path.split('/').length - 2; i++) {
        newPath += '~';
      }
      newPath += '/';
      newPath += item.path.split('/')[item.path.split('/').length - 1];
      item.path = newPath;
    });
    */
    localItems.forEach((localItem: Item) => {
      if (seartchDisplayName(searchText, localItem.displayName)) {
        localList.push(localItem);
      }
    });
    setLocalModuleItems(localList);

    defaultList.push({
      title: 'defaults-provider',
      displayName: 'provider',
      type: 'defaults',
    });
    defaultList.push({
      title: 'defaults-variable',
      displayName: 'variable',
      type: 'defaults',
    });
    defaultList.push({
      title: 'defaults-output',
      displayName: 'output',
      type: 'defaults',
    });
    defaultList.push({
      title: 'defaults-terraform',
      displayName: 'terraform',
      type: 'defaults',
    });
    defaultList.push({
      title: 'defaults-locals',
      displayName: 'locals',
      type: 'defaults',
    });
    setDefaltItems(defaultList);
    setResourceItems(resourceList);
    setdatasourceItems(datasourceList);
    setTerraformModuleItems(moduleList);

    if (
      localList.length ||
      defaultList.length ||
      resourceList.length ||
      datasourceList.length ||
      moduleList.length
    ) {
      setIsSearchResultEmpty(false);
    } else {
      setIsSearchResultEmpty(true);
    }
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
          <MenuItem value="azure">Microsoft Azure</MenuItem>
          <MenuItem value="gcp">Google Cloud Platform</MenuItem>
          <MenuItem value="openstack">OpenStack</MenuItem>
          <MenuItem value="vmware">Vmware vSphere</MenuItem>
          <MenuItem value="test">TEST</MenuItem>
        </Select>
        <div>
          <TextField
            value={searchText}
            placeholder="검색"
            onChange={searchTextChange}
            style={{ marginTop: '10px' }}
            fullWidth
          />
          <Delete
            onClick={deleteSearchText}
            style={{
              marginTop: '25px',
              position: 'absolute',
              right: '30px',
              color: 'gray',
            }}
          />
        </div>
        {isSearchResultEmpty ? (
          <div>
            <InputLabel>{searchText}</InputLabel>
            <InputLabel>검색 결과가 없습니다.</InputLabel>
          </div>
        ) : (
          <>
            <ShowItemList
              items={localModuleItems}
              title="로컬 모듈"
              clickAction={clickLocalModule}
              afterAction={openSidePanel}
            />
            <ShowItemList
              items={defaltItems}
              title="테라폼 디폴트"
              clickAction={clickDefault}
              afterAction={openSidePanel}
            />
            <ShowItemList
              items={terraformModuleItems}
              title="테라폼 모듈"
              clickAction={clickModule}
              afterAction={handleModuleListModalOpen2}
            />
            <ShowItemList
              items={resourceItems}
              title="테라폼 리소스"
              clickAction={clickResource}
              afterAction={openSidePanel}
            />
            <ShowItemList
              items={datasourceItems}
              title="테라폼 데이터소스"
              clickAction={clickDatasource}
              afterAction={openSidePanel}
            />
          </>
        )}
        <Button onClick={handleModuleListModalOpen} value="test1">
          Modal Test
        </Button>
        <Button onClick={handleModuleListModalOpen} value="test2">
          Modal Test2
        </Button>
        <ModuleImportModal
          isOpen={openModuleListModal}
          onClose={handleModuleListModalClose}
          moduleName={importModule}
        />
      </Box>
      {originCode && console.log(originCode)}
    </>
  );
};

/*
type TopologyLibraryProps = {
  items: any;
};
*/
export default TopologyLibrary;
