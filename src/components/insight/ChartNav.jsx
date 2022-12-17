import { PlusCircleIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";

export default function ChartNav({ page, setPage, length, addChart }) {
  return (
    <nav className='border-y my-3 border-gray-200 flex overflow-x-scroll'>
      {Array.from({ length }).map((_, i) => (
        <button
          onClick={() => setPage(i)}
          key={i}
          type='button'
          className={
            "inline-flex items-center border-y-2 px-3 py-1 text-sm font-medium justify-between w-32 " +
            (i === page
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700")
          }
          aria-current='page'
        >
          <p className=' whitespace-nowrap'>Chart {i + 1}</p>
          {i ? <TrashIcon className='w-4 h-4 hover:text-red-600' /> : null}
        </button>
      ))}
      <button
        onClick={addChart}
        type='button'
        className={
          "inline-flex items-center border-y-2 px-3 py-2 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900"
        }
        aria-current='page'
      >
        <PlusIcon className='w-4 h-4' />
      </button>
    </nav>
  );
}
