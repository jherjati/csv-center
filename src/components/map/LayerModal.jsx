import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "preact";
import { useCallback, useState } from "preact/hooks";
import { formats } from "../../contexts";

const configForm = {
  layerName: ["text", "Layer Name"],
  tableName: ["select", "Table Name"],
  longColumn: ["select", "Longitude Column"],
  latColumn: ["select", "Latitude Column"],
  circleColor: ["color", "Circle Color"],
  circleSize: ["number", "Circle Size"],
};

export default function LayerModal({
  open,
  setOpen,
  dbTables,
  isEditing,
  layerConfig,
  setLayerConfigs,
}) {
  const [localLayerConfig, setLocalLayerConfig] = useState(
    isEditing
      ? layerConfig
      : {
          layerName: null,
          tableName: null,
          longColumn: null,
          latColumn: null,
          circleColor: null,
          circleSize: 3,
        }
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      const data = Object.fromEntries(form.entries());
      setLayerConfigs((prev) => {
        if (isEditing) {
          const newConfigs = [...prev];
          const oldIdx = newConfigs.findIndex(
            (conf) => conf.layerName === layerConfig.layerName
          );
          newConfigs[oldIdx] = data;
          return newConfigs;
        } else {
          return [...prev, data];
        }
      });
      setOpen(false);
    },
    [layerConfig]
  );

  const handleChange = (event) => {
    setLocalLayerConfig((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
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
                <form
                  id='detail-form'
                  onSubmit={handleSubmit}
                  onReset={(event) => {
                    event.preventDefault();
                    setOpen(false);
                  }}
                >
                  <h4 className='text-lg leading-6 font-medium text-gray-900 capitalize'>
                    {isEditing && layerConfig
                      ? layerConfig.layerName
                      : "New Layer"}
                  </h4>
                  {/* Inputs */}
                  <div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                    {Object.keys(configForm).map((key) =>
                      key === "tableName" ? (
                        <div className='col-span-3'>
                          <label
                            htmlFor={key}
                            className='block text-sm font-medium text-gray-700'
                          >
                            {configForm[key][1]}
                          </label>
                          <select
                            name={key}
                            className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-md'
                            value={localLayerConfig[key]}
                            onChange={handleChange}
                          >
                            <option></option>
                            {dbTables.map((opt) => (
                              <option value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      ) : key.includes("Column") ? (
                        <div className='col-span-3'>
                          <label
                            htmlFor={key}
                            className='block text-sm font-medium text-gray-700'
                          >
                            {configForm[key][1]}
                          </label>
                          <select
                            name={key}
                            className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-md'
                            value={localLayerConfig[key]}
                            onChange={handleChange}
                          >
                            <option></option>
                            {formats.value[localLayerConfig.tableName]
                              ?.filter((col) =>
                                ["real", "integer"].includes(col.type)
                              )
                              .map((col) => (
                                <option value={col.name}>{col.name}</option>
                              ))}
                          </select>
                        </div>
                      ) : (
                        <div className='col-span-3'>
                          <label
                            htmlFor={key}
                            className='block text-sm font-medium text-gray-700'
                          >
                            {configForm[key][1]}
                          </label>
                          <input
                            type={configForm[key][0]}
                            name={key}
                            className={`mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full ${
                              configForm[key][0] === "color"
                                ? "h-10 p-0 border-0"
                                : ""
                            } text-sm border-gray-300 rounded-md`}
                            value={localLayerConfig[key]}
                            onChange={handleChange}
                          />
                        </div>
                      )
                    )}
                  </div>
                  {/* Buttons */}
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
                      Apply
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
