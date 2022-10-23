import { useErrorBoundary, useState } from "preact/hooks";
import PageError from "../components/core/PageError";
import DbTable from "../components/manage/DbTable";
import EmptyDb from "../components/manage/EmptyDb";
import TableTabs from "../components/manage/TableTabs";
import { formats } from "../contexts";
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
            <>
              <TableTabs
                dbTables={dbTables}
                setActiveTable={setActiveTable}
                activeTable={activeTable}
              />
              <DbTable
                key={activeTable}
                name={dbTables[activeTable]}
                isInFormats={Object.keys(formats.value).includes(
                  dbTables[activeTable]
                )}
              />
            </>
          )}
        </div>
      </main>
    );
  }
}

export default Manage;
