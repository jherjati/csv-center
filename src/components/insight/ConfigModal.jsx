import { Dialog, Transition } from "@headlessui/react";
import {
  MinusSmallIcon,
  PlusSmallIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
import { metricConfigs } from "../../contexts";
import { getPropByString, setPropByString } from "../../utils";
import { Ticks, CategoryScale } from "chart.js";
import { chartForm } from "../../constants";

export default function ConfigModal({ open, setOpen, tableName, columns }) {
  const [stats, setStats] = useState([]);
  const [charts, setCharts] = useState([]);
  const [type, setType] = useState("line");
  const [datasetLength, setDatasetLength] = useState(1);

  useEffect(() => {
    if (open) {
      const config = metricConfigs.value[tableName];
      setStats(config.stats);
      setCharts(config.charts);
      setType(config.charts[0].type);
      setDatasetLength(config.charts[0].yColumn.length);
    }
  }, [open]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = Object.fromEntries(form.entries());
    const stats = [];
    const charts = [...metricConfigs.value[tableName].charts];

    charts[0].yColumn = charts[0].yColumn.slice(0, datasetLength);
    charts[0].borderColor = charts[0].borderColor.slice(0, datasetLength);
    charts[0].backgroundColor = charts[0].backgroundColor.slice(
      0,
      datasetLength
    );

    Object.keys(data).forEach((key) => {
      if (key.includes("stat")) {
        stats[key.split("_")[1]] = data[key];
      } else {
        const [_, idx, name] = key.split("_");
        const newChart = charts[idx];
        setPropByString(newChart, name, data[key]);
        // side effect below
        if (name.includes("annotation")) {
          setPropByString(
            newChart,
            "options.plugins.annotation.annotations.box1.display",
            Boolean(data[key])
          );
        } else if (name.includes("xColumn")) {
          const axis = name.split("Column")[0];
          newChart.options.scales[axis].title = {
            display: true,
            text: data[key],
          };
        } else if (name === "type") {
          switch (data[key]) {
            case "bar":
              newChart.options.scales.x.type = "category";
              newChart.options.scales.x.offset = true;
              newChart.options.scales.x.grid.offset = true;
              newChart.options.scales.x.ticks.callback =
                CategoryScale.prototype.getLabelForValue;
              newChart.options.scales.y.beginAtZero = true;
              break;
            case "line":
              newChart.options.scales.x.type = "linear";
              newChart.options.scales.x.offset = false;
              newChart.options.scales.x.grid.offset = false;
              newChart.options.scales.x.ticks.callback =
                Ticks.formatters.numeric;
              newChart.options.scales.y.beginAtZero = false;
              break;
            default:
              break;
          }
        }
      }
    });

    metricConfigs.value = {
      ...metricConfigs.value,
      [tableName]: { stats, charts },
    };
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-4xl sm:p-6'>
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
                  {/* Stats section */}
                  <div className='grid grid-cols-1 gap-y-6 gap-x-3 sm:grid-cols-9'>
                    {stats.map((stat, statIdx) => (
                      <div className='sm:col-span-3 grid grid-cols-6 gap-x-2'>
                        <select
                          name={"stat_" + statIdx}
                          className='shadow-sm focus:ring-teal-500 focus:border-teal-500 block col-span-5 sm:text-sm border-gray-300 rounded-md'
                          defaultValue={stat}
                        >
                          {columns
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
                              prev.filter((_, indeks) => indeks !== statIdx)
                            );
                          }}
                          className='col-span-1 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 grid place-content-center'
                        >
                          <TrashIcon className='h-4 w-4' />
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
                  {/* Charts section */}
                  <div>
                    <h5 className='mt-6 leading-6 text-md font-medium text-gray-900'>
                      Charts
                    </h5>
                    <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                      The following config will be used as chart options
                    </p>
                    <hr className='my-3' />
                  </div>

                  {charts.map((chart, chartIdx) => (
                    <div className='grid gap-y-6 gap-x-4 grid-cols-12'>
                      <div className='sm:col-span-12'>
                        <label
                          htmlFor={`chart_${chartIdx}_type`}
                          className='block text-sm font-medium text-gray-700'
                        >
                          Chart Type
                        </label>
                        <select
                          name={`chart_${chartIdx}_type`}
                          className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                          defaultValue={chart["type"]}
                          onChange={(event) => {
                            setType(event.target.value);
                            setDatasetLength(1);
                          }}
                        >
                          <option value='line'>line</option>
                          <option value='bar'>bar</option>
                        </select>
                      </div>

                      {chartForm[type]
                        .filter((input) => !input.section)
                        .map((input) =>
                          input.type === "select" ? (
                            <div className='sm:col-span-3'>
                              <label
                                htmlFor={`chart_${chartIdx}_${input.name}`}
                                className='block text-sm font-medium text-gray-700'
                              >
                                {input.label}
                              </label>
                              <select
                                name={`chart_${chartIdx}_${input.name}`}
                                className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                                defaultValue={chart[input.name]}
                              >
                                {input.options(columns).map((opt) => (
                                  <option value={opt}>{opt}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <div className='sm:col-span-3'>
                              <label
                                htmlFor={`chart_${chartIdx}_${input.name}`}
                                className='block text-sm font-medium text-gray-700'
                              >
                                {input.label}
                              </label>
                              <input
                                type={input.type}
                                step={input.step}
                                name={`chart_${chartIdx}_${input.name}`}
                                className={`mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full ${
                                  input.type === "color"
                                    ? "h-10 p-0 border-0"
                                    : ""
                                } sm:text-sm border-gray-300 rounded-md`}
                                defaultValue={
                                  getPropByString(chart, input.name) ?? ""
                                }
                              />
                            </div>
                          )
                        )}

                      <div className='relative border rounded-lg px-3 pt-6 pb-3 col-span-12 grid grid-cols-12 gap-y-6 gap-x-4'>
                        <h6 className='absolute top-0 left-0 -mt-3 ml-4 bg-white px-3 text-sm font-medium text-gray-900'>
                          Dataset
                        </h6>
                        {type === "line" && (
                          <div className='absolute top-0 right-0 -mt-3 mr-4 bg-white text-sm font-medium text-gray-900 flex rounded-md shadow-sm'>
                            <button
                              disabled={datasetLength === 1}
                              className='rounded-l-md border -mr-px border-gray-300 bg-white hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                              onClick={(event) => {
                                event.preventDefault();
                                setDatasetLength(datasetLength - 1);
                              }}
                            >
                              <MinusSmallIcon
                                className='h-5 w-5 text-gray-400'
                                aria-hidden='true'
                              />
                            </button>
                            <button
                              className='rounded-r-md border -ml-px border-gray-300 bg-white hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                              onClick={(event) => {
                                event.preventDefault();
                                setDatasetLength(datasetLength + 1);
                              }}
                            >
                              <PlusSmallIcon
                                className='h-5 w-5 text-gray-400'
                                aria-hidden='true'
                              />
                            </button>
                          </div>
                        )}
                        {Array.from({ length: datasetLength }).map(
                          (_, dataIdx) =>
                            chartForm[type]
                              .filter((input) => input.section === "data")
                              .map((input) =>
                                input.type === "select" ? (
                                  <div className='sm:col-span-4'>
                                    <label
                                      htmlFor={`chart_${chartIdx}_${input.name}.${dataIdx}`}
                                      className='block text-sm font-medium text-gray-700'
                                    >
                                      {input.label}
                                    </label>
                                    <select
                                      name={`chart_${chartIdx}_${input.name}.${dataIdx}`}
                                      className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                                      defaultValue={
                                        getPropByString(
                                          chart,
                                          input.name + "." + dataIdx
                                        ) ?? ""
                                      }
                                    >
                                      {input.options(columns).map((opt) => (
                                        <option value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                  </div>
                                ) : (
                                  <div className='sm:col-span-4'>
                                    <label
                                      htmlFor={`chart_${chartIdx}_${input.name}.${dataIdx}`}
                                      className='block text-sm font-medium text-gray-700'
                                    >
                                      {input.label}
                                    </label>
                                    <input
                                      type={input.type}
                                      step={input.step}
                                      name={`chart_${chartIdx}_${input.name}.${dataIdx}`}
                                      className={`mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full ${
                                        input.type === "color"
                                          ? "h-10 p-0 border-0"
                                          : ""
                                      } sm:text-sm border-gray-300 rounded-md`}
                                      defaultValue={
                                        getPropByString(
                                          chart,
                                          input.name + "." + dataIdx
                                        ) ?? ""
                                      }
                                    />
                                  </div>
                                )
                              )
                        )}
                      </div>

                      <div className='relative border rounded-lg px-3 pt-6 pb-3 col-span-12 grid grid-cols-12 gap-y-6 gap-x-4'>
                        <h6 className='absolute top-0 left-0 -mt-3 ml-4 bg-white px-3 text-sm font-medium text-gray-900'>
                          Annotation
                        </h6>
                        {chartForm[type]
                          .filter((input) => input.section === "annotation")
                          .map((input) =>
                            input.type === "select" ? (
                              <div className='sm:col-span-4'>
                                <label
                                  htmlFor={`chart_${chartIdx}_${input.name}`}
                                  className='block text-sm font-medium text-gray-700'
                                >
                                  {input.label}
                                </label>
                                <select
                                  name={`chart_${chartIdx}_${input.name}`}
                                  className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md'
                                  defaultValue={chart[input.name]}
                                >
                                  {input.options(columns).map((opt) => (
                                    <option value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <div className='sm:col-span-4'>
                                <label
                                  htmlFor={`chart_${chartIdx}_${input.name}`}
                                  className='block text-sm font-medium text-gray-700'
                                >
                                  {input.label}
                                </label>
                                <input
                                  type={input.type}
                                  step={input.step}
                                  name={`chart_${chartIdx}_${input.name}`}
                                  className={`mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full ${
                                    input.type === "color"
                                      ? "h-10 p-0 border-0"
                                      : ""
                                  } sm:text-sm border-gray-300 rounded-md`}
                                  defaultValue={
                                    getPropByString(chart, input.name) ?? ""
                                  }
                                />
                              </div>
                            )
                          )}
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
