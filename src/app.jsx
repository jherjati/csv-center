import { Suspense, lazy } from "preact/compat";
import { Route, Switch } from "wouter-preact";

const Insight = lazy(() => import("./pages/Insight"));
const Import = lazy(() => import("./pages/Import"));
const Manage = lazy(() => import("./pages/Manage"));
// const Compare = lazy(() => import("./pages/Compare"));
const Command = lazy(() => import("./pages/Command"));
const Guidance = lazy(() => import("./pages/Guidance"));

import SWModal from "./components/core/SWModal";
import SnackBar from "./components/core/Snackbar";
import Sidebar from "./components/layout/Sidebar";
import { useInitDB } from "./hooks";

export default function App() {
  useInitDB();

  return (
    <>
      <Sidebar />

      <div className='flex flex-1 flex-col pl-56'>
        <Switch className='flex-1'>
          <Route path='/'>
            <Suspense fallback={<></>}>
              <Import />
            </Suspense>
          </Route>
          <Route path='/manage'>
            <Suspense fallback={<></>}>
              <Manage />
            </Suspense>
          </Route>
          {/* <Route path='/compare'>
            <Suspense fallback={<></>}>
              <Compare />
            </Suspense>
          </Route> */}
          <Route path='/command'>
            <Suspense fallback={<></>}>
              <Command />
            </Suspense>
          </Route>
          <Route path='/insight'>
            <Suspense fallback={<></>}>
              <Insight />
            </Suspense>
          </Route>
          <Route path='/guidance'>
            <Suspense fallback={<></>}>
              <Guidance />
            </Suspense>
          </Route>
        </Switch>
      </div>
      <SWModal />
      <SnackBar />
    </>
  );
}
