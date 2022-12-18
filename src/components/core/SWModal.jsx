import { Dialog, Transition } from "@headlessui/react";
import { useMemo, useState } from "preact/hooks";
import { registerSW } from "virtual:pwa-register";

export default function SWModal() {
  const [modalOpen, setmodalOpen] = useState(false);
  const updateSW = useMemo(
    () =>
      registerSW({
        onNeedRefresh() {
          setmodalOpen(true);
        },
        onOfflineReady() {},
      }),
    []
  );

  return (
    <Transition appear show={modalOpen}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto'
        onClose={() => {
          setmodalOpen(false);
        }}
      >
        <div className='min-h-screen px-4 text-center'>
          <Transition.Child
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className='inline-block h-screen align-middle'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
              <Dialog.Title
                as='h3'
                className='text-lg font-medium leading-6 text-gray-900'
              >
                New Version Is Coming
              </Dialog.Title>
              <div className='mt-2'>
                <p className='text-sm text-gray-500'>
                  The latest version is here, with features that will make your
                  work even easier, including{" "}
                  <strong className=' font-semibold'>multichart support</strong>
                  ! All you need to do is refresh.
                </p>
              </div>

              <div className='flex space-x-8 justify-center'>
                <div className='mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-teal-900 bg-teal-100 border border-transparent rounded-md hover:bg-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500'
                    onClick={() => {
                      // when user clicked the "refresh" button
                      updateSW();
                      // the page will reload and the up-to-date content will be served.
                    }}
                  >
                    Refresh now!
                  </button>
                </div>

                <div className='mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-teal-900 bg-teal-100 border border-transparent rounded-md hover:bg-teal-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500'
                    onClick={() => {
                      setmodalOpen(false);
                    }}
                  >
                    Next time
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
