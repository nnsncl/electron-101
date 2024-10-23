import { ipcMain, WebContents } from "electron";

export const DevMode = (): boolean => {
  return process.env.NODE_ENV === "development";
};

export const IPCMainHandler = <Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key]
) => ipcMain.handle(key, () => handler());

export const IPCSendHandler = <Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) => webContents.send(key, payload);
