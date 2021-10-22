import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useHistory } from 'react-router';
import {
  Input,
  IconButton,
  styled,
  Button,
  Modal,
  Box,
  Typography,
} from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import {
  OptionProperties,
  OpenType,
  OpenDialogArgs,
} from '@main/dialog/common/dialog';
import {
  TERRAFORM_EXE_PATH_KEY,
  ConfigResponse,
} from '@main/configs/common/configuration';
import * as TerraformTypes from '@main/terraform-command/common/terraform';
import { checkTerraformExe } from '../../../utils/ipc/terraformIpcUtils';
import {
  setAppConfigItem,
  getAppConfigItem,
} from '../../../utils/ipc/configIpcUtils';
import StudioTheme from '../../../theme';
import { openDialog } from '../../../utils/ipc/dialogIpcUtils';

const StyledButton = styled(Button)(({ theme }) => ({
  height: 35,
  width: 100,
  margin: 5,
}));

type TerraformVersionSettingContentProps = {
  handleClose: any;
  asModalContent: boolean;
  setOpen?: any;
};

const TerraformVersionSettingContent: React.FC<TerraformVersionSettingContentProps> =
  ({ handleClose, setOpen, asModalContent }) => {
    const [tfExePath, setTfExePath] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState('');

    React.useEffect(() => {
      getAppConfigItem({ key: TERRAFORM_EXE_PATH_KEY })
        .then((res: ConfigResponse) => {
          const { data } = res;
          setTfExePath(data);
          return res;
        })
        .catch((e: any) => {
          console.log(e);
        });
      window.electron.ipcRenderer.on(
        'studio:terraformExePath',
        (res: { canceled: boolean; filePaths: string[] }) => {
          const { filePaths, canceled } = res;
          if (!canceled) {
            setTfExePath(filePaths[0]);
          }
        }
      );
      return () => {
        if (asModalContent) {
          setOpen(false);
        }
      };
    }, [setOpen, asModalContent]);

    const onSave = () => {
      checkTerraformExe({ terraformExePath: tfExePath })
        .then((res: TerraformTypes.TerraformResponse) => {
          const { status } = res;
          if (status === TerraformTypes.TerraformStatusType.SUCCESS) {
            setAppConfigItem({ key: TERRAFORM_EXE_PATH_KEY, data: tfExePath });
            handleClose();
          } else {
            setErrorMsg('유효하지 않은 테라폼 경로입니다.');
          }

          return res;
        })
        .catch((e: any) => {
          console.log(e);
        });
    };

    return (
      <>
        <Typography sx={{ height: '40px', padding: '20px' }} variant="h5">
          CMP 스튜디오 설정
        </Typography>
        <div>
          <Typography
            style={{
              paddingLeft: '20px',
              color: StudioTheme.palette.primary.main,
            }}
            variant="h6"
          >
            테라폼 실행파일 경로
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              padding: '10px 20px 0px 20px',
            }}
          >
            <Input
              style={{ flex: 1 }}
              value={tfExePath}
              onChange={(event) => {
                setTfExePath(event.target.value);
              }}
            />
            <IconButton
              style={{
                color: StudioTheme.palette.primary.main,
                backgroundColor: '#eaeaea',
                marginLeft: 5,
              }}
              onClick={() => {
                const properties: OptionProperties = ['openFile'];
                const args: OpenDialogArgs = {
                  openTo: OpenType.SELECT_TF_EXE,
                  properties,
                };
                openDialog(args);
              }}
            >
              <MoreHoriz />
            </IconButton>
          </div>
          <Typography
            variant="h6"
            style={{
              width: '80%',
              textAlign: 'start',
              marginBottom: 10,
              color: 'red',
              padding: '10px 20px 0px 20px',
            }}
          >
            {errorMsg}
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: 'auto',
            marginTop: 'auto',
            padding: 20,
          }}
        >
          {asModalContent ? (
            <StyledButton
              variant="contained"
              onClick={() => {
                handleClose();
              }}
            >
              취소
            </StyledButton>
          ) : null}
          <StyledButton variant="outlined" onClick={onSave}>
            확인
          </StyledButton>
        </div>
      </>
    );
  };

TerraformVersionSettingContent.defaultProps = {
  setOpen: () => {},
};

export const TerraformVersionSettingModal: React.FC = () => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    const modalContainer = document.getElementById('modal-container');
    modalContainer && ReactDOM.unmountComponentAtNode(modalContainer);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 300,
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TerraformVersionSettingContent
          setOpen={setOpen}
          handleClose={handleClose}
          asModalContent={true}
        />
      </Box>
    </Modal>
  );
};

export const TerraformVersionSettingPage: React.FC = () => {
  const history = useHistory();

  const handleClose = () => {
    history.push('/home');
  };

  return (
    <>
      <TerraformVersionSettingContent
        asModalContent={false}
        handleClose={handleClose}
      />
    </>
  );
};
