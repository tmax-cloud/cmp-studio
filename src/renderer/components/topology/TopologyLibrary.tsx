import * as React from 'react';
import path from 'path';
import _ from 'lodash';
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
  Devices,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import {
  setFileObjects,
  setSelectedObjectInfo,
} from '@renderer/features/codeSlice';
import { setSidePanel } from '@renderer/features/uiSlice';
import { selectCodeFileObjects } from '@renderer/features/codeSliceInputSelectors';
import { getModuleNodeByName, getPrunedGraph } from '@renderer/utils/graph';
import { selectGraphData } from '@renderer/features/graphSliceInputSelectors';
import { selectWorkspaceUid } from '@renderer/features/commonSliceInputSelectors';
import {
  setSelectedData,
  setSelectedModule,
  setSelectedNode,
} from '@renderer/features/graphSlice';
import { useWorkspaceUri } from '@renderer/hooks/useWorkspaceUri';
import parseJson from './state/form/utils/json2JsonSchemaParser';
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
    case 'default':
      return <Devices />;
    default:
      return <Circle />;
  }
};
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

const ShowItemList: React.FC<ShowItemListProps> = ({ items, title }) => {
  const dispatch = useAppDispatch();
  const [isShow, setIsShow] = React.useState(false);
  const fileObjects = useAppSelector(selectCodeFileObjects);

  const workspaceUid = useAppSelector(selectWorkspaceUid);

  const folderUri = useWorkspaceUri(workspaceUid);

  /*
  const folderUri = getFolderUriByWorkspaceId(args)
    .then((res: any) => {
      return res;
    })
    .catch((err: any) => {
      console.log('[Error] Failed to open exist folder : ', err);
    });
  /*
  const folderUri =
    'C:\\Users\\ParkHyowook\\Documents\\CMPStudioProjects\\tf-init-test'; //temp
  */
  const addedObjectJSON = { key1: 'value1' }; //temp
  const graphData = useAppSelector(selectGraphData);

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
                      if (item.type === 'module') {
                        const name = item.resourceName;
                        const selectedModule = getModuleNodeByName(
                          graphData.nodes,
                          name
                        );
                        if (selectedModule && selectedModule.id) {
                          const selectedData = getPrunedGraph(
                            graphData.nodes,
                            selectedModule.id
                          );
                          dispatch(setSelectedData(selectedData));
                          dispatch(setSelectedNode(null));
                          dispatch(setSelectedModule(selectedModule));
                        }
                      } else if (item.type === 'default') {
                        const newInstanceName =
                          item.resourceName + '-' + fileObjects.length;
                        const newFileObjects = [
                          {
                            filePath:
                              `${folderUri}` +
                              path.sep +
                              `${item.resourceName}` +
                              path.sep +
                              `${newInstanceName}.tf`,
                            fileJson: {
                              [item.resourceName]: {
                                [newInstanceName]: addedObjectJSON,
                              },
                            },
                          },
                        ];
                        dispatch(
                          setFileObjects(fileObjects.concat(newFileObjects))
                        );
                        const object = {
                          id: item.title,
                          instanceName: newInstanceName,
                          content: newFileObjects[0].fileJson,
                        };
                        dispatch(setSelectedObjectInfo(object));
                        dispatch(setSidePanel(true));
                      } else {
                        const newInstanceName =
                          item.type +
                          '-' +
                          item.resourceName +
                          '-' +
                          fileObjects.length;
                        const newFileObjects = [
                          {
                            filePath:
                              `${folderUri}` +
                              path.sep +
                              `${item.type}` +
                              path.sep +
                              `${newInstanceName}.tf`,
                            fileJson: {
                              [item.type]: {
                                [item.resourceName]: {
                                  [newInstanceName]: addedObjectJSON,
                                },
                              },
                            },
                          },
                        ];
                        /*
                        const content = objResult.filter((cur: any) => {
                          const { type, ...obj } = cur;
                          const { resourceName, instanceName } = getObjectNameInfo(
                            obj,
                            type
                          );
                          const title = !!resourceName
                            ? type + '/' + resourceName
                            : type + '/' + instanceName;
                          return item.title === title;
                        });
                        const object = {
                          id: item.title,
                          instanceName: item.instanceName,
                          content: content[0],
                        };
                        */
                        dispatch(
                          setFileObjects(fileObjects.concat(newFileObjects))
                        );
                        const object = {
                          id: item.title,
                          instanceName: newInstanceName,
                          content: newFileObjects[0].fileJson,
                        };
                        dispatch(setSelectedObjectInfo(object));
                        dispatch(setSidePanel(true));
                      }
                    }}
                    fullWidth
                    style={{ textAlign: 'left' }}
                  >
                    {item.type === 'localModule'
                      ? item.path
                      : item.resourceName}
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
};

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
  const [defaltItems, setDefaltItems] = React.useState<Item[]>([]);
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

  const [openModuleListModal, setOpenModuleListModal] = React.useState(false);
  const [importModule, setImportModule] = React.useState('');

  const handleModuleListModalOpen = (event: any) => {
    setImportModule(event.target?.value || event);
    setOpenModuleListModal(true);
  };
  const handleModuleListModalClose = () => setOpenModuleListModal(false);
  const dispatch = useAppDispatch();

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
      } else {
        itemsList.push({
          provider: i.resourceName.split('_')[0],
          title: i.title,
          instanceName: i.instanceName,
          resourceName: i.resourceName,
          type: i.type,
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
        if (i.type === 'datasource') {
          datasourceList.push({
            provider: i.provider,
            title: i.title,
            resourceName: i.resourceName,
            type: i.type,
          });
        }
      }
    });

    setDefaltItems(defaultList);
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
          <MenuItem value="azure">Microsoft Azure</MenuItem>
          <MenuItem value="gcp">Google Cloud Platform</MenuItem>
          <MenuItem value="openstack">OpenStack</MenuItem>
          <MenuItem value="vmware">Vmware vSphere</MenuItem>
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
        <ShowItemList
          items={itemsList.filter((item) => {
            return item?.type === 'module' && isLocalModule(item);
          })}
          title="로컬 모듈"
        />
        <ShowItemList items={defaltItems} title="테라폼 디폴트" />
        {isSearchResultEmpty ? (
          <div>
            <InputLabel>------</InputLabel>
            <InputLabel>{searchText}</InputLabel>
            <InputLabel>검색 결과가 없습니다.</InputLabel>
          </div>
        ) : (
          <>
            {/* 모듈 추후 추가 */}
            {/* <ShowItemList items={terraformModuleItems} title="테라폼 모듈" />*/}
            <ShowItemList items={resourceItems} title="테라폼 리소스" />
            <ShowItemList items={datasourceItems} title="테라폼 데이터소스" />
          </>
        )}
        {/* 테스트용 Object 표시 */}
        <InputLabel>------</InputLabel>
        <InputLabel>Object 표시 - 임시</InputLabel>
        <ShowItemList items={itemsList} title="Object" />
        <Button onClick={handleModuleListModalOpen} value="test1">
          Modal Test
        </Button>
        <Button onClick={() => dispatch(setFileObjects([]))} value="test2">
          Delete Object for Test
        </Button>
        <Button
          onClick={() =>
            dispatch(
              setFileObjects([
                {
                  filePath:
                    'C:\\Users\\ParkHyowook\\Documents\\CMPStudioProjects\\tf-init-test\\test.tf',
                  fileJson: {
                    module: {
                      'aws-network-configs': {
                        source: './network-configs',
                      },
                    },
                    provider: {
                      aws: {
                        region: 'test-region',
                      },
                    },
                  },
                },
                {
                  filePath:
                    'C:\\Users\\ParkHyowook\\Documents\\CMPStudioProjects\\tf-init-test\\a.tf',
                  fileJson: {
                    resource: {
                      aws_instance: {
                        'ubuntu-ssh-server': {
                          ami: 'ami-0b9064170e32bde34',
                          associate_public_ip_address: true,
                          count: 1,
                          instance_type: 't2.micro',
                          key_name: '{var.key_pair}',
                          subnet_id:
                            '{module.aws-network-configs.test-subnet-a-id}',
                          tags: { Naem: 'test-instance' },
                          vpc_security_group_ids: [
                            '{module.aws-network-configs.test-sg-id}',
                          ],
                        },
                      },
                    },
                    variable: {
                      key_pair: {
                        default: 'aws-key',
                      },
                    },
                  },
                },
                {
                  filePath:
                    'C:\\Users\\ParkHyowook\\Documents\\CMPStudioProjects\\tf-init-test\\b.tf',
                  fileJson: {
                    resource: {
                      aws_key_pair: {
                        'terraform-key': {
                          key_name: 'aws-key',
                          public_key:
                            '{tls_private_key.example.public_key_openssh}',
                        },
                      },
                      tls_private_key: {
                        example: {
                          algorithm: 'RSA',
                          provisioner: {
                            'local-exec': {
                              command:
                                "echo '@@@{self.private_key_pem}@@@' > ./aws-key.pem",
                            },
                            rsa_bits: 4096,
                          },
                        },
                      },
                    },
                  },
                },
              ])
            )
          }
          value="test3"
        >
          Set Object for Test
        </Button>
        <ModuleImportModal
          isOpen={openModuleListModal}
          onClose={handleModuleListModalClose}
          moduleName={importModule}
        />
      </Box>
    </>
  );
};
export default TopologyLibrary;
