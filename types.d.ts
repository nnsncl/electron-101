/**
 * Resources
 */
type ResourcesStatistics = {
  cpu: number;
  ram: number;
  storage: {
    usage: number;
    total: number;
  };
};

type OSResources = {
  cpu_model: string;
  total_storage: number;
  total_memory: {
    mb: number;
    gb: number;
  };
};

/**
 * Views
 */
type View = "Performances" | "CPU" | "RAM" | "Storage";

/**
 * IPC Adapters
 */
type EventPayloadMapping = {
  statistics: ResourcesStatistics;
  getStaticData: OSResources;
  changeView: View;
};

/**
 * Context Bridges
 */

type UnsubscribeEvent = () => void;

interface Window {
  electron: {
    getStaticData: () => Promise<OSResources>;
    subscribeChangeView: (callback: (view: View) => void) => UnsubscribeEvent;
    subscribeStatistics: (
      callback: (statistics: ResourcesStatistics) => void
    ) => UnsubscribeEvent;
  };
}
