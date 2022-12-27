import { useRef, useState } from "preact/hooks";
import { useReactToPrint } from "react-to-print";
import TableMetric from "../components/insight/TableMetric";
import { formats } from "../contexts";

function Insight({ dbTables }) {
  const [activeTable, setActiveTable] = useState(0);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <main className='py-6'>
      <div className='mx-auto max-w-7xl px-8'>
        <h1 className='text-2xl font-semibold text-gray-900'>Insight</h1>
      </div>
      <div className='mx-auto max-w-7xl px-8'>
        <TableMetric
          key={activeTable}
          tableName={dbTables[activeTable]}
          columns={formats.value[dbTables[activeTable]]}
          ref={componentRef}
          handlePrint={handlePrint}
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
        </TableMetric>
      </div>
    </main>
  );
}

export default Insight;
