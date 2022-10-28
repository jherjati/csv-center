const stopDefault = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

function Dropzone({ setFile }) {
  return (
    <section
      style={{ animation: "forwards fadein1 1.2s" }}
      className='mt-6'
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
        multiple={false}
        onChange={(event) => {
          stopDefault(event);
          setFile(event.target.files[0]);
        }}
      />
      <label
        htmlFor='dropzone'
        className='block bg-white p-6 rounded-lg shadow w-full'
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
    </section>
  );
}

export default Dropzone;
