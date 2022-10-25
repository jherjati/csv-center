import { Dialog, Transition } from "@headlessui/react";
import { PlusSmallIcon } from "@heroicons/react/20/solid";
import { Fragment } from "preact";
import { useState } from "preact/hooks";
import { formats } from "../../contexts";

export default function ConfigModal({ open, setOpen, tableName }) {
  const [stats, setStats] = useState([0]);
  const handleSubmit = () => {};
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6'>
                <form
                  id='detail-form'
                  onSubmit={handleSubmit}
                  onReset={(event) => {
                    event.preventDefault();
                    setOpen(false);
                  }}
                >
                  <div className='flex justify-between items-center mb-6'>
                    <h4 className='text-lg leading-6 font-medium text-gray-900 capitalize'>
                      {tableName}
                    </h4>
                  </div>
                  <div>
                    <h5 className='text-md font-medium leading-6 text-gray-900'>
                      Statistic
                    </h5>
                    <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                      The following columns will be displayed as stats number
                    </p>
                    <hr className='my-3' />
                  </div>

                  <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                    {
                      <div className='sm:col-span-3'>
                        <select
                          name={"stat_0"}
                          className='shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                        >
                          {formats.value[tableName]
                            .filter((col) =>
                              ["integer", "real"].includes(col.type)
                            )
                            .map((col) => (
                              <option value={col.name}>{col.name}</option>
                            ))}
                        </select>
                      </div>
                    }
                    <button
                      onClick={(event) => event.preventDefault()}
                      className='sm:col-span-3 border border-gray-300 hover:border-gray-600 text-gray-300 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border-dashed grid place-content-center'
                    >
                      <PlusSmallIcon className='h-6 w-6' />
                    </button>
                  </div>

                  <div>
                    <h5 className='mt-6 text-md font-medium leading-6 text-gray-900'>
                      Charts
                    </h5>
                    <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                      The following config will be used as chart options
                    </p>
                    <hr className='my-3' />
                  </div>

                  <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                    <div className='sm:col-span-3'>
                      <label
                        htmlFor={"chart_0_type"}
                        className='block text-sm font-medium text-gray-700'
                      >
                        Chart Type
                      </label>
                      <select
                        name={"chart_0_type"}
                        className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                        defaultValue={"line"}
                      >
                        <option value='line'>line</option>
                        <option value='bar'>bar</option>
                      </select>
                    </div>

                    <div className='sm:col-span-3'>
                      <label
                        htmlFor={"chart_0_span"}
                        className='block text-sm font-medium text-gray-700'
                      >
                        Chart Width
                      </label>
                      <select
                        name={"chart_0_span"}
                        className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                        defaultValue={"6"}
                      >
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                        <option value='6'>6</option>
                      </select>
                    </div>

                    <div className='sm:col-span-3'>
                      <label
                        htmlFor={"chart_0_x"}
                        className='block text-sm font-medium text-gray-700'
                      >
                        X Axis Column
                      </label>
                      <select
                        name={"chart_0_x"}
                        className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                      >
                        {formats.value[tableName]
                          .filter((col) =>
                            ["integer", "real"].includes(col.type)
                          )
                          .map((col) => (
                            <option value={col.name}>{col.name}</option>
                          ))}
                      </select>
                    </div>

                    <div className='sm:col-span-3'>
                      <label
                        htmlFor={"chart_0_y"}
                        className='block text-sm font-medium text-gray-700'
                      >
                        Y Axis Column
                      </label>
                      <select
                        name={"chart_0_y"}
                        className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                      >
                        {formats.value[tableName]
                          .filter((col) =>
                            ["integer", "real"].includes(col.type)
                          )
                          .map((col) => (
                            <option value={col.name}>{col.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className='flex justify-center border-t mt-3 pt-3 border-teal-100'>
                    <button
                      type='reset'
                      className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
