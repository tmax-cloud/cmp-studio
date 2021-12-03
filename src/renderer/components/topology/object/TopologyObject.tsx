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
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { setSelectedObjectInfo } from '@renderer/features/codeSlice';
import { setSidePanel } from '@renderer/features/uiSlice';
import { setSelectedNode } from '@renderer/features/graphSlice';
import { selectSelectedData } from '@renderer/features/graphSliceInputSelectors';
import { getIcon } from '@renderer/components/topology/icon/IconFactory';
import { NodeData } from '@renderer/types/graph';
import { getIconColor } from '@renderer/utils/graph/draw';
import { TerraformType } from '@renderer/types/terraform';
import {
  getObjectNameInfo,
  hasNotResourceName,
} from '../state/form/utils/getResourceInfo';

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

const ListItemTypeText = styled(Typography)(({ theme }) => ({
  color: theme.palette.object.accordionHeader.secondary,
  fontSize: '0.625rem',
  wordBreak: 'break-word',
}));

const ListItemNameText = styled(Typography)(({ theme }) => ({
  color: theme.palette.object.accordionHeader.primary,
  fontSize: '0.875rem',
  wordBreak: 'break-word',
}));

const isVar = (type: string) => type === 'output' || type === 'variable';

const ListItemColorLabel = (props: ItemColorLabelProps) => {
  const { type } = props;
  return !isVar(type) ? (
    <Divider
      orientation="vertical"
      flexItem
      sx={{
        marginRight: 2,
        borderWidth: 2,
        borderColor: getIconColor(type, 1),
      }}
    />
  ) : (
    <></>
  );
};

const getItemInfo = (item: Item) => {
  const { type, resourceName, instanceName } = item;
  const itemType = hasNotResourceName(type) ? type : resourceName;
  const itemIcon = hasNotResourceName(type) ? instanceName : resourceName;
  return {
    itemType,
    itemIcon,
  };
};

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
      const { type, resourceName, ...obj } = cur;
      const { instanceName } = getObjectNameInfo(obj, type);
      return (
        item.instanceName === instanceName && item.resourceName === resourceName
      );
    })[0];

    const { type, resourceName, ...obj } = content;
    const { instanceName } = getObjectNameInfo(obj, type);

    const object = {
      type,
      resourceName,
      instanceName,
      content,
    };

    const node = (graphData.nodes as NodeData[]).find((node) => {
      const { type, resourceName, instanceName } = node;
      const isEqual = resourceName ? resourceName === item.resourceName : true;
      return (
        type === item.type && instanceName === item.instanceName && isEqual
      );
    });
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
                const { itemType, itemIcon } = getItemInfo(item);
                return (
                  <ListItem disablePadding key={`item-${index}`}>
                    <ListItemButton
                      onClick={(event) => handleClick(event, objResult, item)}
                      sx={{ paddingLeft: isVar(item.type) ? '16px' : 0 }}
                    >
                      <ListItemColorLabel type={item.type as TerraformType} />
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {getIcon(itemIcon, 24)}
                      </ListItemIcon>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <ListItemTypeText>
                          {itemType.toUpperCase()}
                        </ListItemTypeText>
                        <ListItemNameText>{item.instanceName}</ListItemNameText>
                      </Box>
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

export interface ItemColorLabelProps {
  type: TerraformType;
}

export interface Item {
  resourceName: string;
  instanceName: string;
  type: string;
}

export interface TopologyObjectProps {
  items: Item[];
  objResult: any[];
}

export default TopologyObject;
