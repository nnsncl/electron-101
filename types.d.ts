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

type EventPayloadMapping = {
  statistics: ResourcesStatistics;
  getStaticData: OSResources;
};

interface Window {
  electron: {
    getStaticData: () => Promise<OSResources>;
    subscribeStatistics: (
      callback: (statistics: ResourcesStatistics) => void
    ) => void;
  };
}
