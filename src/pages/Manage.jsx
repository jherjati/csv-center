import { useEffect, useErrorBoundary, useState } from "preact/hooks";
import PageError from "../components/core/PageError";
import DbTable from "../components/manage/DbTable";
import EmptyDb from "../components/core/EmptyDb";
import { DBWorker, formats } from "../contexts";
import { setSnackContent } from "../utils";
import SampleLoader from "../components/core/SampleLoader";

function Manage() {
  const [dbTables, setDbTables] = useState();
  const [activeTable, setActiveTable] = useState(0);

  useEffect(() => {
    DBWorker.value
      .pleaseDo({
        id: "browse table",
        action: "exec",
        sql: `SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';`,
      })
      .then(({ results }) => {
        if (results) {
          const newTables = results[0]?.values?.map((el) => el[0]);
          setDbTables(newTables);
          const tableName = new URLSearchParams(window.location.search).get(
            "table"
          );
          if (tableName)
            setActiveTable(newTables.findIndex((name) => name === tableName));
        }
      })
      .catch(console.error);
  }, []);

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
              <SampleLoader />
            </>
          )}
          {dbTables && (
            <DbTable tableName={dbTables[activeTable]}>
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
