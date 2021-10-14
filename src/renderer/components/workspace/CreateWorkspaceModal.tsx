import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  Modal,
  Theme,
  Typography,
  Box,
  IconButton,
  Button,
  styled,
  Input,
} from '@mui/material';
import { Close, MoreHoriz } from '@mui/icons-material';
import { makeStyles, createStyles } from '@mui/styles';
import { History } from 'history';
import {
  WorkspaceStatusType,
  WorkspaceResponse,
  MakeDefaultNameSuccessData,
  WorkspaceSuccessUidData,
} from '@main/workspaces/common/workspace';
import { OptionProperties } from '@main/dialog/common/dialog';
import StudioTheme from '../../theme';

const useStyles = makeStyles<Theme>((theme) => {
  return createStyles({
    boxContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 800,
      height: 600,
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
    },
    barContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.palette.primary.main,
      height: 40,
      color: theme.palette.primary.contrastText,
    },
    close: {
      color: theme.palette.primary.contrastText,
    },
    contentContainer: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
    },
    footerContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: 'auto',
      padding: 35,
    },
    fieldSection: {
      minHeight: 150,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    fieldTitle: {
      width: '80%',
      textAlign: 'start',
      marginBottom: 10,
      color: '#5664d2',
    },
  });
});

const StyledButton = styled(Button)(({ theme }) => ({
  height: 35,
  width: 100,
  margin: 5,
}));

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  history,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [prjNameErrMsg, setPrjNameErrMsg] = React.useState('');
  const [newProjectName, setNewProjectName] = React.useState('');
  const [newProjectPath, setNewProjectPath] = React.useState('');

  React.useEffect(() => {
    window.electron.ipcRenderer.on(
      'studio:dirPathToCreateProject',
      (res: { canceled: boolean; filePaths: string[] }) => {
        const { filePaths, canceled } = res;
        if (!canceled) {
          setNewProjectPath(filePaths[0]);
        }
      }
    );

    window.electron.ipcRenderer
      .invoke('studio:getDefaultNewProjectName')
      .then((res: WorkspaceResponse) => {
        if (res?.data) {
          setNewProjectName(res.data as MakeDefaultNameSuccessData);
        }
        return res;
      })
      .catch((err: any) => {
        console.log('[Error] Failed to get default new project name : ', err);
      });

    window.electron.ipcRenderer
      .invoke('studio:getDefaultNewProjectsFolderPath')
      .then((res: WorkspaceResponse) => {
        if (res?.data) {
          setNewProjectPath(res.data as MakeDefaultNameSuccessData);
        }
        return res;
      })
      .catch((err: any) => {
        console.log('[Error] Failed to get default new project path : ', err);
      });

    return () => {
      setOpen(false);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    const modalContainer = document.getElementById('modal-container');
    modalContainer && ReactDOM.unmountComponentAtNode(modalContainer);
  };

  const closeModal = () => {
    setOpen(false);
    const modalContainer = document.getElementById('modal-container');
    modalContainer && ReactDOM.unmountComponentAtNode(modalContainer);
  };

  const onClickCreate = () => {
    window.electron.ipcRenderer
      .invoke('studio:createNewFolderAndWorkspace', {
        folderUri: newProjectPath,
        workspaceName: newProjectName,
      })
      .then((res: WorkspaceResponse) => {
        const { status, data } = res;
        if (status === WorkspaceStatusType.SUCCESS) {
          const uid = (data as WorkspaceSuccessUidData)?.uid;
          if (uid) {
            setOpen(false);
            history.push(`/main/${uid}`);
            window.electron.ipcRenderer.send('studio:maximizeWindowSize');
          }
        } else if (status === WorkspaceStatusType.ERROR_FILE_EXISTS) {
          setPrjNameErrMsg('이미 존재하는 프로젝트 이름입니다.');
        }
        return res;
      })
      .catch((err: any) => {
        console.log('[Error] Failed to create new project : ', err);
      });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={classes.boxContainer}>
        <div className={classes.barContainer}>
          <Typography variant="h6" style={{ marginLeft: 10 }}>
            CMP Studio 생성
          </Typography>
          <IconButton style={{ marginRight: 10 }} onClick={closeModal}>
            <Close className={classes.close} />
          </IconButton>
        </div>
        <div className={classes.contentContainer}>
          <div className={classes.fieldSection}>
            <Typography
              variant="h5"
              className={classes.fieldTitle}
              style={{ marginBottom: 10 }}
            >
              프로젝트 이름
            </Typography>
            <Input
              style={{ width: '80%', height: 40 }}
              value={newProjectName}
              onChange={(event) => {
                setNewProjectName(event.target.value);
              }}
            />
            <Typography
              variant="h6"
              className={classes.fieldTitle}
              style={{ color: 'red', marginTop: 5 }}
            >
              {prjNameErrMsg}
            </Typography>
          </div>
          <div className={classes.fieldSection}>
            <Typography
              variant="h5"
              className={classes.fieldTitle}
              style={{ marginBottom: 10 }}
            >
              프로젝트 위치
            </Typography>
            <div
              style={{
                width: '80%',
                height: 40,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Input
                style={{ flex: 1 }}
                value={newProjectPath}
                onChange={(event) => {
                  setNewProjectPath(event.target.value);
                }}
              />
              <IconButton
                style={{
                  color: StudioTheme.palette.primary.main,
                  backgroundColor: '#eaeaea',
                  marginLeft: 5,
                }}
                onClick={() => {
                  const properties: OptionProperties = ['openDirectory'];
                  window.electron.ipcRenderer.send('studio:openDialog', {
                    openTo: 'CREATE_NEW_PROJECT',
                    properties,
                  });
                }}
              >
                <MoreHoriz />
              </IconButton>
            </div>
          </div>
        </div>
        <div className={classes.footerContainer}>
          {/* <StyledButton variant="outlined">{'< 이전'}</StyledButton>
          <StyledButton variant="outlined">{'다음 >'}</StyledButton> */}
          <StyledButton variant="contained" onClick={onClickCreate}>
            생성
          </StyledButton>
          <StyledButton variant="outlined" onClick={closeModal}>
            취소
          </StyledButton>
        </div>
      </Box>
    </Modal>
  );
};

type CreateWorkspaceModalProps = {
  history: History;
};
export default CreateWorkspaceModal;
