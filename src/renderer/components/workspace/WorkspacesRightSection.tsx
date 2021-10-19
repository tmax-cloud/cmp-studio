import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Theme, Typography, ThemeProvider, Button } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import { OptionProperties, OpenType } from '@main/dialog/common/dialog';
import project from '../../../../assets/images/project.png';
import { openDialog } from '../../utils/ipc/dialogIpcUtils';
import { WORKSPACE_ROOT_HEIGHT } from './enums';
import CreateWorkspaceModal from './CreateWorkspaceModal';
import StudioTheme from '../../theme';

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    contentWrapper: {
      minHeight: WORKSPACE_ROOT_HEIGHT,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    logoImage: {
      width: '180px',
    },
    buttonContainer: {
      width: '100%',
      height: '40px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      maxWidth: '320px',
      margin: '30px',
    },
    button: {
      width: '150px',
    },
  })
);

const WorkspacesRightSection: React.FC = (props) => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <div className={classes.contentWrapper}>
      <img className={classes.logoImage} src={project} alt="Studio Logo" />
      <Typography style={{ margin: '5px' }} variant="h4">
        CMP Studio
      </Typography>
      <Typography style={{ margin: '5px' }} variant="subtitle1">
        version 2021.10.08
      </Typography>
      <div className={classes.buttonContainer}>
        <Button
          className={classes.button}
          variant="contained"
          onClick={() => {
            ReactDOM.render(
              <ThemeProvider theme={StudioTheme}>
                <CreateWorkspaceModal history={history} />
              </ThemeProvider>,
              document.getElementById('modal-container')
            );
          }}
        >
          새 프로젝트 생성
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          onClick={() => {
            const properties: OptionProperties = ['openDirectory'];
            const args = {
              openTo: OpenType.OPEN_FOLDER,
              properties,
            };
            openDialog(args);
          }}
        >
          열기
        </Button>
      </div>
    </div>
  );
};

export default WorkspacesRightSection;
