import { BrowserWindow, Menu, app } from "electron";
import { DevMode } from "../utils/index.js";
import { IPCSendAdapter } from "../handlers/ipc-adapters.js";

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
          label: "Go to main view",
          click: () =>
            IPCSendAdapter("changeView", mainWindow.webContents, "CPU"),
        },
        { type: "separator" },
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
        { type: "separator" },
        {
          label: "Reports",
          type: "submenu",
          submenu: [
            {
              label: "Performances",
              click: () =>
                IPCSendAdapter(
                  "changeView",
                  mainWindow.webContents,
                  "Performances"
                ),
            },
            {
              label: "CPU usage",
              click: () =>
                IPCSendAdapter("changeView", mainWindow.webContents, "CPU"),
            },
            {
              label: "RAM usage",
              click: () =>
                IPCSendAdapter("changeView", mainWindow.webContents, "RAM"),
            },
            {
              label: "Storage",
              click: () =>
                IPCSendAdapter("changeView", mainWindow.webContents, "Storage"),
            },
          ],
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
};
