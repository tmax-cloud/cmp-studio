import * as React from 'react';
import { Theme, Paper, Typography, InputBase } from '@mui/material';
import { PushPin, Search } from '@mui/icons-material';
import { makeStyles, createStyles } from '@mui/styles';
import { timeDifference } from '../../utils/timeUtils';

// TODO : 검색 구현하기

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    searchBarContainer: {
      padding: 5,
      height: '55px',
    },
    searchBarPaper: {
      height: '45px',
      flexDirection: 'row',
      display: 'flex',
      padding: '5px 5px 5px 0',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    searchBarTitle: {
      display: 'inline-block',
      paddingLeft: 10,
      lineHeight: '45px',
    },
    inputWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minWidth: '250px',
      padding: 5,
      height: '28px',
      marginRight: '7px',
    },
    contentContainer: {
      maxHeight: '560px',
      overflowY: 'auto',
      marginLeft: '5px',
      marginRight: '8px',
      borderRadius: '5px',
      padding: 8,
    },
    workspaceItemWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      display: 'flex',
      height: '50px',
      cursor: 'pointer',
      borderRadius: '5px',
      padding: '5px 10px',
      '&:hover': {
        backgroundColor: '#cac9c9',
      },
    },
  })
);

const WorkspacesSearchBar: React.FC = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.searchBarContainer}>
      <Paper className={classes.searchBarPaper} elevation={6}>
        <Typography variant="h5" className={classes.searchBarTitle}>
          최근 프로젝트
        </Typography>
        <Paper className={classes.inputWrapper}>
          <InputBase
            style={{ height: '26px', width: '230px', marginLeft: '10px' }}
          />
          <Search style={{ fontSize: '21px', color: 'grey' }} />
        </Paper>
      </Paper>
    </div>
  );
};

const WorkspaceItem: React.FC<WorkspaceItemProps> = ({
  labelTitle,
  labelUri,
  workspaceUid,
  folderUri,
  lastOpenedTime,
  isPinned,
}) => {
  const classes = useStyles();
  const timestamp = timeDifference(
    Math.floor(+new Date() / 1000),
    lastOpenedTime
  );
  return (
    <div className={classes.workspaceItemWrapper}>
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5">{labelTitle}</Typography>
        <Typography variant="h6" style={{ color: 'grey' }}>
          {labelUri}
        </Typography>
      </div>
      <div
        style={{
          display: 'inline-flex',
          fontSize: 15,
          lineHeight: '30px',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">{timestamp}</Typography>
        {isPinned ? (
          <PushPin
            style={{
              fontSize: '18px',
              color: '#da6767',
              marginLeft: '3px',
              transform: 'rotate(45deg)',
            }}
          />
        ) : (
          <div style={{ width: '20px' }} />
        )}
      </div>
    </div>
  );
};

const WorkspacesListContent: React.FC<WorkspacesListContentProps> = ({
  items,
}) => {
  const classes = useStyles();
  const workspaceList = items.map((item) => {
    return <WorkspaceItem key={item.workspaceUid} {...item} />;
  });
  return <div className={classes.contentContainer}>{workspaceList}</div>;
};

const WorkspacesList: React.FC<WorkspacesListProps> = ({ items }) => {
  return (
    <>
      <WorkspacesSearchBar />
      <WorkspacesListContent items={items} />
    </>
  );
};

export type WorkspaceItemProps = {
  labelTitle: string;
  labelUri: string;
  folderUri: string;
  lastOpenedTime: number;
  workspaceUid: string;
  isPinned: boolean;
};

type WorkspacesListContentProps = {
  items: WorkspaceItemProps[];
};

type WorkspacesListProps = {
  items: WorkspaceItemProps[];
};

export default WorkspacesList;
