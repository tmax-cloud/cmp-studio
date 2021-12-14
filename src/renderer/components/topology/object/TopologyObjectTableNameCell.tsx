/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import {
  styled,
  Box,
  ListItemIcon,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import { getIcon } from '@renderer/components/topology/icon/IconFactory';
import { getIconColor } from '@renderer/utils/graph/draw';
import { getObjectDataType, TerraformType } from '@renderer/types/terraform';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { selectSelectedData } from '@renderer/features/graphSliceInputSelectors';
import { setSelectedObjectInfo } from '@renderer/features/codeSlice';
import { setSidePanel } from '@renderer/features/uiSlice';
import { setSelectedNode } from '@renderer/features/graphSlice';
import { NodeData } from '@renderer/types/graph';

const filterObj = (
  objResult: any[],
  type: TerraformType,
  resourceName: string,
  instanceName: string
) => {
  const obj = objResult.filter((cur: any) => {
    switch (getObjectDataType[type as TerraformType]) {
      case 'ONE_DEPTH_DATA_TYPE': {
        return cur.type === type;
      }
      case 'TWO_DEPTH_DATA_TYPE': {
        return cur.instanceName === instanceName;
      }
      case 'THREE_DEPTH_DATA_TYPE': {
        return (
          cur.instanceName === instanceName && cur.resourceName === resourceName
        );
      }
      default:
        return false;
    }
  })[0];

  switch (getObjectDataType[type as TerraformType]) {
    case 'ONE_DEPTH_DATA_TYPE': {
      return obj[type];
    }
    case 'TWO_DEPTH_DATA_TYPE': {
      return obj[instanceName];
    }
    case 'THREE_DEPTH_DATA_TYPE': {
      return obj[instanceName];
    }
    default:
      return {};
  }
};

const ColorLabel = (props: ColorLabelProps) => {
  const { type } = props;
  const isVar = type === 'output' || type === 'variable';
  const visible =
    type === 'module' ||
    type === 'provider' ||
    type === 'data' ||
    type === 'resource';
  return !isVar ? (
    <Divider
      orientation="vertical"
      flexItem
      sx={{
        marginRight: 2,
        borderWidth: 2,
        borderColor: visible ? getIconColor(type, 1) : 'white',
      }}
    />
  ) : (
    <></>
  );
};

const NameText = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  color: '#0066CC',
  fontSize: '0.75rem',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const TopologyObjectTableNameCell = (props: NameCellProps) => {
  const { icon, type, resourceName, instanceName, objResult } = props;

  const dispatch = useAppDispatch();
  const graphData = useAppSelector(selectSelectedData);

  const handleClick = (
    event: React.MouseEvent<any>,
    type: TerraformType,
    resourceName: string,
    instanceName: string
  ) => {
    event.preventDefault();

    // 그래프 연동
    const node = (graphData.nodes as NodeData[]).find((node) => {
      const isEqual = node.resourceName
        ? node.resourceName === resourceName
        : true;
      return (
        node.type === type && node.instanceName === instanceName && isEqual
      );
    });
    node ? dispatch(setSelectedNode(node)) : dispatch(setSelectedNode(null));

    // 폼 에디터 연동
    const selectedObj = filterObj(objResult, type, resourceName, instanceName);
    if (selectedObj) {
      const object = {
        type,
        resourceName,
        instanceName,
        content: selectedObj,
      };
      dispatch(setSelectedObjectInfo(object));
      dispatch(setSidePanel(true));
    } else {
      dispatch(setSidePanel(false));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <ColorLabel type={type} />
      <ListItemIcon sx={{ minWidth: 36 }}>{getIcon(icon, 24)}</ListItemIcon>
      <Tooltip title={instanceName}>
        <NameText
          noWrap
          onClick={(event) =>
            handleClick(event, type, resourceName, instanceName)
          }
        >
          {instanceName}
        </NameText>
      </Tooltip>
    </Box>
  );
};

interface ColorLabelProps {
  type: TerraformType;
}

interface NameCellProps {
  icon: string;
  type: TerraformType;
  resourceName: string;
  instanceName: string;
  objResult: any[];
}

export default TopologyObjectTableNameCell;
