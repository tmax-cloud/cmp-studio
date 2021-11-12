import * as TerraformTypes from '@main/terraform-command/common/terraform';

export const getTerraformGraph = (args: TerraformTypes.TerraformGraphArgs) =>
  window.electron.ipcRenderer.invoke('studio:getTerraformGraph', args);

export const doTerraformInit = (args: TerraformTypes.TerraformInitArgs) =>
  window.electron.ipcRenderer.invoke('studio:doTerraformInit', args);

export const getTerraformVersion = (
  args: TerraformTypes.TerraformVersionArgs
) => window.electron.ipcRenderer.invoke('studio:getTerraformVersion', args);

export const getTerraformPlan = (args: TerraformTypes.TerraformPlanArgs) =>
  window.electron.ipcRenderer.invoke('studio:getTerraformPlan', args);

export const checkTerraformExe = (args: TerraformTypes.TerraformCheckExeArgs) =>
  window.electron.ipcRenderer.invoke('studio:checkTerraformExe', args);
