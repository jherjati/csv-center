import { InboxArrowDownIcon } from "@heroicons/react/20/solid";
import { transfer } from "comlink";
import { DBWorker } from "../../constants";
import { formats, isSampleData } from "../../contexts";
import { instrospectDB } from "../../utils";

function SampleLoader() {
  return (
    <div
      style={{ animation: "forwards fadein2 1.6s" }}
      className='flex items-center'
    >
      <span className='pr-3 text-lg font-medium text-gray-900'>Or</span>
      <div className='border-t border-gray-300 grow' />

      <button
        onClick={async () => {
          let res = await fetch("/sample/sample.db");
          res = await res.arrayBuffer();
          res = new Uint8Array(res);
          await DBWorker.pleaseDo(
            {
              id: "load_session",
              action: "open",
              buffer: transfer(res, [res]),
            },
            [res]
          );
          await instrospectDB();
          isSampleData.value = true;
        }}
        role='button'
        className='inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
      >
        <InboxArrowDownIcon
          className='mr-2 h-5 w-5 text-gray-400'
          aria-hidden='true'
        />
        <p>Load Sample Data</p>
      </button>
    </div>
  );
}

export default SampleLoader;
