import Toggle from "./Toggle";

export default function PreviewTable({ fields, rows, fileString }) {
  return (
    <section
      style={{ animation: "forwards fadein1 1.6s" }}
      className='mt-6 p-6 bg-white rounded-lg shadow'
    >
      <div className='flex justify-between items-center'>
        <span>
          <h1 className='text-xl font-semibold text-gray-900 inline mr-3'>
            Preview
          </h1>
          {fileString && (
            <h2 className='text-lg font-medium text-gray-900 inline'>
              {fileString}
            </h2>
          )}
        </span>
        <Toggle />
      </div>
      {fileString && (
        <div className='mt-3 flex flex-col -mx-6 md:mx-0 overflow-x-scroll'>
          <table className='min-w-full divide-y divide-gray-300'>
            <thead>
              <tr>
                {fields.map((el) => (
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
              {rows.map((row, idx) => (
                <tr key={idx} className='border-b border-gray-200'>
                  {fields.map((el) => (
                    <td className='py-4 px-3 text-right text-sm text-gray-500 table-cell'>
                      {row[el]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
