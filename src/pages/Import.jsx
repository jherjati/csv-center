import { parse } from "papaparse";
import { useEffect, useErrorBoundary, useState } from "preact/hooks";
import OrAction from "../components/core/OrAction";
import PageError from "../components/core/PageError";
import Dropzone from "../components/import/Dropzone";
import Mapping from "../components/import/Mapping";
import PreviewTable from "../components/import/PreviewTable";
import { formats, withHeader } from "../contexts";
import { setSnackContent } from "../utils";

function Import() {
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
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>Import</h1>
        </div>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-6'>
          <Dropzone
            setFields={setFields}
            fields={fields}
            setFile={setFile}
            file={file}
          />
          <PreviewTable
            fields={fields}
            rows={prevData}
            fileString={
              file
                ? file.name + " - " + parseInt(file.size / 1000) + " kilobytes"
                : ""
            }
          />
          <Mapping
            fields={fields}
            file={file}
            tabName={tabName}
            setTabName={setTabName}
          />
        </div>
        <OrAction
          label={"Load Previous Session"}
          onAction={(event) => {
            event.preventDefault();
          }}
        />
      </main>
    );
  }
}

export default Import;
