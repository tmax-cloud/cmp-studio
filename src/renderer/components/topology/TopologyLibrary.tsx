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
import terraformSchema from '../form/terraform_schema.json';
import parseJson from '../form/utils/json2JsonSchemaParser';

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

const Modal: React.FC<ModalProps> = ({ title, confirmText, cancelText }) => {
  return (
    <div>
      <InputLabel>{title || 'Title'}</InputLabel>
      <InputLabel>{confirmText || 'Confirm'}</InputLabel>
      <InputLabel>{cancelText || 'Cancel'}</InputLabel>
    </div>
  );
};
type ModalProps = {
  title: string;
  confirmText: string;
  cancelText: string;
};
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
          <Button onClick={() => setIsShow(!isShow)} color="inherit" fullWidth>
            {title}
            {'(' + items.length + ')'}
            <span style={{ marginRight: '10px', float: 'right' }}>
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
}
const TopologyLibrary: React.FC<TopologyLibraryProps> = ({ items }) => {
  const [provider, setProvider] = React.useState('aws');
  const [providerItems, setProviderItems] = React.useState<Item[]>([]);
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

  React.useEffect(() => {
    let schemaMap;
    if (provider === 'aws') {
      schemaMap = parseJson('aws');
    } else {
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

    const providerList: Item[] = [];
    const resourceList: Item[] = [];
    const datasourceList: Item[] = [];
    const moduleList: Item[] = [];
    items2.forEach((i: Item) => {
      if (i.provider === provider) {
        if (seartchDisplayName(searchText, i.displayName)) {
          if (i.type === 'provider') {
            providerList.push({
              provider: i.provider,
              title: i.title,
              displayName: i.displayName,
              type: i.type,
            });
          }
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
    ];
    localItems.forEach((localItem: Item) => {
      if (seartchDisplayName(searchText, localItem.displayName)) {
        localList.push(localItem);
      }
    });
    setLocalModuleItems(localList);

    //setFilteredItems(filteredList);
    setProviderItems(providerList);
    setResourceItems(resourceList);
    setdatasourceItems(datasourceList);
    setTerraformModuleItems(moduleList);

    if (
      localList.length ||
      providerList.length ||
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
              right: '25px',
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
              items={providerItems}
              title="테라폼 디폴트"
              clickAction={clickDefault}
              afterAction={openSidePanel}
            />
            <ShowItemList
              items={terraformModuleItems}
              title="테라폼 모듈"
              clickAction={clickModule}
              afterAction={openSidePanel}
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
      </Box>
    </>
  );
};

type TopologyLibraryProps = {
  items: any;
};
export default TopologyLibrary;
