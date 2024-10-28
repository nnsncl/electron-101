import React from "react";

const HAS_ELECTRON_BRIDGE = Boolean(window?.electron);

function App() {
  const [currentView, setCurrentView] = React.useState<View | null>(
    "Performances"
  );
  const [deviceStaticDetails, setDeviceStaticDetails] =
    React.useState<OSResources | null>(null);

  const [applicationStats, setApplicationStats] =
    React.useState<ResourcesStatistics | null>(null);
  const deferredAppStats = React.useDeferredValue(applicationStats);

  if (HAS_ELECTRON_BRIDGE) {
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

    React.useEffect(() => {
      if (HAS_ELECTRON_BRIDGE) {
        return window.electron.subscribeChangeView((view) =>
          setCurrentView(view)
        );
      } else setCurrentView(null);
    }, []);
  }

  return (
    <section>
      <h1>Electron 101</h1>
      {HAS_ELECTRON_BRIDGE && (
        <div>
          {currentView === "Performances" && (
            <React.Fragment>
              <p>Storage capacity:&nbsp;{deferredAppStats?.storage?.total}Gb</p>
              <p>
                Memory capacity:&nbsp;{deviceStaticDetails?.total_memory?.gb}Gb
              </p>
            </React.Fragment>
          )}
          {["Performances", "CPU"].includes(currentView) && (
            <React.Fragment>
              <p>CPU usage:&nbsp;{deferredAppStats?.cpu.toFixed(2)}%</p>
              <p>CPU model:&nbsp;{deviceStaticDetails?.cpu_model}</p>
            </React.Fragment>
          )}
          {["Performances", "RAM"].includes(currentView) && (
            <p>RAM usage:&nbsp;{deferredAppStats?.cpu.toFixed(2)}%</p>
          )}
          {["Performances", "Storage"].includes(currentView) && (
            <p>
              Storage usage:&nbsp;{deferredAppStats?.storage?.usage.toFixed(2)}%
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default App;
