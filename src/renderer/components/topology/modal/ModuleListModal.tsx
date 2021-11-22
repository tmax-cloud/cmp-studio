import * as React from 'react';
import {
  Box,
  IconButton,
  Link,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { selectGraphData } from '@renderer/features/graphSliceInputSelectors';
import { getModuleData, getPrunedGraph } from '@renderer/utils/graph';
import { ModuleData } from '@renderer/types/graph';
import {
  setSelectedData,
  setSelectedModule,
  setSelectedNode,
} from '@renderer/features/graphSlice';
import { nodesById } from '@renderer/utils/graph/parse';

const Empty = () => (
  <caption style={{ textAlign: 'center' }}>
    불러올 모듈 목록이 없습니다.
  </caption>
);

const ModuleLink = (props: ModuleLinkProps) => {
  const { text, onClick } = props;
  return (
    <Link underline="hover" href="/" onClick={onClick}>
      <Tooltip title={text}>
        <Typography
          color="inherit"
          noWrap
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '10rem',
          }}
        >
          {text}
        </Typography>
      </Tooltip>
    </Link>
  );
};

const ModuleListModal = (props: ModuleListModalProps) => {
  const { isOpen, onClose } = props;

  const columns = [
    { id: 'name', label: '이름', width: 180 },
    { id: 'path', label: '경로', width: 240 },
    { id: 'size', label: '오브젝트 개수', width: 120 },
  ];

  const graphData = useAppSelector(selectGraphData);
  const rows = getModuleData(graphData.nodes);
  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<any>, item: ModuleData) => {
    event.preventDefault();
    if (item.root) {
      // 루트 경로일 경우
      dispatch(setSelectedData(graphData));
      dispatch(setSelectedModule(null));
    } else {
      const selectedData = getPrunedGraph(graphData.nodes, item.id);
      dispatch(setSelectedData(selectedData));
      dispatch(setSelectedModule(nodesById(graphData.nodes)[item.id]));
    }
    dispatch(setSelectedNode(null));
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="module-list-modal-title"
      aria-describedby="module-list-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          pt: 2,
        }}
      >
        <Toolbar sx={{ mb: 2 }} style={{ padding: 0 }}>
          <Typography variant="h3" sx={{ flexGrow: 1 }}>
            모듈
          </Typography>
          <IconButton color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <TableContainer component={Box} sx={{ width: 600, maxHeight: 300 }}>
          <Table stickyHeader sx={{ border: 0 }}>
            {(!rows || rows?.length === 0) && <Empty />}
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.id === 'size' ? 'center' : 'inherit'}
                    sx={{ border: 0, width: column.width }}
                  >
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {column.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row" sx={{ border: 0 }}>
                    <ModuleLink
                      text={row.name}
                      onClick={(event) => handleClick(event, row)}
                    />
                  </TableCell>
                  <TableCell sx={{ border: 0 }}>{row.path}</TableCell>
                  <TableCell align="center" sx={{ border: 0 }}>
                    {row.size}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

interface ModuleLinkProps {
  text: string;
  onClick: (event: React.MouseEvent<any>) => void;
}
export interface ModuleListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default ModuleListModal;
