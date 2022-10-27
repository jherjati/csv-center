import { Dialog, Transition } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/20/solid";
import { Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
import { formats } from "../../contexts";
import { getPropByString, setPropByString } from "../../utils";

export default function ConfigModal({
  open,
  setOpen,
  tableName,
  config,
  setConfig,
}) {
  const [stats, setStats] = useState(config.stats);
  const [charts, setCharts] = useState(config.charts);
  useEffect(() => {
    if (open) {
      setStats(config.stats);
      setCharts(config.charts);
    }
  }, [open]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = Object.fromEntries(form.entries());
    const stats = [];
    const charts = [...config.charts];

    Object.keys(data).forEach((key) => {
      if (key.includes("stat")) {
        stats[key.split("_")[1]] = data[key];
      } else {
        const [_, idx, name] = key.split("_");
        const newChart = { ...charts[idx] };

        if (name === "span") {
          newChart[name] = parseInt(data[key]);
        } else if (name.includes("annotation")) {
          if (data[key]) {
            setPropByString(
              newChart,
              "options.plugins.annotation.annotations.box1.display",
              true
            );
            setPropByString(newChart, name, data[key]);
          } else {
            setPropByString(
              newChart,
              "options.plugins.annotation.annotations.box1.display",
              false
            );
            setPropByString(newChart, name, data[key]);
          }
        } else {
          newChart[name] = data[key];
        }

        if (name.includes("Column")) {
          const axis = name.replace("Column", "");
          newChart.options.scales[axis].title = {
            display: true,
            text: data[key],
          };
        }

        charts[idx] = newChart;
      }
    });

    setConfig({ stats, charts });
    setOpen(false);
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

                  <div className='grid grid-cols-1 gap-y-6 gap-x-3 sm:grid-cols-6'>
                    {stats.map((stat, idx) => (
                      <div className='sm:col-span-3 grid grid-cols-6 gap-x-2'>
                        <select
                          name={"stat_" + idx}
                          className='shadow-sm focus:ring-teal-500 focus:border-teal-500 block col-span-5 sm:text-sm border-gray-300 rounded-md'
                          defaultValue={stat}
                        >
                          {formats.value[tableName]
                            .filter((col) =>
                              ["integer", "real"].includes(col.type)
                            )
                            .map((col) => (
                              <option value={col.name}>{col.name}</option>
                            ))}
                        </select>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            setStats((prev) =>
                              prev.filter((_, indeks) => indeks !== idx)
                            );
                          }}
                          className='col-span-1 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 grid place-content-center'
                        >
                          <MinusSmallIcon className='h-6 w-6' />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        setStats((prev) => [...prev, undefined]);
                      }}
                      className='sm:col-span-3 border py-2 border-gray-300 hover:border-gray-600 text-gray-300 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border-dashed grid place-content-center'
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

                  {charts.map((chart, idx) => (
                    <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
                      <div className='sm:col-span-3'>
                        <label
                          htmlFor={`chart_${idx}_type`}
                          className='block text-sm font-medium text-gray-700'
                        >
                          Chart Type
                        </label>
                        <select
                          name={`chart_${idx}_type`}
                          className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          defaultValue={chart["type"]}
                        >
                          <option value='line'>line</option>
                        </select>
                      </div>

                      <div className='sm:col-span-3'>
                        <label
                          htmlFor={`chart_${idx}_span`}
                          className='block text-sm font-medium text-gray-700'
                        >
                          Chart Width
                        </label>
                        <select
                          name={`chart_${idx}_span`}
                          className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          defaultValue={chart["span"]}
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                          <option value={6}>6</option>
                        </select>
                      </div>

                      <div className='sm:col-span-3'>
                        <label
                          htmlFor={"chart_${idx}_xColumn"}
                          className='block text-sm font-medium text-gray-700'
                        >
                          X Axis Column
                        </label>
                        <select
                          name={`chart_${idx}_xColumn`}
                          className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          defaultValue={chart["xColumn"]}
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
                          htmlFor={`chart_${idx}_yColumn`}
                          className='block text-sm font-medium text-gray-700'
                        >
                          Y Axis Column
                        </label>
                        <select
                          name={`chart_${idx}_yColumn`}
                          className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          defaultValue={chart["yColumn"]}
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
                          htmlFor={`chart_${idx}_dataLimit`}
                          className='block text-sm font-medium text-gray-700'
                        >
                          First Data Limit
                        </label>
                        <input
                          type='number'
                          step={25}
                          name={`chart_${idx}_dataLimit`}
                          className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          defaultValue={chart["dataLimit"]}
                        ></input>
                      </div>

                      <div className='sm:col-span-3'>
                        <label
                          htmlFor={`chart_${idx}_borderColor`}
                          className='block text-sm font-medium text-gray-700'
                        >
                          Border Color
                        </label>
                        <input
                          type='color'
                          name={`chart_${idx}_borderColor`}
                          className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full h-10 p-0 border-0 sm:text-sm border-gray-300 rounded-md'
                          defaultValue={chart["borderColor"]}
                        ></input>
                      </div>

                      <div className='sm:col-span-3'>
                        <label
                          htmlFor={`chart_${idx}_options.plugins.annotation.annotations.box1.yMin`}
                          className='block text-sm font-medium text-gray-700'
                        >
                          Annotation Y Min
                        </label>
                        <input
                          type='number'
                          step='any'
                          name={`chart_${idx}_options.plugins.annotation.annotations.box1.yMin`}
                          className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          defaultValue={
                            getPropByString(
                              chart,
                              "options.plugins.annotation.annotations.box1.yMin"
                            ) ?? ""
                          }
                        ></input>
                      </div>

                      <div className='sm:col-span-3'>
                        <label
                          htmlFor={`chart_${idx}_options.plugins.annotation.annotations.box1.yMax`}
                          className='block text-sm font-medium text-gray-700'
                        >
                          Annotation Y Max
                        </label>
                        <input
                          type='number'
                          step='any'
                          name={`chart_${idx}_options.plugins.annotation.annotations.box1.yMax`}
                          className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          defaultValue={
                            getPropByString(
                              chart,
                              "options.plugins.annotation.annotations.box1.yMax"
                            ) ?? ""
                          }
                        ></input>
                      </div>

                      <div className='sm:col-span-3'>
                        <label
                          htmlFor={`chart_${idx}_options.plugins.annotation.annotations.box1.label.content`}
                          className='block text-sm font-medium text-gray-700'
                        >
                          Annotation Label
                        </label>
                        <input
                          type='text'
                          name={`chart_${idx}_options.plugins.annotation.annotations.box1.label.content`}
                          className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          defaultValue={getPropByString(
                            chart,
                            "options.plugins.annotation.annotations.box1.label.content"
                          )}
                        ></input>
                      </div>
                    </div>
                  ))}

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
