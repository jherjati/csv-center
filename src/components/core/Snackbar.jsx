import { Fragment } from "preact";
import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/20/solid";
import { snackbar } from "../../contexts";
import { closeSnack } from "../../utils";

const SnackBar = () => {
  const content = snackbar.value["content"];
  const show = snackbar.value["visible"];

  return (
    <div
      aria-live='assertive'
      className='fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end z-20'
    >
      <div className='w-full flex flex-col items-center space-y-4 sm:items-end'>
        {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
        <Transition
          show={show}
          as={Fragment}
          enter='transform ease-out duration-300 transition'
          enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
          enterTo='translate-y-0 opacity-100 sm:translate-x-0'
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'>
            <div className='p-4 flex items-start'>
              <div className='flex-shrink-0'>
                {content[0] === "success" ? (
                  <CheckCircleIcon
                    className='h-6 w-6 text-green-400'
                    aria-hidden='true'
                  />
                ) : (
                  <ExclamationCircleIcon
                    className='h-6 w-6 text-red-400'
                    aria-hidden='true'
                  />
                )}
              </div>
              <div className='ml-3 w-0 flex-1 pt-0.5'>
                <p className='text-sm font-medium text-gray-900'>
                  {content[1]}
                </p>
                <p className='mt-1 text-sm text-gray-500'>{content[2]}</p>
              </div>
              <div className='ml-4 flex-shrink-0 flex'>
                <button
                  className='bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
                  onClick={closeSnack}
                >
                  <span className='sr-only'>Close</span>
                  <XMarkIcon className='h-5 w-5' aria-hidden='true' />
                </button>
              </div>
            </div>
            <div
              style={{ animation: "run 3s linear" }}
              className={`w-full h-1 rounded-r-full bg-teal-300 transition-transform`}
            />
          </div>
        </Transition>
      </div>
      <style>{`
        @keyframes run {
          to {
            transform: translate(0%);
          }
          from {
            transform: translate(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default SnackBar;
