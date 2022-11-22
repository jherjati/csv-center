import { parse } from "papaparse";
import { useEffect, useErrorBoundary, useState } from "preact/hooks";
import PageError from "../components/core/PageError";
import Dropzone from "../components/import/Dropzone";
import Mapping from "../components/import/Mapping";
import PreviewTable from "../components/import/PreviewTable";
import { dbWorker, formats, withHeader } from "../contexts";
import { setSnackContent } from "../utils";
import { useLocation } from "wouter-preact";
import { InboxArrowDownIcon } from "@heroicons/react/20/solid";

function Import() {
  const [_, setLocation] = useLocation();
  const [fields, setFields] = useState([]);
  const [file, setFile] = useState();
  const [error, resetError] = useErrorBoundary((error) => {
    console.error(error);
    setSnackContent([
      "error",
      "Unexpected Thing Happened",
      "Don't worry, refresh button is your friend",
    ]);
  });

  const [prevData, setPrevData] = useState([]);
  useEffect(() => {
    if (file)
      try {
        parse(file, {
          header: withHeader.value,
          preview: 5,
          complete: function (res) {
            setFields(Object.keys(res.data[0]));
            setPrevData(res.data);
          },
        });
      } catch (error) {
        console.error(error);
        setSnackContent([
          "error",
          "An Error Occured",
          "You might miss something on your csv file",
        ]);
      }
  }, [file, withHeader.value]);

  const [tabName, setTabName] = useState("Dynamic");
  useEffect(() => {
    if (file) {
      const tableName = file.name.split(".")[0];
      if (Object.keys(formats.value).includes(tableName)) setTabName(tableName);
    }
  }, [file]);

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
            <PreviewTable
              fields={fields}
              rows={prevData}
              fileString={
                file
                  ? file.name +
                    " - " +
                    parseInt(file.size / 1000) +
                    " kilobytes"
                  : ""
              }
            />
          )}
          <Mapping
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
            onChange={(event) => {
              const reader = new FileReader();
              dbWorker.value.onmessage = function ({ data }) {
                if (data.id === "load_session") {
                  setLocation("/manage");
                }
              };
              reader.onload = function () {
                try {
                  dbWorker.value.postMessage(
                    {
                      id: "load_session",
                      action: "open",
                      buffer: reader.result,
                    },
                    [reader.result]
                  );
                } catch (error) {
                  dbWorker.value.postMessage({
                    id: "load_session",
                    action: "open",
                    buffer: reader.result,
                  });
                }
              };
              reader.readAsArrayBuffer(event.target.files[0]);
            }}
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
