import { spawn } from 'child_process';
// MEMO : 한글 출력에 문제가 있어서 사용했던 iconv 라이브러리 주석처리. 추후에 다시 쓸 수도 있어서 남겨둠.
// import iconv from 'iconv-lite';
import { ipcMain } from 'electron';
import path from 'path';
import {
  TerraformResponse,
  TerraformStatusType,
  TerraformGraphArgs,
  TerraformInitArgs,
  TerraformVersionArgs,
  TerraformCheckExeArgs,
  TerraformPlanArgs,
} from '../common/terraform';
import {
  WorkspaceIdentifier,
  WorkspaceMainServiceInterface,
} from '../../workspaces/common/workspace';
import { isWindows, isLinux, isMacintosh } from '../../base/common/platform';
import { TERRAFORM_EXE_PATH_KEY } from '../../configs/common/configuration';
import { AppConfigurationMainService } from '../../configs/electron-main/appConfigurationMainService';

export class TerraformMainService {
  constructor(
    private readonly workspaceMainService: WorkspaceMainServiceInterface,
    private readonly appConfigurationMainService: AppConfigurationMainService
  ) {
    this.registerListeners();
  }

  checkTerraformExe(tfExePath: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (
        (isWindows && path.extname(tfExePath) === '.exe') ||
        (isLinux && tfExePath.includes('terraform')) ||
        (isMacintosh && tfExePath.includes('terraform'))
      ) {
        const tfHelpCmd = spawn(`"${tfExePath}" -help`, { shell: true });

        let tfHelpData = '';
        for await (const chunk of tfHelpCmd.stdout) {
          tfHelpData += chunk;
        }

        let tfHelpError = '';
        for await (const chunk of tfHelpCmd.stderr) {
          tfHelpError += chunk;
        }

        const tfVersionxitCode = await new Promise((resolve, reject) => {
          tfHelpCmd.on('close', resolve);
        });

        if (tfVersionxitCode) {
          reject(tfHelpError);
        }

        resolve(tfHelpData);
      } else {
        reject(new Error('Invalid Terraform.exe path.'));
      }
    });
  }

  getTerraformVersion(tfExePath: string) {
    return new Promise(async (resolve, reject) => {
      const appTfExePath = this.appConfigurationMainService.getItem(
        TERRAFORM_EXE_PATH_KEY
      );
      const tfVersionCmd = spawn(`"${appTfExePath}" version`, { shell: true });
      // MEMO : 워크스페이스마다 다른 테라폼 exe경로로 커맨드 실행시켜줘야될 경우 아래 주석으로 대체하기
      /*
      const tfVersionCmd = spawn(`${tfExePath} version`);
      */

      let tfVersionData = '';
      for await (const chunk of tfVersionCmd.stdout) {
        tfVersionData += chunk;
      }

      let tfVersionError = '';
      for await (const chunk of tfVersionCmd.stderr) {
        tfVersionError += chunk;
      }

      const tfVersionxitCode = await new Promise((resolve, reject) => {
        tfVersionCmd.on('close', resolve);
      });

      if (tfVersionxitCode) {
        reject(tfVersionError);
      }

      resolve(tfVersionData);
    });
  }

  doTerraformInit(
    folderUri: string,
    tfExePath: string,
    event: Electron.IpcMainInvokeEvent
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      // TODO : windows 외의 os에서도 돌아가게 분기처리하기
      const appTfExePath = this.appConfigurationMainService.getItem(
        TERRAFORM_EXE_PATH_KEY
      );
      const tfInitCmd = spawn(
        `"${appTfExePath}" -chdir="${folderUri}" init -no-color`,
        {
          shell: true,
        }
      );
      // MEMO : 워크스페이스마다 다른 테라폼 exe경로로 커맨드 실행시켜줘야될 경우 아래 주석으로 대체하기
      /*
       const tfInitCmd = spawn(`${tfExePath} -chdir="${folderUri}" init`, {
         shell: true,
       });
      */
      let tfInitData = '';
      for await (const chunk of tfInitCmd.stdout) {
        tfInitData += chunk;
        const chunkString = Buffer.from(chunk).toString();
        event.sender.send('studio:terraformInitStdout', chunkString);
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
      const appTfExePath = this.appConfigurationMainService.getItem(
        TERRAFORM_EXE_PATH_KEY
      );
      const graphCmd = spawn(`"${appTfExePath}" -chdir="${folderUri}" graph`, {
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
      // console.log('graphData: ', graphData);

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

  doTerraformPlan(
    folderUri: string,
    tfExePath: string,
    event: Electron.IpcMainInvokeEvent
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const appTfExePath = this.appConfigurationMainService.getItem(
        TERRAFORM_EXE_PATH_KEY
      );
      const tfPlanCmd = spawn(
        `"${appTfExePath}" -chdir="${folderUri}" plan -no-color`,
        {
          shell: true,
        }
      );
      let planData = '';
      for await (const chunk of tfPlanCmd.stdout) {
        planData += chunk;
        const chunkString = Buffer.from(chunk).toString();
        event.sender.send('studio:terraformPlanStdout', chunkString);
      }

      let planError = '';
      for await (const chunk of tfPlanCmd.stderr) {
        planError += chunk;
      }

      const planExitCode = await new Promise((resolve, reject) => {
        tfPlanCmd.on('close', resolve);
      });

      if (planExitCode) {
        reject(planError);
      }
      resolve(planData);
    });
  }

  doTerraformApply(
    folderUri: string,
    tfExePath: string,
    event: Electron.IpcMainInvokeEvent
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const appTfExePath = this.appConfigurationMainService.getItem(
        TERRAFORM_EXE_PATH_KEY
      );
      const tfPlanCmd = spawn(
        `"${appTfExePath}" -chdir="${folderUri}" apply -no-color -auto-approve`,
        {
          shell: true,
        }
      );
      let applyData = '';
      for await (const chunk of tfPlanCmd.stdout) {
        applyData += chunk;
        const chunkString = Buffer.from(chunk).toString();
        event.sender.send('studio:terraformApplyStdout', chunkString);
      }

      let applyError = '';
      for await (const chunk of tfPlanCmd.stderr) {
        applyError += chunk;
      }

      const applyExitCode = await new Promise((resolve, reject) => {
        tfPlanCmd.on('close', resolve);
      });

      if (applyExitCode) {
        reject(applyError);
      }
      resolve(applyData);
    });
  }

  registerListeners() {
    ipcMain.handle(
      'studio:doTerraformInit',
      async (event, arg: TerraformInitArgs): Promise<TerraformResponse> => {
        const { workspaceUid } = arg;
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
        const folderUri =
          this.workspaceMainService.workspaceManagementService.getWorkspaceTemporaryFolderPath(
            workspaceUid
          );
        try {
          // MEMO : 현재는 tfExePath 값은 사용안하고있어서 그냥 공백으로 넘겨줌.
          await this.doTerraformInit(folderUri, '', event);
          return {
            status: TerraformStatusType.SUCCESS,
            data: TerraformStatusType.SUCCESS,
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

        const folderUri =
          this.workspaceMainService.workspaceManagementService.getWorkspaceTemporaryFolderPath(
            workspaceUid
          );

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
    ipcMain.handle(
      'studio:getTerraformVersion',
      async (event, arg: TerraformVersionArgs) => {
        // MEMO : 워크스페이스 설정마다 다른 terraform.exe 실행시켜주려면 위와 아래부분 주석처리부분 사용하기
        /*
        const { workspaceUid } = arg;
        const workspaceConfig: WorkspaceIdentifier =
          this.workspaceMainService.workspaceManagementService.getWorkspaceConfig(
            workspaceUid
          );
        const tfExePath = workspaceConfig.terraformExePath || 'EMPTY';
        if (tfExePath === 'EMPTY') {
          return {
            status: TerraformStatusType.ERROR_TF_EXE_PATH,
            data: { message: 'Check terraform .exe file path setting.' },
          };
        }
        */
        try {
          const versionData = await this.getTerraformVersion('');
          return {
            status: TerraformStatusType.SUCCESS,
            data: { versionData },
          };
        } catch (message: any) {
          return {
            status: TerraformStatusType.ERROR,
            data: { message },
          };
        }
      }
    );
    ipcMain.handle(
      'studio:getTerraformPlan',
      async (event, arg: TerraformPlanArgs): Promise<TerraformResponse> => {
        const { workspaceUid } = arg;

        const folderUri =
          this.workspaceMainService.workspaceManagementService.getWorkspaceTemporaryFolderPath(
            workspaceUid
          );
        try {
          const planData: string = await this.doTerraformPlan(
            folderUri,
            '',
            event
          );
          return {
            status: TerraformStatusType.SUCCESS,
            data: { planData },
          };
        } catch (message: any) {
          return {
            status: TerraformStatusType.ERROR_PLAN,
            data: { message },
          };
        }
      }
    );
    ipcMain.handle(
      'studio:getTerraformApply',
      async (event, arg: TerraformPlanArgs): Promise<TerraformResponse> => {
        const { workspaceUid } = arg;

        const folderUri =
          this.workspaceMainService.workspaceManagementService.getWorkspaceTemporaryFolderPath(
            workspaceUid
          );
        try {
          const applyData: string = await this.doTerraformApply(
            folderUri,
            '',
            event
          );
          return {
            status: TerraformStatusType.SUCCESS,
            data: { applyData },
          };
        } catch (message: any) {
          return {
            status: TerraformStatusType.ERROR_PLAN,
            data: { message },
          };
        }
      }
    );
    ipcMain.handle(
      'studio:checkTerraformExe',
      async (
        event,
        args: TerraformCheckExeArgs
      ): Promise<TerraformResponse> => {
        try {
          const { terraformExePath } = args;
          const resultData = await this.checkTerraformExe(terraformExePath);
          return {
            status: TerraformStatusType.SUCCESS,
            data: resultData,
          };
        } catch (message: any) {
          return { status: TerraformStatusType.ERROR, data: { message } };
        }
      }
    );
  }
}
