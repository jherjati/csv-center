import { Suspense, lazy, useState, useEffect } from "preact/compat";
import { Route, Switch } from "wouter-preact";

const Map = lazy(() => import("./pages/Map"));
const Import = lazy(() => import("./pages/Import"));
const Manage = lazy(() => import("./pages/Manage"));
const Insight = lazy(() => import("./pages/Insight"));
const Compare = lazy(() => import("./pages/Compare"));
const Command = lazy(() => import("./pages/Command"));
const Guide = lazy(() => import("./pages/Guide"));
const Empty = lazy(() => import("./pages/Empty"));

import Mobile from "./pages/Mobile";
import SWModal from "./components/core/SWModal";
import SnackBar from "./components/core/Snackbar";
import Sidebar from "./components/layout/Sidebar";

import { useInitDB } from "./hooks";
import { DBWorker, formats } from "./contexts";
import PageHOC from "./components/core/PageHOC";

export default function App() {
  useInitDB();

  const [dbTables, setDbTables] = useState();
  useEffect(() => {
    DBWorker.value
      .pleaseDo({
        id: "browse table",
        action: "exec",
        sql: `SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';`,
      })
      .then(({ results, error }) => {
        if (error) throw Error(error);
        if (results) {
          const newTables = results[0]?.values?.map((el) => el[0]);
          setDbTables(newTables);
        }
      })
      .catch(console.error);
  }, [Object.keys(formats.value)]);

  return (
    <>
      <div className='hidden lg:block h-full'>
        <Sidebar />

        <div className='flex flex-1 flex-col pl-56 h-full'>
          <Switch className='flex-1'>
            <Route path='/'>
              <Suspense fallback={<></>}>
                <PageHOC>
                  <Import />
                </PageHOC>
              </Suspense>
            </Route>
            <Route path='/manage'>
              <Suspense fallback={<></>}>
                {!dbTables || !dbTables.length ? (
                  <Empty />
                ) : (
                  <PageHOC>
                    <Manage dbTables={dbTables} />
                  </PageHOC>
                )}
              </Suspense>
            </Route>
            <Route path='/map'>
              <Suspense fallback={<></>}>
                {!dbTables || !dbTables.length ? (
                  <Empty />
                ) : (
                  <PageHOC>
                    <Map dbTables={dbTables} />
                  </PageHOC>
                )}
              </Suspense>
            </Route>
            <Route path='/insight'>
              <Suspense fallback={<></>}>
                {!dbTables || !dbTables.length ? (
                  <Empty />
                ) : (
                  <PageHOC>
                    <Insight dbTables={dbTables} />
                  </PageHOC>
                )}
              </Suspense>
            </Route>
            <Route path='/compare'>
              <Suspense fallback={<></>}>
                {!dbTables || !dbTables.length ? (
                  <Empty />
                ) : (
                  <PageHOC>
                    <Compare dbTables={dbTables} />
                  </PageHOC>
                )}
              </Suspense>
            </Route>
            <Route path='/command'>
              <Suspense fallback={<></>}>
                <PageHOC>
                  <Command />
                </PageHOC>
              </Suspense>
            </Route>
            <Route path='/guide'>
              <Suspense fallback={<></>}>
                <PageHOC>
                  <Guide />
                </PageHOC>
              </Suspense>
            </Route>
          </Switch>
        </div>
        <SWModal />
        <SnackBar />
      </div>
      <Mobile />
    </>
  );
}
