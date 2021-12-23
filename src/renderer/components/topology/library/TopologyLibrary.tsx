import * as React from 'react';
import _ from 'lodash';
import { Box, MenuItem, InputLabel, Select, TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useAppSelector } from '@renderer/app/store';
import { selectCodeFileObjects } from '@renderer/features/codeSliceInputSelectors';
import TopologyLibararyItemList, { Item } from './TopologyLibraryItemList';
import {
  Provider,
  providerList,
  resourceMap,
  datasourceMap,
} from './TopologyLibrarySchema';

const defaultList: Item[] = [
  {
    instanceName: 'defaults-provider',
    resourceName: 'provider',
    type: 'provider',
  },
  {
    instanceName: 'defaults-variable',
    resourceName: 'variable',
    type: 'variable',
  },
  {
    instanceName: 'defaults-output',
    resourceName: 'output',
    type: 'output',
  },
  {
    instanceName: 'defaults-terraform',
    resourceName: 'terraform',
    type: 'terraform',
  },
  {
    instanceName: 'defaults-locals',
    resourceName: 'locals',
    type: 'locals',
  },
];

//fuzzy search? 비슷한 문자열 검색으로 변경 필요
function searchByName(searchText: string, name: string) {
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

let selectedProvider: Provider = 'tls';

const TopologyLibrary = () => {
  const [provider, setProvider] = React.useState<Provider>(
    selectedProvider || 'tls'
  );
  const [searchText, setSearchText] = React.useState('');
  const [debounceSearchText, setDebounceSearchText] = React.useState('');
  const [resourceItems, setResourceItems] = React.useState<Item[]>(
    resourceMap.get('tls')
  );
  const [datasourceItems, setDatasourceItems] = React.useState<Item[]>(
    datasourceMap.get('tls')
  );
  const providerHandleChange = (event: any) => {
    setProvider(event.target.value);
    setSearchText('');
  };
  //const [terraformModuleItems, setTerraformModuleItems] = React.useState<Item[]>([]);
  const [timer, setTimer] = React.useState(0);
  const searchTextChange = async (event: any) => {
    setSearchText(event.target.value);
    if (timer) {
      console.log('clear timer');
      clearTimeout(timer);
    }
    const newTimer: any = setTimeout(async () => {
      try {
        await setDebounceSearchText(searchText);
      } catch (e) {
        console.error('error', e);
      }
    }, 800);
    setTimer(newTimer);
  };
  const deleteSearchText = () => {
    setSearchText('');
    setDebounceSearchText('');
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
      return { type, resourceName, instanceName, source };
    })
    .forEach((i: Item) => {
      if (i.type === 'module') {
        const isLocal = i.source.charAt(0) === '.';

        itemsList.push({
          instanceName: i.instanceName,
          resourceName: i.resourceName,
          type: i.type,
          source: i.source,
          isLocalModule: isLocal,
        });
      }
    });

  React.useEffect(() => {
    let tempResourceItmes: Item[] = [];
    let tempDatasourceItmes: Item[] = [];

    tempResourceItmes = resourceMap.get(provider);
    tempDatasourceItmes = datasourceMap.get(provider);

    //setTerraformModuleItems(moduleList);

    selectedProvider = provider;
    setSearchText('');

    setResourceItems(tempResourceItmes);
    setDatasourceItems(tempDatasourceItmes);
    setIsSearchResultEmpty(false);
  }, [provider]);

  React.useEffect(() => {
    let tempResourceItmes: Item[] = [];
    let tempDatasourceItmes: Item[] = [];

    tempResourceItmes = resourceMap.get(provider);
    tempDatasourceItmes = datasourceMap.get(provider);

    if (debounceSearchText && debounceSearchText !== '') {
      setResourceItems(
        tempResourceItmes.filter((item) => {
          return searchByName(debounceSearchText, item.resourceName);
        })
      );
      setDatasourceItems(
        tempDatasourceItmes.filter((item) => {
          return searchByName(debounceSearchText, item.resourceName);
        })
      );
    } else {
      setResourceItems(tempResourceItmes);
      setDatasourceItems(tempDatasourceItmes);
    }
  }, [debounceSearchText]);

  React.useEffect(() => {
    if (
      resourceItems.length ||
      datasourceItems.length ||
      debounceSearchText === ''
    ) {
      setIsSearchResultEmpty(false);
    } else {
      setIsSearchResultEmpty(true);
    }
  }, [resourceItems, datasourceItems]);

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
          {providerList.map((provider) => {
            return (
              <MenuItem value={provider} key={provider}>
                {provider.toUpperCase()}
              </MenuItem>
            );
          })}
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
