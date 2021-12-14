import * as React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { getObjectDataType, TerraformType } from '@renderer/types/terraform';
import TopologyObjectTableHead, { Order } from './TopologyObjectTableHead';
import TopologyObjectTableNameCell from './TopologyObjectTableNameCell';
import TopologyObjectTableTypeCell from './TopologyObjectTableTypeCell';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(
  order: Order,
  orderBy: any
): (a: Data, b: Data) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const getDataInfo = (data: Data) => {
  const { type, resourceName, instanceName } = data;
  const typeData =
    getObjectDataType[type] === 'THREE_DEPTH_DATA_TYPE' ? resourceName : type;
  const iconData =
    getObjectDataType[type] === 'THREE_DEPTH_DATA_TYPE'
      ? resourceName
      : instanceName;
  return {
    typeData,
    iconData,
  };
};

const ObjectTable = (props: ObjectTabeProps) => {
  const { rows, objResult } = props;
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('name');

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer>
        <Table sx={{ maxWidth: 300, mb: 2 }} aria-labelledby="tableTitle">
          <TopologyObjectTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {rows.sort(getComparator(order, orderBy)).map((row, index) => {
              const { typeData, iconData } = getDataInfo(row);
              return (
                <TableRow key={`${typeData}-${row.instanceName}-${index}`}>
                  <TableCell
                    sx={{
                      maxWidth: 125,
                      padding: 1,
                      paddingLeft:
                        row.type === 'output' || row.type === 'variable'
                          ? 1
                          : 0,
                      border: 0,
                    }}
                  >
                    <TopologyObjectTableNameCell
                      type={row.type}
                      resourceName={row.resourceName}
                      instanceName={row.instanceName}
                      icon={iconData}
                      objResult={objResult}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 95, padding: 1, border: 0 }}>
                    <TopologyObjectTableTypeCell type={typeData} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export interface Data {
  type: TerraformType;
  resourceName: string;
  instanceName: string;
}

interface ObjectTabeProps {
  rows: Data[];
  objResult: any[];
}

export default ObjectTable;
