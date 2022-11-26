import {
  useCallback,
  useEffect,
  useErrorBoundary,
  useState,
} from "preact/hooks";
import { InboxArrowDownIcon } from "@heroicons/react/20/solid";
import { useLocation } from "wouter-preact";
import { transfer } from "comlink";

import PreviewTable from "../components/import/PreviewTable";
import TableFormat from "../components/import/TableFormat";
import PageError from "../components/core/PageError";
import Dropzone from "../components/import/Dropzone";
import { setSnackContent } from "../utils";
import { DBWorker } from "../constants";
import { formats } from "../contexts";

function Import() {
  const [_, setLocation] = useLocation();
  const [fields, setFields] = useState([]);
  const [file, setFile] = useState();

  // Auto detect format candidate
  const [tabName, setTabName] = useState("Dynamic");
  useEffect(() => {
    if (file) {
      const tableName = file.name.split(".")[0];
      if (Object.keys(formats.value).includes(tableName)) setTabName(tableName);
    }
  }, [file]);

  const loadSession = useCallback((event) => {
    const reader = new FileReader();
    reader.onload = async function () {
      await DBWorker.pleaseDo(
        {
          id: "load_session",
          action: "open",
          buffer: transfer(reader.result, [reader.result]),
        },
        [reader.result]
      );
      const { results } = await DBWorker.pleaseDo({
        id: "browse table",
        action: "exec",
        sql: `SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';`,
      });
      const newTables = results[0]?.values?.map((el) => el[0]);
      const data = await DBWorker.pleaseDo({
        id: "browse column",
        action: "exec",
        sql: newTables.map((name) => `PRAGMA table_info('${name}')`).join(";"),
      });

      const newFormats = { ...formats.value };
      data.results.forEach((res, idx) => {
        const oldFormat = newFormats[newTables[idx]];
        let newFormat = res.values.map((val) => ({
          name: val[1],
          type: ["integer", "real"].includes(val[2].toLowerCase())
            ? val[2].toLowerCase()
            : "text",
          aliases: [],
        }));

        if (oldFormat) {
          newFormat = newFormat.map((col) => {
            const oldCol = oldFormat.find((c) => c.name === col.name);
            if (oldCol) {
              col.alises = oldCol.aliases;
            }
            return col;
          });
        }
        newFormats[newTables[idx]] = newFormat;
      });
      formats.value = newFormats;
      setLocation("/manage");
    };
    reader.readAsArrayBuffer(event.target.files[0]);
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
          <h1 className='text-2xl font-semibold text-gray-900'>Import</h1>
        </div>
        <div className='mx-auto max-w-7xl px-8 mb-6'>
          <Dropzone setFile={setFile} />
          {file && (
            <PreviewTable fields={fields} setFields={setFields} file={file} />
          )}
          <TableFormat
            fields={fields}
            file={file}
            tabName={tabName}
            setTabName={setTabName}
          />
        </div>
        <div
          style={{ animation: "forwards fadein3 1.6s" }}
          className='flex items-center px-9'
        >
          <span className='pr-3 text-lg font-medium text-gray-900'>Or</span>
          <div className='border-t border-gray-300 grow' />
          <input
            accept='.db'
            type='file'
            name='load_session'
            id='load_session'
            className='hidden'
            onChange={loadSession}
          />
          <label
            htmlFor='load_session'
            role='button'
            className='inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          >
            <InboxArrowDownIcon
              className='mr-2 h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
            <p>Load Session</p>
          </label>
        </div>
      </main>
    );
  }
}

export default Import;
