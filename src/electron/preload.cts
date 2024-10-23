const electron = require("electron");

/**
 * This contextBridge is used to link data between electron process and the main window.
 * exposeInMainWorld append the config passed to it to the Window object.
 */
electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback: (statistics: unknown) => void) => {
    electron.ipcRenderer.on("statistics", (_event, stats) => callback(stats));
  },
  getStaticData: () => electron.ipcRenderer.invoke("getStaticData"),
});
