import { spawn } from 'child_process';
// MEMO : 한글 출력에 문제가 있어서 사용했던 iconv 라이브러리 주석처리. 추후에 다시 쓸 수도 있어서 남겨둠.
// import iconv from 'iconv-lite';
import { ipcMain } from 'electron';
import {
  TerraformResponse,
  TerraformStatusType,
  TerraformGraphArgs,
  TerraformInitArgs,
} from '../common/terraform';
import {
  WorkspaceIdentifier,
  WorkspaceMainServiceInterface,
} from '../../workspaces/common/workspace';

export class TerraformMainService {
  constructor(
    private readonly workspaceMainService: WorkspaceMainServiceInterface
  ) {
    this.registerListeners();
  }

  doTerraformInit(folderUri: string, tfExePath: string) {
    return new Promise(async (resolve, reject) => {
      // TODO : windows 외의 os에서도 돌아가게 분기처리하기
      const tfInitCmd = spawn(`terraform -chdir="${folderUri}" init`, {
        shell: true,
      });
      // MEMO : 워크스페이스마다 다른 테라폼 exe경로로 커맨드 실행시켜줘야될 경우 아래 주석으로 대체하기
      /*
       const tfInitCmd = spawn(`${tfExePath} -chdir="${folderUri}" init`, {
         shell: true,
       });
      */
      let tfInitData = '';
      for await (const chunk of tfInitCmd.stdout) {
        tfInitData += chunk;
        // tfInitData += iconv.decode(chunk, 'euc-kr');
      }

      let tfInitError = '';
      for await (const chunk of tfInitCmd.stderr) {
        tfInitError += chunk;
        // tfInitError += iconv.decode(chunk, 'euc-kr');
      }

      const tfInitExitCode = await new Promise((resolve, reject) => {
        tfInitCmd.on('close', resolve);
      });

      if (tfInitExitCode) {
        reject(tfInitError);
      }

      resolve(tfInitData);
    });
  }

  doTerraformGraph(folderUri: string, tfExePath: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      // TODO : windows 외의 os에서도 돌아가게 분기처리하기
      const graphCmd = spawn(`terraform -chdir="${folderUri}" graph`, {
        shell: true,
      });
      // MEMO : 워크스페이스마다 다른 테라폼 exe경로로 커맨드 실행시켜줘야될 경우 아래 주석으로 대체하기
      /*
        const graphCmd = spawn(`"${tfExePath}" -chdir="${folderUri}" graph`, {
          shell: true,
        });
        */
      let graphData = '';
      for await (const chunk of graphCmd.stdout) {
        graphData += chunk;
        // graphData += iconv.decode(chunk, 'euc-kr');
      }

      let graphError = '';
      for await (const chunk of graphCmd.stderr) {
        graphError += chunk;
        // graphError += iconv.decode(chunk, 'euc-kr');
      }

      const graphExitCode = await new Promise((resolve, reject) => {
        graphCmd.on('close', resolve);
      });

      if (graphExitCode) {
        reject(graphError);
      }
      resolve(graphData);
    });
  }

  registerListeners() {
    ipcMain.handle(
      'studio:doTerraformInit',
      async (event, arg: TerraformInitArgs): Promise<TerraformResponse> => {
        const { workspaceUid } = arg;
        const workspaceConfig: WorkspaceIdentifier =
          this.workspaceMainService.workspaceManagementService.getWorkspaceConfig(
            workspaceUid
          );
        // MEMO : 워크스페이스별로 테라폼 exe경로 다르게 설정하는 기능 추가되면 아래 주석처리 풀어서 path 유효성도 체크하기
        /*
        const tfExePath = workspaceConfig.terraformExePath || 'EMPTY';
        if (tfExePath === 'EMPTY') {
          return {
            status: TerraformStatusType.ERROR_TF_EXE_PATH,
            data: { message: 'Check terraform .exe file path setting.' },
          };
        }
        */
        const folderUri = workspaceConfig.workspaceRealPath;
        try {
          // MEMO : 현재는 tfExePath 값은 사용안하고있어서 그냥 공백으로 넘겨줌.
          await this.doTerraformInit(folderUri, '');
          return {
            status: TerraformStatusType.SUCCESS,
            data: { message: TerraformStatusType.SUCCESS },
          };
        } catch (message: any) {
          return {
            status: TerraformStatusType.ERROR_INIT,
            data: {
              message,
            },
          };
        }
      }
    );
    ipcMain.handle(
      'studio:getTerraformGraph',
      async (event, arg: TerraformGraphArgs): Promise<TerraformResponse> => {
        const { workspaceUid } = arg;
        const workspaceConfig: WorkspaceIdentifier =
          this.workspaceMainService.workspaceManagementService.getWorkspaceConfig(
            workspaceUid
          );
        // MEMO : 워크스페이스별로 테라폼 exe경로 다르게 설정하는 기능 추가되면 아래 주석처리 풀어서 path 유효성도 체크하기
        /*
        const tfExePath = workspaceConfig.terraformExePath || 'EMPTY';
        if (tfExePath === 'EMPTY') {
          return {
            status: TerraformStatusType.ERROR_TF_EXE_PATH,
            data: { message: 'Check terraform .exe file path setting.' },
          };
        }
        */

        const folderUri = workspaceConfig.workspaceRealPath;
        // MEMO : 시스템 환경변수로 Path에 설정돼있는 terraform.exe만 실행시키도록 임시 처리.
        // MEMO : 현재는 tfExePath 값은 사용안하고있어서 그냥 공백으로 넘겨줌.
        // MEMO : 워크스페이스 설정마다 다른 terraform.exe 실행시켜주려면 위와 아래부분 주석처리부분 사용하기
        try {
          const graphData: string = await this.doTerraformGraph(folderUri, '');
          return {
            status: TerraformStatusType.SUCCESS,
            data: { graphData },
          };
        } catch (message: any) {
          return {
            status: TerraformStatusType.ERROR_GRAPH,
            data: { message },
          };
        }
      }
    );
  }
}
