import { TerraformResponse } from '../../../main/terraform-command/common/terraform';

export const getTerraformGraph = (
  workspaceUid: string
): Promise<TerraformResponse> => {
  return new Promise(async (resolve, reject) => {
    const response: TerraformResponse =
      await window.electron.ipcRenderer.invoke('studio:getTerraformGraph', {
        workspaceUid,
      });
    resolve(response);
  });
};

export const doTerraformInit = (
  workspaceUid: string
): Promise<TerraformResponse> => {
  return new Promise(async (resolve, reject) => {
    const response: TerraformResponse =
      await window.electron.ipcRenderer.invoke('studio:doTerraformInit', {
        workspaceUid,
      });
    resolve(response);
  });
};
