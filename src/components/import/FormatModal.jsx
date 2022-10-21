import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { formats } from "../../contexts";
import { types } from "../../constants";
import { doesContainSymbol } from "../../utils";
import { useSnack } from "../../hooks";

export default function FormatModal({
  open,
  setOpen,
  focusFormat,
  tabName,
  setTabName,
}) {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([]);
  const { setSnackContent } = useSnack();

  useEffect(() => {
    if (focusFormat) {
      setTableName(focusFormat);
      setColumns(
        formats.value[focusFormat].map((el) => [
          el.name,
          el.type,
          el.aliases.join(","),
        ])
      );
    } else {
      setTableName("");
      setColumns([]);
    }
  }, [focusFormat]);

  const deleteFormat = (event) => {
    event.preventDefault();
    if (focusFormat === tabName) setTabName("Dynamic");
    setOpen(false);
    const newFormats = {};
    Object.keys(formats.value).forEach((key) =>
      key !== focusFormat ? (newFormats[key] = formats.value[key]) : null
    );
    formats.value = newFormats;
    localStorage.setItem("predefined_tables", JSON.stringify(newFormats));
  };

  const addColumn = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = Object.fromEntries(form.entries());
    setColumns((prev) => [
      ...prev,
      [data["name-add"], data["type-add"], data["aliases-add"]],
    ]);
  };

  const submitFormat = (event) => {
    event.preventDefault();
    const newFormats = {};
    Object.keys(formats.value).forEach((key) => {
      if (key !== focusFormat) newFormats[key] = formats.value[key];
    });
    const newFormat = [];
    let anyRestrictedKey = false;
    columns.forEach((el) =>
      doesContainSymbol(el[0])
        ? (anyRestrictedKey = true)
        : newFormat.push({
            name: el[0],
            type: el[1],
            aliases: el[2].split(","),
          })
    );
    if (anyRestrictedKey) {
      setSnackContent([
        "error",
        "An Error Occured",
        "Column name can contain only alphanumeric and underscore character",
      ]);
    } else {
      newFormats[tableName] = newFormat;
      localStorage.setItem("predefined_tables", JSON.stringify(newFormats));
      formats.value = newFormats;
      setOpen(false);
    }
  };

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
                <div>
                  <title className='flex justify-between items-start'>
                    <div className='w-1/2'>
                      <label className='text-sm font-medium text-gray-700'>
                        Table Name
                      </label>
                      <input
                        type={"text"}
                        name='table_name'
                        id='table_name'
                        className='w-full border-gray-300 focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md mt-2'
                        value={tableName}
                        onChange={(event) => {
                          setTableName(event.target.value);
                        }}
                      />
                    </div>
                    {focusFormat && (
                      <button
                        onClick={deleteFormat}
                        className='inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium leading-4 text-gray-600 shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                      >
                        <TrashIcon
                          className='mr-2 -ml-0.5 h-4 w-4'
                          aria-hidden='true'
                        />
                        Delete
                      </button>
                    )}
                  </title>
                  <div className='mt-3 grid grid-cols-1 gap-y-2 sm:grid-cols-10'>
                    <label className='block text-sm font-medium text-gray-700 col-span-3'>
                      Column Name
                    </label>
                    <label className='block text-sm font-medium text-gray-700 col-span-3'>
                      Type
                    </label>
                    <label className='block text-sm font-medium text-gray-700 col-span-3'>
                      Aliases
                    </label>
                    <span className='hidden col-span-1'></span>
                    {columns.map((el, id) => (
                      <>
                        {/* Name */}
                        <input
                          type={"text"}
                          className='col-span-3 shadow-sm focus:ring-teal-500 focus:border-teal-500 block sm:text-sm border-gray-300 rounded-l-md'
                          defaultValue={el[0]}
                          onChange={(event) => {
                            setColumns((prev) => {
                              let newColumns = [...prev];
                              newColumns[id][0] = event.target.value;
                              return newColumns;
                            });
                          }}
                        />

                        {/* Type */}
                        <select
                          className='col-span-3 shadow-sm focus:ring-teal-500 focus:border-teal-500 block sm:text-sm border-gray-300'
                          defaultValue={el[1]}
                          onChange={(event) => {
                            setColumns((prev) => {
                              let newColumns = [...prev];
                              newColumns[id][1] = event.target.value;
                              return newColumns;
                            });
                          }}
                        >
                          {types.map(({ label }) => (
                            <option key={label} value={label}>
                              {label}
                            </option>
                          ))}
                        </select>

                        {/* Aliases */}
                        <input
                          type={"text"}
                          className={`col-span-3 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 h-10`}
                          defaultValue={el[2]}
                          onChange={(event) => {
                            setColumns((prev) => {
                              let newColumns = [...prev];
                              newColumns[id][2] = event.target.value;
                              return newColumns;
                            });
                          }}
                        />

                        {/* Action */}
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            setColumns((prev) =>
                              prev.filter((_, idx) => idx !== id)
                            );
                          }}
                          className='h-10 w-10 self-end flex items-center justify-center rounded-r-md border border-gray-300 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500'
                        >
                          <TrashIcon className='h-4 w-4' aria-hidden='true' />
                        </button>
                      </>
                    ))}
                  </div>
                  <hr className='my-3' />
                  <form onSubmit={addColumn} className='grid grid-cols-10'>
                    {/* Name */}
                    <input
                      type={"text"}
                      name={"name-add"}
                      id={"name-add"}
                      className='col-span-3 shadow-sm focus:ring-teal-500 focus:border-teal-500 block sm:text-sm border-gray-300 rounded-l-md'
                    />

                    {/* Type */}
                    <select
                      name={"type-add"}
                      id={"type-add"}
                      className='cursor-pointer col-span-3 shadow-sm focus:ring-teal-500 focus:border-teal-500 block sm:text-sm border-gray-300'
                    >
                      {types.map(({ label }) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>

                    {/* Aliases */}
                    <input
                      type='text'
                      name={"aliases-add"}
                      id={"aliases-add"}
                      className={`col-span-3 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 h-10`}
                    />

                    {/* Action */}
                    <button
                      type='submit'
                      className='h-10 w-10 self-end flex items-center justify-center rounded-r-md border border-gray-300 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500'
                    >
                      <PlusIcon className='h-5 w-5' aria-hidden='true' />
                    </button>
                  </form>
                  <hr className='my-3' />
                  <div className='flex justify-center border-t mt-3 pt-3 border-teal-100'>
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        setOpen(false);
                      }}
                      className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitFormat}
                      className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
