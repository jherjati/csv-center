import { useMemo } from "preact/hooks";
import DbTable from "../components/manage/DbTable";
import EmptyDb from "../components/manage/EmptyDb";
import { db, formats } from "../contexts";

function Manage() {
  const dbTables = useMemo(
    () =>
      db.value
        ? db.value.exec(
            `SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';`
          )[0]?.values
        : undefined,
    [db.value]
  );
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

export default Manage;
