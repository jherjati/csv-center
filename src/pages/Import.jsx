import { useErrorBoundary, useState } from "preact/hooks";
import PageError from "../components/core/PageError";
import Dropzone from "../components/import/Dropzone";
import Mapping from "../components/import/Mapping";
import { useSnack } from "../hooks";

function Import() {
  const [fields, setFields] = useState([]);
  const [file, setFile] = useState();
  const { setSnackContent } = useSnack();
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
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>Import</h1>
        </div>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 md:px-8'>
          <Dropzone
            setFields={setFields}
            fields={fields}
            setFile={setFile}
            file={file}
          />
          <Mapping fields={fields} file={file} />
        </div>
      </main>
    );
  }
}

export default Import;
