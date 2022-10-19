import Toggle from "./Toggle";

export default function PreviewTable({ fields, rows, fileString }) {
  return (
    <div className='p-6 bg-white rounded-lg shadow'>
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
        <div className='-mx-4 mt-3 flex flex-col sm:-mx-6 md:mx-0 overflow-x-scroll'>
          <table className='min-w-full divide-y divide-gray-300'>
            <thead>
              <tr>
                {fields.map((el) => (
                  <th
                    scope='col'
                    className='hidden py-3.5 px-3 text-right text-sm font-semibold text-gray-900 sm:table-cell'
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
                    <td className='hidden py-4 px-3 text-right text-sm text-gray-500 sm:table-cell'>
                      {row[el]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
