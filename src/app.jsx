import { Suspense, lazy } from "preact/compat";
import { Route, Switch } from "wouter-preact";

const Map = lazy(() => import("./pages/Map"));
const Import = lazy(() => import("./pages/Import"));
const Manage = lazy(() => import("./pages/Manage"));
const Insight = lazy(() => import("./pages/Insight"));
const Compare = lazy(() => import("./pages/Compare"));
const Command = lazy(() => import("./pages/Command"));
const Guide = lazy(() => import("./pages/Guide"));

import Mobile from "./pages/Mobile";
import SWModal from "./components/core/SWModal";
import SnackBar from "./components/core/Snackbar";
import Sidebar from "./components/layout/Sidebar";

import { useInitDB } from "./hooks";
import { isSampleData } from "./contexts";

export default function App() {
  useInitDB();

  return (
    <>
      <div className='hidden lg:block h-full'>
        <Sidebar />

        <div className='flex flex-1 flex-col pl-56 h-full'>
          <Switch className='flex-1'>
            <Route path='/'>
              <Suspense fallback={<></>}>
                <Import />
              </Suspense>
            </Route>
            <Route path='/manage'>
              <Suspense fallback={<></>}>
                <Manage key={isSampleData.value} />
              </Suspense>
            </Route>
            <Route path='/map'>
              <Suspense fallback={<></>}>
                <Map key={isSampleData.value} />
              </Suspense>
            </Route>
            <Route path='/insight'>
              <Suspense fallback={<></>}>
                <Insight key={isSampleData.value} />
              </Suspense>
            </Route>
            <Route path='/compare'>
              <Suspense fallback={<></>}>
                <Compare key={isSampleData.value} />
              </Suspense>
            </Route>
            <Route path='/command'>
              <Suspense fallback={<></>}>
                <Command />
              </Suspense>
            </Route>
            <Route path='/guide'>
              <Suspense fallback={<></>}>
                <Guide />
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
