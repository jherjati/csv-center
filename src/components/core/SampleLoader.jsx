import { ArrowPathIcon, InboxArrowDownIcon } from "@heroicons/react/20/solid";
import { transfer } from "comlink";
import { useCallback, useState } from "preact/hooks";
import {
  DBWorker,
  isSampleData,
  layerConfigs,
  metricConfigs,
} from "../../contexts";
import { instrospectDB } from "../../utils";
import map from "../../sample/map.json";
import insight from "../../sample/insight.json";

function SampleLoader() {
  const [isImport, setIsImport] = useState(false);
  const handleLoad = useCallback(async () => {
    setIsImport(true);
    try {
      let res = await fetch("/sample.db");
      res = await res.arrayBuffer();
      res = new Uint8Array(res);
      await DBWorker.value.pleaseDo(
        {
          id: "load_session",
          action: "open",
          buffer: transfer(res, [res]),
        },
        [res]
      );
      await instrospectDB();
      layerConfigs.value = map;
      metricConfigs.value = insight;
      isSampleData.value = true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsImport(false);
    }
  }, []);

  return (
    <div
      style={{ animation: "forwards fadein2 1.6s" }}
      className='flex items-center'
    >
      <span className='pr-3 text-lg font-medium text-gray-900'>Or</span>
      <div className='border-t border-gray-300 grow' />

      <button
        onClick={handleLoad}
        role='button'
        className='w-48 inline-flex items-center justify-evenly rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
      >
        {isImport ? (
          <ArrowPathIcon className='w-5 h-5 animate-spin' />
        ) : (
          <>
            <InboxArrowDownIcon
              className='mr-2 h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
            <p>Load Sample Data</p>
          </>
        )}
      </button>
    </div>
  );
}

export default SampleLoader;
