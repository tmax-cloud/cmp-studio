import { spawn } from 'child_process';
// import iconv from 'iconv-lite';
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
        const tfExePath = workspaceConfig.terraformExePath || 'EMPTY';
        if (tfExePath === 'EMPTY') {
          return {
            status: 'Error',
            data: { message: 'Check terraform .exe file path setting.' },
          };
        }
        const folderUri = workspaceConfig.workspaceRealPath;
        // TODO : windows 외의 os에서도 돌아가게 분기처리하기
        const cmd = spawn(`${tfExePath} -chdir=${folderUri} graph`, {
          shell: true,
        });
        // TODO : 폴더명에 띄어쓰기 있으면 안됨..
        console.log(
          '[INFO] Terraform command : ',
          `${tfExePath} -chdir=${folderUri} graph`
        );

        let data = '';
        for await (const chunk of cmd.stdout) {
          data += chunk;
        }

        let error = null;
        for await (const chunk of cmd.stderr) {
          error += chunk;
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
