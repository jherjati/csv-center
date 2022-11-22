import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "preact";
import { useState } from "preact/hooks";
import { getDbType, getInputType, operators } from "../../constants";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { parse, format } from "date-fns";
import { setSnackContent } from "../../utils";

export default function FilterModal({
  open,
  setOpen,
  tableName,
  filter,
  setFilter,
  columns,
}) {
  const [activeType, setActiveType] = useState(columns[0].type);

  const handleSubmit = (event) => {
    try {
      event.preventDefault();
      const form = new FormData(event.target);
      const data = Object.fromEntries(form.entries());
      const newFilterItem = [
        data["col-add"],
        data["opr-add"],
        ["IS NULL", "IS NOT NULL"].includes(data["opr-add"])
          ? ""
          : columns
              .find((col) => col.name === data["col-add"])
              .type.includes("date")
          ? parse(data["val-add"], "yyyy-MM-dd", new Date()) / 1000
          : data["val-add"],
      ];
      setFilter((prev) => [...prev, newFilterItem]);
    } catch (error) {
      console.error(error);
      setSnackContent([
        "error",
        "An Error Occured",
        "Download process stuck due to some table configuration",
      ]);
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
          <div className='flex min-h-full justify-center text-center items-center p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all my-8 w-full max-w-xl p-6'>
                <div className='flex justify-between items-center'>
                  <h4 className='text-lg leading-6 font-medium text-gray-900 capitalize'>
                    {tableName}
                  </h4>
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      setOpen(false);
                    }}
                    className='inline-flex items-center rounded-md border border-gray-300 bg-white p-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  >
                    <XMarkIcon className='h-4 w-4' aria-hidden='true' />
                  </button>
                </div>
                <div className='mt-3 grid gap-y-2 grid-cols-10'>
                  <label className='block text-sm font-medium text-gray-700 col-span-3'>
                    Column
                  </label>
                  <label className='block text-sm font-medium text-gray-700 col-span-3'>
                    Operator
                  </label>
                  <label className='block text-sm font-medium text-gray-700 col-span-3'>
                    Value
                  </label>
                  <span className='hidden col-span-1'></span>
                  {filter.map((el, id) => {
                    const thisType = columns.find(
                      (col) => col.name === el[0]
                    ).type;
                    return (
                      <>
                        {/* Column */}
                        <select
                          disabled
                          className='col-span-3 shadow-sm focus:ring-teal-500 focus:border-teal-500 block text-sm border-gray-300 rounded-l-md'
                          defaultValue={el[0]}
                        >
                          {columns.map((el) => (
                            <option key={el.name} value={el.name}>
                              {el.name}
                            </option>
                          ))}
                        </select>

                        {/* Operator */}
                        <select
                          disabled
                          className='col-span-3 shadow-sm focus:ring-teal-500 focus:border-teal-500 block text-sm border-gray-300'
                          defaultValue={el[1]}
                        >
                          {Object.keys(operators)
                            .map((key) => operators[key])
                            .flat()
                            .map((el) => (
                              <option key={el.sign} value={el.sign}>
                                {el.text}
                              </option>
                            ))}
                        </select>

                        {/* Value */}
                        <input
                          disabled
                          type={getInputType(thisType)}
                          className={`col-span-3 text-gray-500 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 h-10`}
                          defaultValue={
                            thisType.includes("date")
                              ? format(new Date(el[2] * 1000), "yyyy-MM-dd")
                              : el[2]
                          }
                        />

                        {/* Action */}
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            setFilter((prev) =>
                              prev.filter((_, idx) => idx !== id)
                            );
                          }}
                          className='h-10 w-10 self-end flex items-center justify-center rounded-r-md border border-gray-300 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500'
                        >
                          <TrashIcon className='h-4 w-4' aria-hidden='true' />
                        </button>
                      </>
                    );
                  })}
                </div>
                <hr className='my-3' />
                <form onSubmit={handleSubmit} className='grid grid-cols-10'>
                  {/* Column */}
                  <select
                    name={"col-add"}
                    id={"col-add"}
                    className='cursor-pointer col-span-3 shadow-sm focus:ring-teal-500 focus:border-teal-500 block text-sm border-gray-300 rounded-l-md'
                    onChange={(event) =>
                      setActiveType(
                        columns.find((el) => el.name === event.target.value)
                          .type
                      )
                    }
                  >
                    {columns.map((el) => (
                      <option key={el.name} value={el.name}>
                        {el.name}
                      </option>
                    ))}
                  </select>

                  {/* Operator */}
                  <select
                    name={"opr-add"}
                    id={"opr-add"}
                    className='cursor-pointer col-span-3 shadow-sm focus:ring-teal-500 focus:border-teal-500 block text-sm border-gray-300'
                  >
                    {operators["base"].map((el) => (
                      <option key={el.sign} value={el.sign}>
                        {el.text}
                      </option>
                    ))}
                    {activeType === "text" &&
                      operators["text"].map((el) => (
                        <option key={el.sign} value={el.sign}>
                          {el.text}
                        </option>
                      ))}
                  </select>

                  {/* Value */}
                  <input
                    type={getInputType(activeType)}
                    step={getDbType(activeType) === "integer" ? 1 : "any"}
                    name={"val-add"}
                    id={"val-add"}
                    className={`col-span-3 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 h-10`}
                  />

                  {/* Action */}
                  <button
                    type='submit'
                    className='h-10 w-10 self-end flex items-center justify-center rounded-r-md border border-gray-300 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500'
                  >
                    <PlusIcon className='h-5 w-5' aria-hidden='true' />
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
