/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import {
  styled,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { setSelectedObjectInfo } from '@renderer/features/codeSlice';
import { setSidePanel } from '@renderer/features/uiSlice';
import { setSelectedNode } from '@renderer/features/graphSlice';
import { selectSelectedData } from '@renderer/features/graphSliceInputSelectors';
import { getIcon } from '@renderer/components/topology/icon/IconFactory';
import { NodeData } from '@renderer/types/graph';
import { getObjectNameInfo } from '../state/form/utils/getResourceInfo';

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
}));

const TopologyObject = (props: TopologyObjectProps) => {
  const { items, objResult } = props;

  const dispatch = useAppDispatch();
  const graphData = useAppSelector(selectSelectedData);

  const accordions = [
    {
      id: 'moudle-resource',
      title: '모듈 리소스',
      content: items.filter(
        (item) => item.type !== 'output' && item.type !== 'variable'
      ),
    },
    {
      id: 'module-variable',
      title: '모듈 변수',
      content: items.filter(
        (item) => item.type === 'output' || item.type === 'variable'
      ),
    },
  ];

  const handleClick = (
    event: React.MouseEvent<any>,
    objResult: any[],
    item: Item
  ) => {
    const content = objResult.filter((cur: any) => {
      const { type, ...obj } = cur;
      const { resourceName, instanceName } = getObjectNameInfo(obj, type);
      const title = `${type}/${!!resourceName ? resourceName : instanceName}`;
      return item.title === title;
    });

    const object = {
      id: item.title,
      instanceName: item.instanceName,
      content: content[0],
    };

    const nodeType =
      item.type !== 'resource' && item.type !== 'data'
        ? item.type
        : item.resourceName;
    const node = (graphData.nodes as NodeData[]).find(
      (node) => node.type === nodeType && node.simpleName === item.instanceName
    );
    node ? dispatch(setSelectedNode(node)) : dispatch(setSelectedNode(null));

    dispatch(setSelectedObjectInfo(object));
    dispatch(setSidePanel(true));
  };

  return (
    <Box>
      {accordions.map((accordion) => (
        <AccordionLayout key={accordion.id} defaultExpanded>
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
                const name = item.resourceName || item.instanceName;
                return (
                  <ListItem disablePadding key={`item-${index}`}>
                    <ListItemButton
                      onClick={(event) => handleClick(event, objResult, item)}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getIcon(item.type, name, 24)}
                      </ListItemIcon>
                      <ListItemName>{name}</ListItemName>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </AccordionLayout>
      ))}
    </Box>
  );
};

export interface AccordionContentProps {
  children: React.ReactElement;
}

export interface Item {
  provider?: string;
  title: string;
  resourceName: string;
  instanceName: string;
  type: string;
}

export interface TopologyObjectProps {
  items: Item[];
  objResult: any[];
}

export default TopologyObject;
