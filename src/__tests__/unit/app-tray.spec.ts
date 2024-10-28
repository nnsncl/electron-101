import { expect, Mock, test, vi } from "vitest";
import { app, BrowserWindow, Menu } from "electron";
import { createTray } from "../../electron/services/trays";

const TRAY_ACTIONS = {
  main: ["Open", "Separator", "Quit"],
};

vi.mock("electron", () => {
  return {
    Tray: vi.fn().mockReturnValue({
      setContextMenu: vi.fn(),
      setToolTip: vi.fn(),
    }),
    Menu: {
      buildFromTemplate: vi.fn(),
    },
    app: {
      dock: {
        show: vi.fn(),
      },
      quit: vi.fn(),
      getAppPath: vi.fn().mockReturnValue("/"),
      getName: vi.fn().mockReturnValue("test-app-name"),
    },
  };
});

const MainWidowMock = {
  show: vi.fn(),
} satisfies Partial<BrowserWindow> as any as BrowserWindow;

test("App's Tray callbacks", () => {
  createTray(MainWidowMock);

  const calls = (Menu.buildFromTemplate as any as Mock).mock.calls;
  const args = calls[0] as Parameters<typeof Menu.buildFromTemplate>;
  const template = args[0];

  const openWindowAction = template[0];
  const quitAppAction = template.at(-1);

  expect(template.length).toBe(TRAY_ACTIONS.main.length);
  expect(openWindowAction?.label).toBe("Open main window...");
  expect(quitAppAction?.label).toBe("Quit test-app-name");

  /**
   * Initial default fn has params that it expects us to pass
   * the 3 null as any statement are here to prevent type error
   * and let the test run on the required elements/functions.
   */
  openWindowAction?.click?.(null as any, null as any, null as any);
  expect(MainWidowMock.show).toHaveBeenCalled();
  expect(app.dock.show).toHaveBeenCalled();

  quitAppAction?.click?.(null as any, null as any, null as any);
  expect(app.quit).toHaveBeenCalled();
});
