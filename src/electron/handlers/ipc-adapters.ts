import { ipcMain, WebContents } from "electron";
import { validateEventFrame } from "../validators/events-validators.js";

/**
 * Adapters encapsulate IPC processes in a Typesafe shell to prevent "any" types
 * in the inputs/outputs communication events between the App and the Backend.
 */

export const IPCMainAdapter = <Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key]
) =>
  ipcMain.handle(key, (event) => {
    /**
     * senderFrame gets information about the location in the browser
     * and checks if the code has sent this event.
     *
     * validateEventFrame check the events and kills the process if
     * the conditions it contains aren't met.
     *
     */
    validateEventFrame(event.senderFrame);
    return handler();
  });

export const IPCSendAdapter = <Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) => webContents.send(key, payload);
