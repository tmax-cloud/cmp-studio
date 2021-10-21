/* eslint-disable  @typescript-eslint/ban-types */
import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import { ModulePath } from '@renderer/types/graph';

const Error = () => <caption>구현 예정</caption>;

const ModuleListModal = (props: ModuleListModalProps) => {
  const { isOpen, onClose, rowData } = props;

  const columns = [
    { id: 'name', label: '이름', width: 180 },
    { id: 'path', label: '경로', width: 240 },
    { id: 'size', label: '오브젝트 개수', width: 120 },
  ];

  const rows = rowData?.map((data) => {
    return { name: data.name, path: data.path, size: data.size };
  });

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
        <TableContainer component={Box} sx={{ width: 600, maxHeight: 400 }}>
          <Table stickyHeader sx={{ border: 0 }}>
            {(!rows || rows?.length === 0) && <Error />}
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
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row" sx={{ border: 0 }}>
                    <Link href="#link"> {row.name}</Link>
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

export interface ModuleListModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData?: ModulePath[];
}

export default ModuleListModal;
