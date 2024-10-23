import path from "path";
import { app, BrowserWindow } from "electron";

import { IPCMainHandler } from "./handlers/ipc-handlers.js";
import { getPreloadPath, DevMode } from "./utils/index.js";
import { getStaticData, pollResources } from "./services/get-resources.js";

import { DEV_PATH, PROD_PATH, STATIC_DATA_EVENT_KEY } from "./global/index.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      // Fire the getPreloadPath script before launching the app to init the Context Bridge
      preload: getPreloadPath(),
    },
  });

  /**
   * Render the localhost client on dev mode,
   * on production mode, render the index.html generated after building the app
   */
  DevMode()
    ? mainWindow.loadURL(DEV_PATH)
    : mainWindow.loadFile(path.join(app.getAppPath(), PROD_PATH));

  /**
   * Run the IPC send function set to extract and transform the resources details,
   * then, run the IPC handle function using the typesafe method IPCMainHandler to extract
   * and transform static resources data
   */
  pollResources(mainWindow);
  IPCMainHandler(STATIC_DATA_EVENT_KEY, () => getStaticData());
});
