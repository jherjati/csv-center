import { useErrorBoundary } from "preact/hooks";
import PageError from "../components/core/PageError";
import DbTable from "../components/manage/DbTable";
import EmptyDb from "../components/manage/EmptyDb";
import { formats } from "../contexts";
import { useTables } from "../hooks";
import { setSnackContent } from "../utils";

function Manage() {
  const { dbTables } = useTables();

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
          {dbTables &&
            dbTables.map((el) => (
              <DbTable
                name={el[0]}
                isInFormats={Object.keys(formats.value).includes(el[0])}
              />
            ))}
        </div>
      </main>
    );
  }
}

export default Manage;
