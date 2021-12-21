import * as React from 'react';
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
  setSelectedData,
  setSelectedModule,
  setSelectedNode,
  watchGraphData,
} from '@renderer/features/graphSlice';
import { useWorkspaceUri } from '@renderer/hooks/useWorkspaceUri';
import { getIcon } from '@renderer/components/topology/icon/IconFactory';

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
}) => {
  const dispatch = useAppDispatch();
  const fileObjects = useAppSelector(selectCodeFileObjects);
  const workspaceUid = useAppSelector(selectWorkspaceUid);
  const mapObjectCollection = useAppSelector(selectMapObjectTypeCollection);
  const folderUri = useWorkspaceUri(workspaceUid);
  const addedObjectJSON = {}; //temp
  const graphData = useAppSelector(selectGraphData);
  const accordions = [
    {
      id: title,
      title,
      content: items,
    },
  ];

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
              {items.map((item, index) => {
                return (
                  <ListItem disablePadding key={`item-${index}`}>
                    <ListItemButton
                      onClick={async () => {
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
                          const newFileName =
                            item.resourceName + '-' + fileObjects.length;
                          let newFileObject;
                          let newInstanceName = newFileName;
                          if (
                            item.resourceName === 'terraform' ||
                            item.resourceName === 'locals'
                          ) {
                            newInstanceName = item.resourceName;
                            newFileObject = [
                              {
                                filePath:
                                  `${folderUri}` +
                                  path.sep +
                                  `${newFileName}.tf`,
                                fileJson: {
                                  [item.resourceName]: {
                                    [newInstanceName]: addedObjectJSON,
                                  },
                                },
                              },
                            ];
                          } else if (item.resourceName === 'provider') {
                            newInstanceName = provider;
                            newFileObject = [
                              {
                                filePath:
                                  `${folderUri}` +
                                  path.sep +
                                  `${newFileName}.tf`,
                                fileJson: {
                                  [item.resourceName]: {
                                    [newInstanceName]: addedObjectJSON,
                                  },
                                },
                              },
                            ];
                          } else {
                            newFileObject = [
                              {
                                filePath:
                                  `${folderUri}` +
                                  path.sep +
                                  `${newFileName}.tf`,
                                fileJson: {
                                  [item.resourceName]: {
                                    [newInstanceName]: addedObjectJSON,
                                  },
                                },
                              },
                            ];
                          }
                          const newFileObjects =
                            fileObjects.concat(newFileObject);
                          dispatch(setFileObjects(newFileObjects));
                          const object = {
                            type: item.resourceName,
                            resourceName: '',
                            instanceName: newInstanceName,
                            content: addedObjectJSON,
                          };
                          dispatch(setSelectedObjectInfo(object));
                          dispatch(setSidePanel(true));
                          // TemporaryDataPath에 변경사항 저장 (terraform plan 용도)
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
                        } else {
                          const { type } = item;
                          const newInstanceName =
                            item.type +
                            '-' +
                            item.resourceName +
                            '-' +
                            fileObjects.length;
                          const newFileObject = [
                            {
                              filePath:
                                `${folderUri}` +
                                path.sep +
                                `${newInstanceName}.tf`,
                              fileJson: {
                                [type]: {
                                  [item.resourceName]: {
                                    [newInstanceName]: addedObjectJSON,
                                  },
                                },
                              },
                            },
                          ];
                          const newFileObjects =
                            fileObjects.concat(newFileObject);
                          dispatch(setFileObjects(newFileObjects));
                          const object = {
                            type: item.type,
                            resourceName: item.resourceName,
                            instanceName: newInstanceName,
                            content: addedObjectJSON,
                          };
                          dispatch(setSelectedObjectInfo(object));
                          dispatch(setSidePanel(true));
                          // TemporaryDataPath에 변경사항 저장 (terraform plan 용도)
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
                      <ListItemName>{item.resourceName}</ListItemName>
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
TopologyLibararyItemList.defaultProps = { provider: '' };

type TopologyLibararyItemListProps = {
  items: Item[];
  title: string;
  provider?: string;
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

export default TopologyLibararyItemList;
