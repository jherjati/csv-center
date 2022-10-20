import { BugAntIcon } from "@heroicons/react/24/outline";
import { Link } from "wouter-preact";

export default function PageError({ resetError }) {
  return (
    <main className='my-24 mx-auto flex'>
      <p className='text-teal-600'>
        <BugAntIcon className='w-14 sm:w-16' />
      </p>
      <div className='sm:ml-6'>
        <div className='sm:border-l sm:border-gray-200 sm:pl-6'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
            Is that a bug?
          </h1>
          <p className='mt-1 text-base text-gray-500'>
            A rare bug is appeared, we will catch them all eventually
          </p>
        </div>
        <div className='mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6'>
          <button
            onClick={resetError}
            className='inline-flex items-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
          >
            I'm feeling lucky
          </button>
          <Link
            href='/'
            className='inline-flex items-center rounded-md border border-transparent bg-teal-100 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
          >
            Let's go home
          </Link>
        </div>
      </div>
    </main>
  );
}
