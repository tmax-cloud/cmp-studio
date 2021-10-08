const { contextBridge, ipcRenderer } = require('electron');

/**
 * @param {string} channel
 * @returns {true | never}
 */
function validateIPC(channel) {
  if (!channel || !channel.startsWith('studio:')) {
    throw new Error(`Unsupported event IPC channel '${channel}'`);
  }

  return true;
}

// MEMO : Electron ipcRenderer 세팅
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('studio:ipc-example', 'ping');
    },
    on(channel, func) {
      if (validateIPC(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      if (validateIPC(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    send(channel, args) {
      if (validateIPC(channel)) {
        ipcRenderer.send(channel, args);
      }
    },
    invoke(channel, args) {
      if (validateIPC(channel)) {
        return ipcRenderer.invoke(channel, args);
      }
    },
  },
});
