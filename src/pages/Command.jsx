import { useCallback, useRef, useState } from "preact/hooks";
import { EditorView, basicSetup } from "codemirror";
import { sql } from "@codemirror/lang-sql";
import { DBWorker } from "../constants";
import { ArrowPathIcon, BoltSlashIcon } from "@heroicons/react/20/solid";
import { setSnackContent } from "../utils";
import { commandText } from "../contexts";

function Command() {
  const editor = useRef();
  const [results, setResults] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const ref = useCallback((node) => {
    const localEditor = new EditorView({
      doc: commandText.value,
      extensions: [basicSetup, sql()],
      parent: node,
    });
    editor.current = localEditor;
  }, []);

  const onExecute = () => {
    setIsLoading(true);
    const sql = editor.current.state.doc.toString();
    commandText.value = sql;
    DBWorker.pleaseDo({
      id: "execute command",
      action: "exec",
      sql,
    }).then((data) => {
      if (data.id === "execute command") {
        if (data.error) {
          setSnackContent(["error", "An Error Occured", data.error]);
        }
        setResults(data.results);
      }
      setIsLoading(false);
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
      <div className='mx-auto max-w-7xl px-8'>
        <h1 className='text-2xl font-semibold text-gray-900'>SQLite Command</h1>
      </div>
      <div className='mx-auto max-w-7xl px-8'>
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
              className='ml-3 w-20 inline-flex justify-center py-2 text-center border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
            >
              {isLoading ? (
                <ArrowPathIcon className='w-5 h-5 animate-spin' />
              ) : (
                "Execute"
              )}
            </button>
          </div>
          {results ? (
            results.length ? (
              results.map((res) => (
                <section
                  style={{ animation: "forwards fadein1 1.6s" }}
                  className='mt-6 px-6 pb-6 pt-3 bg-white rounded-lg shadow'
                >
                  <div className='flex flex-col mx-0 overflow-x-scroll'>
                    <table className='min-w-full divide-y divide-gray-300'>
                      <thead>
                        <tr>
                          {res.columns.map((el) => (
                            <th
                              scope='col'
                              className='py-3.5 px-3 text-right text-sm font-semibold text-gray-900 table-cell'
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
                              <td className='py-4 px-3 text-right text-sm text-gray-500 table-cell'>
                                {el}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))
            ) : (
              <section className='mt-6 p-6 space-y-3 bg-white rounded-lg shadow flex flex-col items-center text-gray-600'>
                <BoltSlashIcon className='w-12 h-12 mx-auto' />
                <p>No results were returned by the query</p>
              </section>
            )
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default Command;
