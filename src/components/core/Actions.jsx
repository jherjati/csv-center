export default function Actions({
  count,
  icons: [FirstIcon, SecondIcon, ThirdIcon],
  handlers,
  labels,
}) {
  return (
    <span className='isolate inline-flex rounded-md shadow-sm'>
      <button
        type='button'
        className='relative inline-flex items-center rounded-l-md border -mr-px border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
        onClick={handlers[0]}
      >
        <FirstIcon
          className='-ml-1 mr-2 h-5 w-5 text-gray-400'
          aria-hidden='true'
        />
        {labels[0]}
        {count ? (
          <span className='absolute top-0 left-0 h-5 w-5 -ml-2 -mt-2 text-xs flex justify-center items-center bg-teal-300 text-white rounded-full shadow'>
            {count}
          </span>
        ) : null}
      </button>
      <button
        type='button'
        className='relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
        onClick={handlers[1]}
      >
        <SecondIcon
          className='-ml-1 mr-2 h-5 w-5 text-gray-400'
          aria-hidden='true'
        />
        {labels[1]}
      </button>
      <button
        type='button'
        className='relative inline-flex items-center rounded-r-md border -ml-px border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
        onClick={handlers[2]}
      >
        <ThirdIcon
          className='-ml-1 mr-2 h-5 w-5 text-gray-400'
          aria-hidden='true'
        />
        {labels[2]}
      </button>
    </span>
  );
}
