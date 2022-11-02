import { useCallback, useRef, useState } from "preact/hooks";
import { EditorView, basicSetup } from "codemirror";
import { sql } from "@codemirror/lang-sql";
import { dbWorker } from "../contexts";

function Command() {
  const editor = useRef();
  const [results, setResults] = useState([]);

  const ref = useCallback((node) => {
    const localEditor = new EditorView({
      doc: `
SELECT 
  * 
FROM 
  sqlite_schema 
WHERE 
  type = 'table' 
  AND name NOT LIKE 'sqlite_%';

PRAGMA table_info('Exception_Report');
`,
      extensions: [basicSetup, sql()],
      parent: node,
    });
    editor.current = localEditor;

    dbWorker.value.onmessage = ({ data }) => {
      if (data.id === "execute command") setResults(data.results ?? []);
    };
  }, []);

  const onExecute = () => {
    dbWorker.value.postMessage({
      id: "execute command",
      action: "exec",
      sql: editor.current.state.doc.toString(),
    });
  };

  const onClear = () => {
    editor.current.dispatch(
      editor.current.state.update({
        changes: {
          from: 0,
          to: editor.current.state.doc.length,
          insert: "\n\n\n\n\n\n\n\n\n\n",
        },
      })
    );
  };

  return (
    <main className='py-6'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h1 className='text-2xl font-semibold text-gray-900'>SQL Command</h1>
      </div>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 md:px-8'>
        {/* Replace with your content */}
        <div className='py-4'>
          <div ref={ref} className='border bg-white' />
          <div className='flex justify-center border-t mt-3 pt-3 border-teal-100'>
            <button
              onClick={onClear}
              className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
            >
              Clear
            </button>
            <button
              onClick={onExecute}
              className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
            >
              Execute
            </button>
          </div>
          {results.map((res) => (
            <section
              style={{ animation: "forwards fadein1 1.6s" }}
              className='mt-6 px-6 pb-6 pt-3 bg-white rounded-lg shadow'
            >
              <div className='-mx-4 flex flex-col sm:-mx-6 md:mx-0 overflow-x-scroll'>
                <table className='min-w-full divide-y divide-gray-300'>
                  <thead>
                    <tr>
                      {res.columns.map((el) => (
                        <th
                          scope='col'
                          className='hidden py-3.5 px-3 text-right text-sm font-semibold text-gray-900 sm:table-cell'
                        >
                          {el}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {res.values.map((row) => (
                      <tr className='border-b border-gray-200'>
                        {row.map((el) => (
                          <td className='hidden py-4 px-3 text-right text-sm text-gray-500 sm:table-cell'>
                            {el}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
        {/* /End replace */}
      </div>
    </main>
  );
}

export default Command;
