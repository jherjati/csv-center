import { useState, useEffect } from "preact/hooks";
import { parse } from "papaparse";
import PreviewTable from "./PreviewTable";
import { withHeader } from "../../contexts";
import { useSnack } from "../../hooks";

const stopDefault = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

function Dropzone({ fields, setFields, setFile, file }) {
  const [prevData, setPrevData] = useState([]);
  const { setSnackContent } = useSnack();

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

  return (
    <section
      className='mb-6'
      onDrop={stopDefault}
      onDragEnter={stopDefault}
      onDragLeave={stopDefault}
      onDragOver={stopDefault}
    >
      <input
        type='file'
        id='dropzone'
        name='dropzone'
        className='hidden'
        accept='text/csv'
        multiple={false}
        onChange={(event) => {
          stopDefault(event);
          setFile(event.target.files[0]);
        }}
      />
      <label
        htmlFor='dropzone'
        className='block bg-white p-6 rounded-lg shadow my-6 w-full'
        onDrop={(event) => {
          stopDefault(event);
          setFile(event.dataTransfer.files[0]);
        }}
        onDragEnter={stopDefault}
        onDragLeave={stopDefault}
        onDragOver={stopDefault}
      >
        Drag 'n' drop csv file here, or click to select file
      </label>
      <PreviewTable
        fields={fields}
        rows={prevData}
        fileString={
          file
            ? file.name + " - " + parseInt(file.size / 1000) + " kilobytes"
            : ""
        }
      />
    </section>
  );
}

export default Dropzone;
