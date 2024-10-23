import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { DevMode } from "./utils.js";
import { getStaticData, pollResources } from "./resources.js";
import { getPreloadPath } from "./path.js";

const DEV_PATH = `http://localhost:3141`;
const PROD_PATH = "/dist-react/index.html";

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
  ipcMain.handle("getStaticData", (_event) => {
    return getStaticData();
  });
});
