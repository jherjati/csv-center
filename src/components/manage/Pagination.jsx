import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { paginate } from "../../utils";
const size = 10;

const Pagination = ({ page, maxPage, setPage, count }) => {
  const myPagination = paginate(page, maxPage);
  const isReachMin = page === 1;
  const isReachMax = page === maxPage;

  return (
    <div className='flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6'>
      <div className='flex justify-between flex-1 sm:hidden'>
        <button
          disabled={isReachMin}
          onClick={() => {
            setPage(page - 1);
          }}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md ${
            isReachMin ? "" : "hover:bg-gray-50"
          }`}
        >
          Previous
        </button>
        <button
          disabled={isReachMax}
          onClick={() => {
            setPage(page + 1);
          }}
          className={`relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md ${
            isReachMax ? "" : "hover:bg-gray-50"
          }`}
        >
          Next
        </button>
      </div>
      <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm text-gray-700'>
            Showing <span className='font-medium'>{(page - 1) * size + 1}</span>{" "}
            to <span className='font-medium'>{(page - 1) * size + size}</span>{" "}
            of <span className='font-medium'>{count}</span> data
          </p>
        </div>
        <div>
          <div
            className='relative z-0 inline-flex -space-x-px rounded-md shadow-sm'
            aria-label='Pagination'
          >
            <button
              disabled={isReachMin}
              onClick={() => setPage(page - 1)}
              className={`relative inline-flex items-center justify-center w-10 px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md ${
                isReachMin
                  ? "bg-gray-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className='sr-only'>Previous</span>
              <ChevronLeftIcon className='w-5 h-5' aria-hidden='true' />
            </button>

            {myPagination.map((el, i) => (
              <button
                key={i}
                disabled={!el}
                onClick={() => setPage(el)}
                aria-current='page'
                className={`relative w-10 justify-center inline-flex items-center px-4 py-2 text-sm font-medium border ${
                  !el
                    ? "bg-white border-gray-300 text-gray-400"
                    : el === page
                    ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {el ? el : "..."}
              </button>
            ))}

            <button
              disabled={isReachMax}
              onClick={() => setPage(page + 1)}
              className={`relative inline-flex items-center justify-center w-10 px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md ${
                isReachMax
                  ? "bg-gray-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className='sr-only'>Next</span>
              <ChevronRightIcon className='w-5 h-5' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
