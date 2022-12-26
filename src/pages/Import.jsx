import { useEffect, useState } from "preact/hooks";
import PreviewTable from "../components/import/PreviewTable";
import TableFormat from "../components/import/TableFormat";
import Dropzone from "../components/import/Dropzone";
import { ignoredFields } from "../contexts";
import { formats } from "../contexts";
import DBLoader from "../components/import/DBLoader";

function Import() {
  const [fields, setFields] = useState([]);
  const [file, setFile] = useState();

  // Auto detect format candidate
  const [tabName, setTabName] = useState("Dynamic");
  useEffect(() => {
    ignoredFields.value = [];
    if (file) {
      const tableName = file.name.split(".")[0];
      if (Object.keys(formats.value).includes(tableName)) setTabName(tableName);
    }
  }, [file]);

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
      <DBLoader />
    </main>
  );
}

export default Import;
