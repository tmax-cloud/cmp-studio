import * as React from 'react';
import _ from 'lodash';
import path from 'path';
import { WorkspaceStatusType } from '@main/workspaces/common/workspace';
import {
  List,
  styled,
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { exportProject } from '@renderer/utils/ipc/workspaceIpcUtils';
import {
  setFileObjects,
  setSelectedObjectInfo,
} from '@renderer/features/codeSlice';
import {
  selectCodeFileObjects,
  selectMapObjectTypeCollection,
} from '@renderer/features/codeSliceInputSelectors';
import { setFileDirty, setSidePanel } from '@renderer/features/uiSlice';
import { getModuleNodeByName, getPrunedGraph } from '@renderer/utils/graph';
import { selectGraphData } from '@renderer/features/graphSliceInputSelectors';
import { selectWorkspaceUid } from '@renderer/features/commonSliceInputSelectors';
import {
  setFilterNodes,
  setSelectedData,
  setSelectedModule,
  setSelectedNode,
  watchGraphData,
} from '@renderer/features/graphSlice';
import { useWorkspaceUri } from '@renderer/hooks/useWorkspaceUri';
import { getIcon } from '@renderer/components/topology/icon/IconFactory';
import { TerraformType, getObjectDataType } from '@renderer/types/terraform';

const AccordionLayout = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.object.accordion,
  marginBottom: 4,
  boxShadow: 'none',
  '&.MuiAccordion-root.Mui-expanded': {
    margin: 0,
  },
  '&.MuiAccordion-root:before': {
    backgroundColor: theme.palette.object.accordion,
  },
}));

const AccordionHeader = styled(AccordionSummary)(({ theme }) => ({
  '&.MuiAccordionSummary-root': {
    minHeight: 38,
    maxHeight: 38,
  },
  '.MuiAccordionSummary-content': {
    margin: '8px 0',
  },
}));

const AccordionHeaderIcon = styled(ExpandMoreIcon)(({ theme }) => ({
  color: theme.palette.object.accordionHeader.primary,
}));

const AccordionHeaderTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.object.accordionHeader.primary,
  fontSize: '0.875rem',
}));

const AccordionHeaderDesc = styled(Typography)(({ theme }) => ({
  color: theme.palette.object.accordionHeader.secondary,
  fontSize: '0.6875rem',
  marginLeft: 5,
  display: 'flex',
  alignItems: 'center',
}));
const ListItemName = styled(Typography)(({ theme }) => ({
  color: theme.palette.object.accordionHeader.primary,
  fontSize: '0.75rem',
  wordBreak: 'break-word',
}));

const TopologyLibararyItemList: React.FC<TopologyLibararyItemListProps> = ({
  items,
  title,
  provider = '',
  searchText = '',
}) => {
  const dispatch = useAppDispatch();
  const fileObjects = useAppSelector(selectCodeFileObjects);
  const workspaceUid = useAppSelector(selectWorkspaceUid);
  const mapObjectCollection = useAppSelector(selectMapObjectTypeCollection);
  const folderUri = useWorkspaceUri(workspaceUid);
  const addedObjectJSON: any = {}; //temp
  const graphData = useAppSelector(selectGraphData);
  const accordions = [
    {
      id: title,
      title,
      content: items,
    },
  ];
  const showModule = (item: Item) => {
    const name = item.resourceName;
    const selectedModule = getModuleNodeByName(graphData.nodes, name);
    if (selectedModule && selectedModule.id) {
      const selectedData = getPrunedGraph(graphData.nodes, selectedModule.id);
      dispatch(setSelectedData(selectedData));
      dispatch(setSelectedNode(null));
      dispatch(setSelectedModule(selectedModule));
      dispatch(setFilterNodes(null));
    }
  };
  const setFileName = (item: Item) => {
    switch (getObjectDataType[item.type]) {
      case 'THREE_DEPTH_DATA_TYPE': {
        return item.type + '-' + item.resourceName + '-' + fileObjects.length;
      }
      case 'TWO_DEPTH_DATA_TYPE': {
        return item.type + '-' + fileObjects.length;
      }
      case 'ONE_DEPTH_DATA_TYPE': {
        return item.type + '-' + fileObjects.length;
      }
      default:
        return item.type + '-' + fileObjects.length;
    }
  };
  const setInstanceName = (item: Item) => {
    if (item.type === 'provider') {
      return provider;
    }
    switch (getObjectDataType[item.type]) {
      case 'THREE_DEPTH_DATA_TYPE': {
        return item.type + '-' + item.resourceName + '-' + fileObjects.length;
      }
      case 'TWO_DEPTH_DATA_TYPE': {
        return item.type + '-' + fileObjects.length;
      }
      case 'ONE_DEPTH_DATA_TYPE': {
        return item.type + '-' + fileObjects.length;
      }
      default:
        return item.type + '-' + fileObjects.length;
    }
  };
  const setDefaultValues = (item: Item) => {
    item.required?.forEach((property: string) => {
      const setDefaultValue = (property: string) => {
        switch (item.properties[property]?.type) {
          case 'boolean': {
            return false;
          }
          case 'number': {
            return 0;
          }
          case 'string': {
            return '';
          }
          case 'object': {
            return {};
          }
          case 'array': {
            return [];
          }
          default:
            return '';
        }
      };
      _.merge(addedObjectJSON, { [property]: setDefaultValue(property) });
    });
    /*
    item.properties.forEach((property: any) => {
      Object.keys(property).includes('required');
    });
    */
    return addedObjectJSON;
  };
  const setFileObject = (item: Item) => {
    //Set FileName
    const newFileName = setFileName(item);
    const newInstanceName = setInstanceName(item);
    switch (getObjectDataType[item.type]) {
      case 'THREE_DEPTH_DATA_TYPE': {
        const newFileObject = [
          {
            filePath: `${folderUri}` + path.sep + `${newInstanceName}.tf`,
            fileJson: {
              [item.type]: {
                [item.resourceName]: {
                  [newInstanceName]: setDefaultValues(item),
                },
              },
            },
          },
        ];
        return newFileObject;
      }
      case 'TWO_DEPTH_DATA_TYPE': {
        const newFileObject = [
          {
            filePath: `${folderUri}` + path.sep + `${newFileName}.tf`,
            fileJson: {
              [item.resourceName]: {
                [newInstanceName]: setDefaultValues(item),
              },
            },
          },
        ];
        return newFileObject;
      }
      case 'ONE_DEPTH_DATA_TYPE': {
        const newFileObject = [
          {
            filePath: `${folderUri}` + path.sep + `${newFileName}.tf`,
            fileJson: {
              [item.type]: setDefaultValues(item),
            },
          },
        ];
        return newFileObject;
      }
      default: {
        const newFileObject = [
          {
            filePath: `${folderUri}` + path.sep + `${newFileName}.tf`,
            fileJson: {
              [item.type]: setDefaultValues(item),
            },
          },
        ];
        return newFileObject;
      }
    }
  };
  const setSidePanelObject = (item: Item) => {
    const newObject = {
      type: item.type,
      resourceName: item.type === 'provider' ? provider : item.resourceName,
      instanceName: setInstanceName(item),
      content: setDefaultValues(item),
    };
    return newObject;
  };

  return (
    <>
      {accordions.map((accordion) => (
        <AccordionLayout key={accordion.id}>
          <AccordionHeader
            expandIcon={<AccordionHeaderIcon fontSize="small" />}
            id={accordion.id}
            aria-controls={accordion.id}
          >
            <Box sx={{ display: 'flex' }}>
              <AccordionHeaderTitle>{accordion.title}</AccordionHeaderTitle>
              <AccordionHeaderDesc>{`(${accordion.content.length})`}</AccordionHeaderDesc>
            </Box>
          </AccordionHeader>
          <AccordionDetails sx={{ backgroundColor: 'white', padding: 0 }}>
            <List>
              {accordion.content.map((item, index) => {
                return (
                  <ListItem disablePadding key={`item-${index}`}>
                    <ListItemButton
                      onClick={async () => {
                        if (item.type === 'module') {
                          showModule(item);
                        } else {
                          //Set FileObject
                          const newFileObject = setFileObject(item);
                          //Update FileObjects
                          const newFileObjects =
                            fileObjects.concat(newFileObject);
                          dispatch(setFileObjects(newFileObjects));
                          //Set SidePanel
                          const object = setSidePanelObject(item);
                          dispatch(setSelectedObjectInfo(object));
                          dispatch(setSidePanel(true));
                          //Export to TemporaryDataPath (terraform plan 용도)
                          const result = await exportProject({
                            objects: newFileObjects,
                            workspaceUid,
                            isAllSave: false,
                            typeMap: mapObjectCollection,
                            deleteTypeInfo: {
                              isFileDeleted: false,
                              filePath: '',
                            },
                          });
                          if (result.status === WorkspaceStatusType.SUCCESS) {
                            dispatch(setFileDirty(true));
                            dispatch(watchGraphData(workspaceUid));
                          }
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getIcon(item.resourceName, 24)}
                      </ListItemIcon>
                      <ListItemName>
                        {item.type === 'provider'
                          ? 'provider(' + provider + ')'
                          : item.resourceName}
                      </ListItemName>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </AccordionLayout>
      ))}
    </>
  );
};
TopologyLibararyItemList.defaultProps = { provider: '', searchText: '' };

type TopologyLibararyItemListProps = {
  items: Item[];
  title: string;
  provider?: string;
  searchText?: string;
};

export interface Item {
  instanceName: string;
  resourceName: string;
  type: TerraformType;
  source?: string | any;
  isLocalModule?: boolean;
  properties?: any;
  required?: any;
}

export default TopologyLibararyItemList;
