import * as React from 'react';
import { Box, Breadcrumbs, Link, Tooltip, Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import {
  selectGraphData,
  selectSelectedModule,
} from '@renderer/features/graphSliceInputSelectors';
import {
  setSelectedData,
  setSelectedModule,
  setSelectedNode,
} from '@renderer/features/graphSlice';
import { getModuleNodeByName, getPrunedGraph } from '@renderer/utils/graph';

const ViewLink = (props: ViewLinkProps) => {
  const { text, onClick } = props;
  return (
    <Link underline="hover" href="/" onClick={onClick}>
      <Tooltip
        title={text}
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '11rem',
        }}
      >
        <Typography color="inherit" noWrap>
          {text}
        </Typography>
      </Tooltip>
    </Link>
  );
};

const ViewText = (props: ViewTextProps) => {
  const { text } = props;
  return (
    <Tooltip
      title={text}
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '11rem',
      }}
    >
      <Typography color="text.primary" noWrap>
        {text}
      </Typography>
    </Tooltip>
  );
};

const ViewBreadcrumbs = (props: ViewBreadcrumbProps) => {
  const { workspaceName } = props;

  const paths = useAppSelector(selectSelectedModule)?.modules || [];
  const graphData = useAppSelector(selectGraphData);

  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<any>) => {
    event.preventDefault();
    const name = (event.target as HTMLElement).innerText;
    const selectedModule = getModuleNodeByName(graphData.nodes, name);
    if (selectedModule && selectedModule.id) {
      const selectedData = getPrunedGraph(graphData.nodes, selectedModule.id);
      dispatch(setSelectedData(selectedData));
      dispatch(setSelectedNode(null));
      dispatch(setSelectedModule(selectedModule));
    }
  };

  const handleRootClick = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(setSelectedData(graphData));
    dispatch(setSelectedNode(null));
    dispatch(setSelectedModule(null));
  };

  const root = !!workspaceName
    ? workspaceName
    : '워크스페이스 이름을 불러오지 못했습니다.';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <FolderIcon fontSize="small" sx={{ mr: 1, color: '#FEDB57' }} />
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" sx={{ pt: 0.5 }} />}
        sx={{ p: 1 }}
      >
        {paths.length === 0 ? (
          <ViewText key={root} text={root} />
        ) : (
          <ViewLink key={root} text={root} onClick={handleRootClick} />
        )}
        {paths.map((path, index) => {
          if (index === paths.length - 1) {
            return <ViewText key={path} text={path} />;
          }
          return <ViewLink key={path} text={path} onClick={handleClick} />;
        })}
      </Breadcrumbs>
    </Box>
  );
};

interface ViewLinkProps {
  text: string;
  onClick: (event: React.MouseEvent<any>) => void;
}

interface ViewTextProps {
  text: string;
}

interface ViewBreadcrumbProps {
  workspaceName: string | null;
}

export default ViewBreadcrumbs;
