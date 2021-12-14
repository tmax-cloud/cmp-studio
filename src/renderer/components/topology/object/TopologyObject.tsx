/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import {
  styled,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TopologyObjectTable, { Data } from './TopologyObjectTable';

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

const TopologyObject = (props: TopologyObjectProps) => {
  const { items, objResult } = props;

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
            <TopologyObjectTable
              rows={accordion.content}
              objResult={objResult}
            />
          </AccordionDetails>
        </AccordionLayout>
      ))}
    </Box>
  );
};

interface TopologyObjectProps {
  items: Data[];
  objResult: any[];
}

export default TopologyObject;
