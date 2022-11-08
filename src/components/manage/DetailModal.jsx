import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "preact";
import { useCallback, useEffect } from "preact/hooks";
import { dbWorker } from "../../contexts";
import { TrashIcon } from "@heroicons/react/20/solid";
import { types } from "../../constants";
import { parse } from "date-fns";

export default function DetailModal({
  open,
  setOpen,
  tableName,
  focusId,
  columns,
}) {
  useEffect(() => {
    if (open && focusId) {
      dbWorker.value.postMessage({
        id: "read row",
        action: "exec",
        sql: `SELECT * FROM '${tableName}' WHERE rowid = ? LIMIT 1`,
        params: [focusId],
      });
    }
  }, [open, focusId]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      const data = Object.fromEntries(form.entries());
      const statement = focusId
        ? `UPDATE '${tableName}' SET ${columns
            .map((col) => `${col.name} = ?`)
            .join(", ")} WHERE rowid = ${focusId};`
        : `
        INSERT INTO '${tableName}' VALUES ( ${columns
            .map(() => "?")
            .join(", ")} );
        `;
      dbWorker.value.postMessage({
        id: "mutate row",
        action: "exec",
        sql: statement,
        params: columns.map((col) => {
          if (
            types.find((type) => type.label === col.type).label.includes("date")
          ) {
            return parse(data[col.name], "yyyy-MM-dd", new Date()) / 1000;
          }
          return data[col.name];
        }),
      });
      setOpen(false);
    },
    [focusId]
  );

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
                  <div className='flex justify-between items-center'>
                    <h4 className='text-lg leading-6 font-medium text-gray-900 capitalize'>
                      {focusId ? `rowid : ${focusId}` : tableName}
                    </h4>
                    {focusId && (
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          dbWorker.value.postMessage({
                            id: "delete row",
                            action: "exec",
                            sql: `DELETE FROM '${tableName}' WHERE rowid = ${focusId}`,
                          });
                          setOpen(false);
                        }}
                        className='inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium leading-4 text-gray-600 shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                      >
                        <TrashIcon
                          className='mr-2 -ml-0.5 h-4 w-4'
                          aria-hidden='true'
                        />
                        Delete
                      </button>
                    )}
                  </div>
                  <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                    {columns.map(({ name, type }) => (
                      <div key={name} className='sm:col-span-3'>
                        <label
                          htmlFor={name}
                          className='block text-sm font-medium text-gray-700'
                        >
                          {name}
                        </label>
                        <div className='mt-1'>
                          <input
                            type={types.find((ty) => ty.label === type).input}
                            step={
                              types.find((ty) => ty.label === type).db ===
                              "integer"
                                ? 1
                                : "any"
                            }
                            name={name}
                            id={name}
                            autoComplete={name}
                            className='shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          />
                        </div>
                      </div>
                    ))}
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
