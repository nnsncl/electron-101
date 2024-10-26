const electron = require("electron");

/**
 * The following functions needs to be defined in the preload.cjs/tsc script
 * in order to be accessible inside of the file scope.
 */
const IPCInvoke = <Key extends keyof EventPayloadMapping>(key: Key) =>
  electron.ipcRenderer.invoke(key);

const IPCOnHandler = <Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) => {
  const callbackFunction = (_event: Electron.IpcRendererEvent, payload: any) =>
    callback(payload);

  /**
   * Listen for the Key event and fire callbackFunction once the app subscribes to it;
   * Once callbackFunction has been executed, return a function that turns off the sub event.
   * This prevents events payloads to pile up in electron's thread and cause perf issues.
   */
  electron.ipcRenderer.on(key, callbackFunction);
  return () => electron.ipcRenderer.off(key, callbackFunction);
};

/**
 * This contextBridge is used to link data between electron process and the main window.
 * exposeInMainWorld append the config passed to it to the Window object.
 */
electron.contextBridge.exposeInMainWorld("electron", {
  getStaticData: () => IPCInvoke("getStaticData"),
  subscribeStatistics: (callback) =>
    IPCOnHandler("statistics", (stats) => callback(stats)),
} satisfies Window["electron"]);
