import { PlusIcon } from "@heroicons/react/20/solid";

export default function OrAction({ label, onAction }) {
  return (
    <div className='flex items-center px-9'>
      <span className='pr-3 text-lg font-medium text-gray-900'>Or</span>
      <div className='border-t border-gray-300 grow' />
      <button
        type='button'
        className='inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        onClick={onAction}
      >
        <PlusIcon
          className='-ml-1.5 mr-1 h-5 w-5 text-gray-400'
          aria-hidden='true'
        />
        <span>{label}</span>
      </button>
    </div>
  );
}