import { spawn } from 'child_process';
import iconv from 'iconv-lite';
import { ipcMain } from 'electron';
import { IPCResponse } from 'main/base/common/ipc';
import {
  WorkspaceIdentifier,
  WorkspaceMainServiceInterface,
} from 'main/workspaces/common/workspace';

export class TerraformMainService {
  constructor(
    private readonly workspaceMainService: WorkspaceMainServiceInterface
  ) {
    this.registerListeners();
  }

  registerListeners() {
    ipcMain.handle(
      'studio:getTerraformGraph',
      async (event, arg: { workspaceUid: string }): Promise<IPCResponse> => {
        const { workspaceUid } = arg;
        const workspaceConfig: WorkspaceIdentifier =
          this.workspaceMainService.workspaceManagementService.getWorkspaceConfig(
            workspaceUid
          );
        /*
        const tfExePath = workspaceConfig.terraformExePath || 'EMPTY';
        if (tfExePath === 'EMPTY') {
          return {
            status: 'Error',
            data: { message: 'Check terraform .exe file path setting.' },
          };
        }
        */
        const folderUri = workspaceConfig.workspaceRealPath;
        // TODO : windows 외의 os에서도 돌아가게 분기처리하기
        // MEMO : 시스템 환경변수로 Path에 설정돼있는 terraform.exe만 실행시키도록 임시 처리.
        // MEMO : 워크스페이스 설정마다 다른 terraform.exe 실행시켜주려면 위와 아래부분 주석처리부분 사용하기
        const cmd = spawn(`terraform -chdir="${folderUri}" graph`, {
          shell: true,
        });
        /*
        const cmd = spawn(`"${tfExePath}" -chdir="${folderUri}" graph`, {
          shell: true,
        });
        console.log(
          '[INFO] Terraform command : ',
          `"${tfExePath}" -chdir="${folderUri}" graph`
        );
        */
        let data = '';
        for await (const chunk of cmd.stdout) {
          data += iconv.decode(chunk, 'euc-kr');
        }

        let error = '';
        for await (const chunk of cmd.stderr) {
          error += iconv.decode(chunk, 'euc-kr');
        }

        const exitCode = await new Promise((resolve, reject) => {
          cmd.on('close', resolve);
        });

        if (exitCode) {
          return {
            status: 'Error',
            data: { message: error },
          };
        }

        return {
          status: 'Success',
          data: { graph: data },
        };
      }
    );
  }
}
