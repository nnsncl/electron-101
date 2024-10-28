import { test, expect, _electron } from "@playwright/test";

let ElectronApp: Awaited<ReturnType<typeof _electron.launch>>;
let MainElectronWindow: Awaited<ReturnType<typeof ElectronApp.firstWindow>>;

const APP_ROUTES = {
  main: ["Default", "Views"],
  default: ["DevTools", "Separator", "Quit"],
  views: [
    "MainView",
    "Separator",
    "OpenView",
    "HideView",
    "Separator",
    "Appearances",
    "Separator",
    "Reports",
  ],
};

/**
 * Mock preload script behavior on test executions
 * Checks every 100ms if the app in monted; once it is, tests can be run safely,
 * clear the interval function.
 */
const awaitPreloadScript = async () => {
  const MS_INTERVAL = 100;

  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const contextBridge = await MainElectronWindow.evaluate(() => {
        return (window as Window & { electron?: any }).electron;
      });

      if (contextBridge) {
        clearInterval(interval);
        resolve(true);
      }
    }, MS_INTERVAL);
  });
};

test.beforeEach(async () => {
  ElectronApp = await _electron.launch({
    args: ["."],
    env: { NODE_ENV: "development" },
  });

  MainElectronWindow = await ElectronApp.firstWindow();
  await awaitPreloadScript();
});
test.afterEach(async () => {
  await ElectronApp.close();
});

test("Open the application when it is ready", async () => {
  const hasWindowOpen = await ElectronApp.evaluate((electron) => {
    return electron.BrowserWindow.getAllWindows()[0].isVisible();
  });
  await expect(hasWindowOpen).toBe(true);
});

test("App's Custom Menus are created", async () => {
  const appMenu = await ElectronApp.evaluate((electron) => {
    return electron.Menu.getApplicationMenu();
  });

  expect(appMenu).not.toBeNull();

  const defaultMenu = appMenu?.items[0];
  const viewMenu = appMenu?.items[1];

  expect(defaultMenu?.label).toBe("");
  expect(viewMenu?.label).toBe("View");

  expect(appMenu?.items.length).toBe(APP_ROUTES.main.length);
  expect(defaultMenu?.submenu?.items.length).toBe(APP_ROUTES.default.length);
  expect(viewMenu?.submenu?.items.length).toBe(APP_ROUTES.views.length);
});
