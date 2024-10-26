import React from "react";
import "./App.css";

const HAS_ELECTRON_BRIDGE = Boolean(window?.electron);

function App() {
  const [deviceStaticDetails, setDeviceStaticDetails] =
    React.useState<OSResources | null>(null);

  const [applicationStats, setApplicationStats] =
    React.useState<ResourcesStatistics | null>(null);
  const deferredAppStats = React.useDeferredValue(applicationStats);

  React.useEffect(() => {
    if (HAS_ELECTRON_BRIDGE) {
      /**
       * subscribeStatistics returns an unsub function after the callback is executed
       * Since useEffect fires every time an items of its deps array has changed and at every
       * render, this function will sub -> unsub to the corresponding events automatically
       */

      const fireThenUnsubGetStats = window?.electron.subscribeStatistics(
        (stats) => setApplicationStats(stats)
      );
      if (typeof deviceStaticDetails === typeof null) {
        window?.electron
          .getStaticData()
          .then((value) => setDeviceStaticDetails(value));
      }

      return fireThenUnsubGetStats;
    }
  }, []);

  return (
    <section>
      {/* <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1> */}
      {HAS_ELECTRON_BRIDGE && (
        <div>
          <p>CPU usage:&nbsp;{deferredAppStats?.cpu.toFixed(2)}%</p>
          <p>CPU model:&nbsp;{deviceStaticDetails?.cpu_model}</p>
          <p>RAM usage:&nbsp;{deferredAppStats?.cpu.toFixed(2)}%</p>
          <p>
            Storage usage:&nbsp;{deferredAppStats?.storage?.usage.toFixed(2)}%
          </p>
          <p>Storage capacity:&nbsp;{deferredAppStats?.storage?.total}Gb</p>
          <p>Memory capacity:&nbsp;{deviceStaticDetails?.total_memory?.gb}Gb</p>
        </div>
      )}
    </section>
  );
}

export default App;
