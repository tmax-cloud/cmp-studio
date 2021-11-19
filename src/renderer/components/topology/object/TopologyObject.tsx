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
import { getIcon } from '@renderer/utils/iconUtil';
import { NodeData } from '@renderer/types/graph';

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
      const { type } = cur;
      const resourceName = Object.keys(cur)[0];
      if (item.title === type + '/' + resourceName) {
        if (
          type === 'provider' ||
          type === 'module' ||
          type === 'variable' ||
          type === 'output'
        ) {
          return cur[resourceName];
        } else {
          return cur[resourceName][item.instanceName];
        }
      }
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
                return (
                  <ListItem disablePadding key={`item-${index}`}>
                    <ListItemButton
                      onClick={(event) => handleClick(event, objResult, item)}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <img
                          style={{ width: 24 }}
                          src={getIcon(true, item.type, item.resourceName)}
                        />
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
