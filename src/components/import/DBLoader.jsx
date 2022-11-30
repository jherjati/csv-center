import { useCallback, useState } from "preact/hooks";
import { useLocation } from "wouter-preact";
import { DBWorker } from "../../constants";
import { instrospectDB } from "../../utils";
import { transfer } from "comlink";
import { ArrowPathIcon, InboxArrowDownIcon } from "@heroicons/react/20/solid";

function DBLoader() {
  const [_, setLocation] = useLocation();
  const [isImport, setIsImport] = useState(false);
  const loadSession = useCallback((event) => {
    setIsImport(true);
    const reader = new FileReader();
    reader.onload = async function () {
      try {
        await DBWorker.pleaseDo(
          {
            id: "load_session",
            action: "open",
            buffer: transfer(reader.result, [reader.result]),
          },
          [reader.result]
        );
        await instrospectDB();
        setIsImport(false);
        setLocation("/manage");
      } catch (error) {
        setIsImport(false);
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(event.target.files[0]);
  }, []);

  return (
    <div
      style={{ animation: "forwards fadein3 1.6s" }}
      className='flex items-center px-9'
    >
      <span className='pr-3 text-lg font-medium text-gray-900'>Or</span>
      <div className='border-t border-gray-300 grow' />
      <input
        accept='.db'
        type='file'
        name='load_session'
        id='load_session'
        className='hidden'
        onChange={loadSession}
      />
      <label
        htmlFor='load_session'
        role='button'
        className='w-40 inline-flex items-center justify-evenly rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
      >
        {isImport ? (
          <ArrowPathIcon className='w-5 h-5 animate-spin' />
        ) : (
          <>
            <InboxArrowDownIcon
              className='mr-2 h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
            <p>Load Session</p>
          </>
        )}
      </label>
    </div>
  );
}

export default DBLoader;
