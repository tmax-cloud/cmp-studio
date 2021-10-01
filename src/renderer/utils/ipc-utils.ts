export const getAppConfig = async () => {
  const appConfigJson = await window.electron.ipcRenderer.invoke(
    'read-app-config-file'
  );
  return appConfigJson;
};
