import { BrowserWindow, Menu, app } from "electron";
import { DevMode } from "../utils/index.js";

export const createMenu = (mainWindow: BrowserWindow) => {
  const appName = app.getName();

  const menu = Menu.buildFromTemplate([
    {
      label: process.platform === "darwin" ? undefined : "App",
      type: "submenu",
      submenu: [
        {
          visible: DevMode(),
          label: "DevTools",
          click: () => mainWindow.webContents.openDevTools(),
        },
        { type: "separator", visible: DevMode() },
        { label: `Quit ${appName}`, click: () => app.quit() },
      ],
    },
    {
      label: "View",
      type: "submenu",
      submenu: [
        {
          label: "Open view...",
          click: () => {
            mainWindow.show();
            if (app.dock) app.dock.show(); // macOS
          },
        },
        { label: "Hide view", click: () => mainWindow.minimize() },
        { type: "separator" },
        {
          label: "Appearance",
          type: "submenu",
          submenu: [
            { label: "Full Screen", click: () => mainWindow.maximize() },
            { label: "Center View", click: () => mainWindow.center() },
          ],
        },
      ],
    },
    {
      label: "Performances",
      type: "submenu",
      submenu: [{ label: "CPU" }, { label: "RAM" }, { label: "Storage" }],
    },
  ]);

  Menu.setApplicationMenu(menu);
};
