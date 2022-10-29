import { useErrorBoundary, useState } from "preact/hooks";
import OrAction from "../components/core/OrAction";
import PageError from "../components/core/PageError";
import DbTable from "../components/manage/DbTable";
import EmptyDb from "../components/manage/EmptyDb";
import { dbWorker, formats } from "../contexts";
import { useTables } from "../hooks";
import { setSnackContent } from "../utils";

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
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>Manage</h1>
        </div>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 md:px-8'>
          {(!dbTables || !dbTables.length) && <EmptyDb />}
          {dbTables && (
            <DbTable
              key={activeTable}
              name={dbTables[activeTable]}
              isInFormats={Object.keys(formats.value).includes(
                dbTables[activeTable]
              )}
            >
              <select
                className='block w-64 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
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
        <OrAction
          label={"Save Current Session"}
          onClick={(event) => {
            event.preventDefault();
            dbWorker.value.postMessage({
              id: "save session",
              action: "export",
            });
          }}
        />
      </main>
    );
  }
}

export default Manage;
