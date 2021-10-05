import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const ViewBreadcrumbs = () => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  };

  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ p: 1.5 }}>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href="/"
        >
          <FolderOpenIcon sx={{ mr: 1 }} fontSize="inherit" />
          <Typography
            variant="subtitle2"
            sx={{ whiteSpace: 'nowrap', pt: 0.25 }}
          >
            새 프로젝트
          </Typography>
        </Link>
      </Breadcrumbs>
    </div>
  );
};

export default ViewBreadcrumbs;
