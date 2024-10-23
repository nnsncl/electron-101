import { app, BrowserWindow } from "electron";
import path from "path";
import { DevMode } from "./utils.js";

const DEV_PATH = `http://localhost:3141`;
const PROD_PATH = "/dist-react/index.html";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({});

  DevMode()
    ? mainWindow.loadURL(DEV_PATH)
    : mainWindow.loadFile(path.join(app.getAppPath(), PROD_PATH));
});
