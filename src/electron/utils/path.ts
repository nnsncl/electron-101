import path from "path";
import { app } from "electron";
import { DevMode } from "./index.js";

/**
 * Specify the directory used by electron based on the environment.
 * Using common js prevents from futher workarounds.
 *
 * The path is set to '.' in dev mode to access the preload script from the dist-electron dir localted.
 * On production mode, it is set to '..' because the code lives in the app/Content/app.asar file, the path nedds
 * to point one level up in order to be able to access the resources of the bundled app.
 */
export const getPreloadPath = () => {
  return path.join(
    app.getAppPath(),
    DevMode() ? "." : "..",
    "/dist-electron/preload.cjs"
  );
};
