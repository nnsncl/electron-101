import { app, BrowserWindow, Tray } from "electron";

import { IPCMainAdapter } from "./handlers/ipc-adapters.js";
import {
  getPreloadPath,
  getUIPath,
  DevMode,
  getAssetPath,
} from "./utils/index.js";
import { getStaticData, pollResources } from "./services/get-resources.js";

import { DEV_PATH, STATIC_DATA_EVENT_KEY } from "./global/index.js";
import path from "path";

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
  DevMode() ? mainWindow.loadURL(DEV_PATH) : mainWindow.loadFile(getUIPath());

  /**
   * Run the IPC send function set to extract and transform the resources details,
   * then, run the IPC handle function using the typesafe method IPCMainAdapter to extract
   * and transform static resources data
   */
  pollResources(mainWindow);
  IPCMainAdapter(STATIC_DATA_EVENT_KEY, () => getStaticData());

  /**
   * Init app's tray
   */
  new Tray(
    path.join(
      getAssetPath(),
      process.platform === "darwin" ? "tray-iconTemplate.png" : "tray-icon.png"
    )
  );
});
