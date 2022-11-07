const stopDefault = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

function Dropzone({ setFile }) {
  return (
    <section
      style={{ animation: "forwards fadein1 1.6s" }}
      className='mt-6'
      onDrop={stopDefault}
      onDragEnter={stopDefault}
      onDragLeave={stopDefault}
      onDragOver={stopDefault}
    >
      <input
        accept='text/csv'
        type='file'
        id='dropzone'
        name='dropzone'
        className='hidden'
        multiple={false}
        onChange={(event) => {
          stopDefault(event);
          setFile(event.target.files[0]);
        }}
      />
      <label
        role='button'
        htmlFor='dropzone'
        className='block bg-white p-3 rounded-lg shadow w-full hover:shadow-md'
        onDrop={(event) => {
          stopDefault(event);
          setFile(event.dataTransfer.files[0]);
        }}
        onDragEnter={stopDefault}
        onDragLeave={stopDefault}
        onDragOver={stopDefault}
      >
        <p className='rounded-lg border-2 border-dashed border-gray-200 px-6 py-9'>
          Drag and drop csv file here, or <strong>click</strong> to select file
        </p>
      </label>
    </section>
  );
}

export default Dropzone;
