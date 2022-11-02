import { useErrorBoundary, useRef, useState } from "preact/hooks";
import { useReactToPrint } from "react-to-print";
import PageError from "../components/core/PageError";
import TableMetric from "../components/insight/TableMetric";
import EmptyDb from "../components/core/EmptyDb";
import { formats } from "../contexts";
import { useTables } from "../hooks";
import { setSnackContent } from "../utils";

function Insight() {
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

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (error) {
    return <PageError resetError={resetError} />;
  } else {
    return (
      <main className='py-6'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>Insight</h1>
        </div>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 md:px-8'>
          {(!dbTables || !dbTables.length) && <EmptyDb />}
          {dbTables && (
            <TableMetric
              key={activeTable}
              name={dbTables[activeTable]}
              columns={formats.value[dbTables[activeTable]]}
              ref={componentRef}
              handlePrint={handlePrint}
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
            </TableMetric>
          )}
        </div>
      </main>
    );
  }
}

export default Insight;
