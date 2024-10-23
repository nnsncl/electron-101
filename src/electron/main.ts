import path from "path";
import { app, BrowserWindow } from "electron";

import { DevMode, IPCMainHandler } from "./utils/index.js";
import { getPreloadPath } from "./utils/path.js";
import { getStaticData, pollResources } from "./services/resources.js";

const DEV_PATH = `http://localhost:3141`;
const PROD_PATH = "/dist-app/index.html";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  DevMode()
    ? mainWindow.loadURL(DEV_PATH)
    : mainWindow.loadFile(path.join(app.getAppPath(), PROD_PATH));

  pollResources(mainWindow);
  IPCMainHandler("getStaticData", () => getStaticData());
});
