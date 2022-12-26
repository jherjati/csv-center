import { useEffect, useState } from "preact/hooks";
import DbTable from "../components/manage/DbTable";

function Manage({ dbTables }) {
  const [activeTable, setActiveTable] = useState(0);
  useEffect(() => {
    const tableName = new URLSearchParams(window.location.search).get("table");
    if (tableName)
      setActiveTable(dbTables.findIndex((name) => name === tableName));
  }, []);

  return (
    <main className='py-6'>
      <div className='mx-auto max-w-7xl px-8'>
        <h1 className='text-2xl font-semibold text-gray-900'>Manage</h1>
      </div>
      <div className='mx-auto max-w-7xl px-8'>
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
      </div>
    </main>
  );
}

export default Manage;
