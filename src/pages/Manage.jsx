import { useErrorBoundary, useState } from "preact/hooks";
import PageError from "../components/core/PageError";
import DbTable from "../components/manage/DbTable";
import EmptyDb from "../components/core/EmptyDb";
import { formats, isSampleData } from "../contexts";
import { useTables } from "../hooks";
import { setSnackContent } from "../utils";
import { InboxArrowDownIcon } from "@heroicons/react/20/solid";
import { DBWorker } from "../constants";
import { transfer } from "comlink";

function Manage() {
  const { dbTables } = useTables();
  const [activeTable, setActiveTable] = useState(0);

  const [error, resetError] = useErrorBoundary((error) => {
    console.error(error);
    setSnackContent([
      "error",
      "Unexpected Thing Happened",
      "Don't worry, refresh button is your friend",
    ]);
  });

  if (error) {
    return <PageError resetError={resetError} />;
  } else {
    return (
      <main className='py-6'>
        <div className='mx-auto max-w-7xl px-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>Manage</h1>
        </div>
        <div className='mx-auto max-w-7xl px-8'>
          {(!dbTables || !dbTables.length) && (
            <>
              <EmptyDb />
              <div
                style={{ animation: "forwards fadein2 1.6s" }}
                className='flex items-center'
              >
                <span className='pr-3 text-lg font-medium text-gray-900'>
                  Or
                </span>
                <div className='border-t border-gray-300 grow' />

                <button
                  onClick={async () => {
                    let res = await fetch("/sql/chinook.db");
                    res = await res.arrayBuffer();
                    res = new Uint8Array(res);
                    DBWorker.pleaseDo(
                      {
                        id: "load_session",
                        action: "open",
                        buffer: transfer(res, [res]),
                      },
                      [res]
                    ).then(({ ready }) => {
                      if (ready) {
                        isSampleData.value = true;
                      }
                    });
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
            </>
          )}
          {dbTables && (
            <DbTable
              key={activeTable}
              name={dbTables[activeTable]}
              isInFormats={Object.keys(formats.value).includes(
                dbTables[activeTable]
              )}
            >
              <select
                className='block w-56 rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm'
                value={activeTable}
                onChange={(e) => {
                  setActiveTable(e.target.value);
                }}
              >
                {dbTables.map((name, idx) => (
                  <option value={idx}>{name}</option>
                ))}
              </select>
            </DbTable>
          )}
        </div>
      </main>
    );
  }
}

export default Manage;
