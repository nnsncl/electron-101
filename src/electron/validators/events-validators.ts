import { WebFrameMain } from "electron";
import { pathToFileURL } from "url";
import { DEV_HOST } from "../global/app-constants.js";
import { DevMode, getUIPath } from "../utils/index.js";

export const validateEventFrame = (frame: WebFrameMain) => {
  /**
   * [IMPORTANT!] These validations are a starting point and needs to be refined
   * in order to prevent security breaches.
   */
  if (DevMode() && new URL(frame.url).host === DEV_HOST) return;
  if (frame.url !== pathToFileURL(getUIPath()).toString())
    throw new Error("🚨 [validateEventFrame] - MALICIOUS EVENT");
};
