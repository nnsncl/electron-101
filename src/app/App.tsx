import React from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [deviceStaticDetails, setDeviceStaticDetails] =
    React.useState<OSResources | null>(null);
  const [applicationStats, setApplicationStats] =
    React.useState<ResourcesStatistics | null>(null);
  const deferredAppStats = React.useDeferredValue(applicationStats);

  React.useEffect(() => {
    if (window?.electron) {
      if (typeof deviceStaticDetails === typeof null) {
        window?.electron
          .getStaticData()
          .then((value) => setDeviceStaticDetails(value));
      }

      window?.electron.subscribeStatistics((stats) =>
        setApplicationStats(stats)
      );
    }
  }, []);

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <p>CPU usage:&nbsp;{deferredAppStats?.cpu.toFixed(2)}%</p>
      <p>CPU model:&nbsp;{deviceStaticDetails?.cpu_model}</p>
      <p>RAM usage:&nbsp;{deferredAppStats?.cpu.toFixed(2)}%</p>
      <p>Storage usage:&nbsp;{deferredAppStats?.storage?.usage.toFixed(2)}%</p>
      <p>Storage capacity:&nbsp;{deferredAppStats?.storage?.total}Gb</p>
      <p>Memory capacity:&nbsp;{deviceStaticDetails?.total_memory?.gb}Gb</p>
    </>
  );
}

export default App;
