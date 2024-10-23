import osUtils from "os-utils";
import fs from "fs";
import os from "os";
import { BrowserWindow } from "electron";

const POLL_INTERVAL = 500;

const getCPUUsage = () => {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
};
const getRAMUsage = () => {
  return 1 - osUtils.freememPercentage();
};
const getStorageData = () => {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/"); // Check Disk space
  const total = stats.bsize * stats.blocks; // Size of a single block * used blocks amount
  const free = stats.bsize * stats.bfree; // Size of a single block * unused blocks amount

  return {
    usage: 1 - free / total, // Available free space on the Disk
    total: Math.floor(total / 1e9), // Divide by 1e9 to translate to Gb
  };
};

export const getStaticData = () => {
  const cpuModel = os.cpus()[0].model;
  const totalStorage = getStorageData().total;
  const totalMemoryMB = Math.floor(osUtils.totalmem()); // Convert to Mb to Gb
  const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024); // Convert to Mb to Gb

  return {
    cpu_model: cpuModel,
    total_storage: totalStorage,
    total_memory: {
      mb: totalMemoryMB,
      gb: totalMemoryGB,
    },
  };
};
export const pollResources = (mainWindow: BrowserWindow) =>
  setInterval(async () => {
    const cpuUsage = await getCPUUsage();
    const ramUsage = getRAMUsage();
    const storageUsage = getStorageData();

    // Send data to the IPC Event Bus
    mainWindow.webContents.send("statistics", {
      cpu: cpuUsage,
      ram: ramUsage,
      storage: storageUsage,
    });
  }, POLL_INTERVAL);
