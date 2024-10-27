import path from "path";
import { BrowserWindow, Menu, Tray, app } from "electron";
import { getAssetPath } from "../utils/index.js";

export const closeEventHandler = (mainWindow: BrowserWindow) => {
  let willClose = false;

  mainWindow.on("close", (event) => {
    if (willClose) return;

    event.preventDefault();
    mainWindow.hide();

    /**
     * While mainWindow.hide() closes the window yet still keep the tray,
     * on macOS, the Dock keeps the app icon active. If it is defined it also gets closed.
     */
    if (app.dock) app.dock.hide();
  });

  /**
   * If willClose is true, meaning that a before-quit event had been recieved,
   * skip the part bellow and continue with electon's default behavior
   */
  app.on("before-quit", () => {
    willClose = true;
  });

  /**
   * If the app has been put on iddle, minified,.. Pop a new window when
   * the Tray icon is clicked
   */
  mainWindow.on("show", () => {
    willClose = false;
  });
};

export const createTray = (mainWindow: BrowserWindow) => {
  const appName = app.getName();
  const tray = new Tray(
    path.join(
      getAssetPath(),
      process.platform === "darwin" ? "tray-iconTemplate.png" : "tray-icon.png"
    )
  );

  const menu = Menu.buildFromTemplate([
    {
      label: "Open main window",
      click: () => {
        mainWindow.show();
        if (app.dock) app.dock.show(); // macOS
      },
    },
    { type: "separator" },
    { label: `Quit ${appName}`, click: () => app.quit() },
  ]);

  tray.setToolTip(appName);
  tray.setContextMenu(menu);
};
