import { Dialog, Transition } from "@headlessui/react";
import {
  MinusSmallIcon,
  PlusSmallIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import {
  AiOutlineLineChart,
  AiOutlineBarChart,
  AiOutlineDotChart,
  AiOutlinePieChart,
} from "react-icons/ai";
import { Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
import { metricConfigs } from "../../contexts";
import { getPropByString, setPropByString } from "../../utils";
import { chartForm } from "../../constants";
import ChartNav from "./ChartNav";

export default function ConfigModal({ open, closeModal, tableName, columns }) {
  const [stats, setStats] = useState([]);
  const [charts, setCharts] = useState([]);
  const [type, setType] = useState(["line"]);
  const [datasetLength, setDatasetLength] = useState([1]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (open) {
      const config = metricConfigs.value[tableName];
      setStats(config.stats);
      setType(config.charts.map((el) => el.type));
      setDatasetLength(config.charts.map((el) => el.yColumn.length));
      setCharts(config.charts);
      setPage(0);
    }
  }, [open]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = Object.fromEntries(form.entries());
    const stats = [];
    const funcCharts = charts.map((chart, indeks) => {
      return {
        options:
          type[indeks] === "pie"
            ? {
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }
            : {
                scales: {
                  x: {
                    type: ["line", "scatter"].includes(type[indeks])
                      ? "linear"
                      : "category",
                    title: {
                      display: true,
                    },
                  },
                },
                plugins: { ...chart.options.plugins },
              },
        yColumn: chart.yColumn.slice(0, datasetLength[indeks]),
        borderColor: chart.borderColor.slice(0, datasetLength[indeks]),
        backgroundColor: chart.backgroundColor.slice(0, datasetLength[indeks]),
      };
    });

    Object.keys(data).forEach((key) => {
      if (key.includes("stat")) {
        stats[key.split("_")[1]] = data[key];
      } else {
        const [_, idx, name] = key.split("_");
        setPropByString(funcCharts[idx], name, data[key]);
        if (name.includes("annotation")) {
          setPropByString(
            funcCharts[idx],
            "options.plugins.annotation.annotations.box.display",
            Boolean(data[key])
          );
        }
      }
    });
    metricConfigs.value = {
      ...metricConfigs.value,
      [tableName]: {
        ...metricConfigs.value[tableName],
        stats,
        charts: funcCharts,
      },
    };
    closeModal();
  };

  const handleAddChart = () => {
    setType([...type, type[type.length - 1]]);
    setDatasetLength([
      ...datasetLength,
      datasetLength[datasetLength.length - 1],
    ]);
    setCharts([...charts, { ...charts[charts.length - 1], id: Date.now() }]);
  };

  const handleRemoveChart = (chartIdx) => {
    setType((prev) => prev.filter((_, id) => id !== chartIdx));
    setDatasetLength((prev) => prev.filter((_, id) => id !== chartIdx));
    setCharts((prev) => prev.filter((_, id) => id !== chartIdx));
  };

  const onTypeChange = (event, chartIdx) => {
    setType((prev) => {
      const newVal = [...prev];
      newVal[chartIdx] = event.target.value;
      return newVal;
    });
    setDatasetLength((prev) => {
      const newVal = [...prev];
      newVal[chartIdx] = ["line", "scatter"].includes(event.target.value)
        ? charts[chartIdx].yColumn.length
        : 1;
      return newVal;
    });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
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
                    closeModal();
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
                  </div>
                  <ChartNav
                    page={page}
                    setPage={setPage}
                    length={charts.length}
                    addChart={handleAddChart}
                    removeChart={handleRemoveChart}
                  />

                  {charts.map((chart, chartIdx) => (
                    <div
                      key={chart.id}
                      className={
                        "grid gap-y-6 gap-x-4 grid-cols-12 " +
                        (chartIdx === page ? "" : "h-0 overflow-hidden")
                      }
                    >
                      <div className='col-span-12 grid grid-cols-12 gap-x-3 gap-y-1'>
                        <label className='col-span-12 block text-sm font-medium text-gray-700'>
                          Chart Type
                        </label>
                        <div className='col-span-3'>
                          <input
                            onChange={(e) => onTypeChange(e, chartIdx)}
                            type='radio'
                            id={"line-chart" + chartIdx}
                            name={`chart_${chartIdx}_type`}
                            value='line'
                            class='hidden peer'
                            checked={type[chartIdx] === "line"}
                          />
                          <label
                            for={"line-chart" + chartIdx}
                            class='inline-flex justify-center items-center space-x-3 p-2 w-full text-gray-700 bg-white rounded-lg border border-gray-200 cursor-pointer  peer-checked:border-teal-600 peer-checked:text-teal-600 peer-checked:bg-gray-100 hover:text-gray-600 hover:bg-gray-100'
                          >
                            <AiOutlineLineChart className='h-8 w-8' />
                            <div>
                              <h6 class='w-full text-sm font-semibold'>
                                Line Chart
                              </h6>
                              <p class='w-full text-xs'>Good for data series</p>
                            </div>
                          </label>
                        </div>
                        <div className='col-span-3'>
                          <input
                            onChange={(e) => onTypeChange(e, chartIdx)}
                            type='radio'
                            id={"bar-chart" + chartIdx}
                            name={`chart_${chartIdx}_type`}
                            value='bar'
                            class='hidden peer'
                            checked={type[chartIdx] === "bar"}
                          />
                          <label
                            for={"bar-chart" + chartIdx}
                            class='inline-flex justify-center items-center space-x-3 p-2 w-full text-gray-700 bg-white rounded-lg border border-gray-200 cursor-pointer  peer-checked:border-teal-600 peer-checked:text-teal-600 peer-checked:bg-gray-100 hover:text-gray-600 hover:bg-gray-100'
                          >
                            <AiOutlineBarChart className='h-8 w-8' />
                            <div>
                              <h6 class='w-full text-sm font-semibold'>
                                Bar Chart
                              </h6>
                              <p class='w-full text-xs'>
                                Good for aggregate data
                              </p>
                            </div>
                          </label>
                        </div>
                        <div className='col-span-3'>
                          <input
                            onChange={(e) => onTypeChange(e, chartIdx)}
                            type='radio'
                            id={"scatter-chart" + chartIdx}
                            name={`chart_${chartIdx}_type`}
                            value='scatter'
                            class='hidden peer'
                            checked={type[chartIdx] === "scatter"}
                          />
                          <label
                            for={"scatter-chart" + chartIdx}
                            class='inline-flex justify-center items-center space-x-3 p-2 w-full text-gray-700 bg-white rounded-lg border border-gray-200 cursor-pointer  peer-checked:border-teal-600 peer-checked:text-teal-600 peer-checked:bg-gray-100 hover:text-gray-600 hover:bg-gray-100'
                          >
                            <AiOutlineDotChart className='h-8 w-8' />
                            <div>
                              <h6 class='w-full text-sm font-semibold'>
                                Scatter Plot
                              </h6>
                              <p class='w-full text-xs'>Good for point data</p>
                            </div>
                          </label>
                        </div>
                        <div className='col-span-3'>
                          <input
                            onChange={(e) => onTypeChange(e, chartIdx)}
                            type='radio'
                            id={"pie-chart" + chartIdx}
                            name={`chart_${chartIdx}_type`}
                            value='pie'
                            class='hidden peer'
                            checked={type[chartIdx] === "pie"}
                          />
                          <label
                            for={"pie-chart" + chartIdx}
                            class='inline-flex justify-center items-center space-x-3 p-2 w-full text-gray-700 bg-white rounded-lg border border-gray-200 cursor-pointer  peer-checked:border-teal-600 peer-checked:text-teal-600 peer-checked:bg-gray-100 hover:text-gray-600 hover:bg-gray-100'
                          >
                            <AiOutlinePieChart className='h-8 w-8' />
                            <div>
                              <h6 class='w-full text-sm font-semibold'>
                                Pie Chart
                              </h6>
                              <p class='w-full text-xs'>
                                Good for aggregate data
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {chartForm[type[chartIdx]]
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
                                defaultValue={getPropByString(
                                  chart,
                                  input.name
                                )}
                                required
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
                                min='0'
                                name={`chart_${chartIdx}_${input.name}`}
                                className={`mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full ${
                                  input.type === "color"
                                    ? "h-10 p-0 border-0"
                                    : ""
                                } sm:text-sm border-gray-300 rounded-md`}
                                defaultValue={
                                  getPropByString(chart, input.name) ?? ""
                                }
                                required
                              />
                            </div>
                          )
                        )}

                      <div className='relative border rounded-lg px-3 pt-6 pb-3 col-span-12 grid grid-cols-12 gap-y-6 gap-x-4'>
                        <h6 className='absolute top-0 left-0 -mt-3 ml-4 bg-white px-3 text-sm font-medium text-gray-900'>
                          {["line", "scatter"].includes(type[chartIdx])
                            ? "Datasets"
                            : "Dataset"}
                        </h6>
                        {["line", "scatter"].includes(type[chartIdx]) && (
                          <div className='absolute top-0 right-0 -mt-3 mr-4 bg-white text-sm font-medium text-gray-900 flex rounded-md shadow-sm'>
                            <button
                              disabled={datasetLength[chartIdx] === 1}
                              className='rounded-l-md border -mr-px border-gray-300 bg-white hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                              onClick={(event) => {
                                event.preventDefault();
                                setDatasetLength(
                                  datasetLength.map((el, idx) =>
                                    idx === chartIdx ? el - 1 : el
                                  )
                                );
                              }}
                            >
                              <MinusSmallIcon
                                className='h-5 w-5 text-gray-700'
                                aria-hidden='true'
                              />
                            </button>
                            <button
                              className='rounded-r-md border -ml-px border-gray-300 bg-white hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                              onClick={(event) => {
                                event.preventDefault();
                                setDatasetLength(
                                  datasetLength.map((el, idx) =>
                                    idx === chartIdx ? el + 1 : el
                                  )
                                );
                              }}
                            >
                              <PlusSmallIcon
                                className='h-5 w-5 text-gray-700'
                                aria-hidden='true'
                              />
                            </button>
                          </div>
                        )}
                        {Array.from({ length: datasetLength[chartIdx] }).map(
                          (_, dataIdx) =>
                            chartForm[type[chartIdx]]
                              .filter((input) => input.section === "data")
                              .map((input) =>
                                input.type === "select" ? (
                                  <div
                                    className={
                                      ["line", "scatter"].includes(
                                        type[chartIdx]
                                      )
                                        ? "col-span-4"
                                        : "col-span-3"
                                    }
                                  >
                                    <label
                                      htmlFor={`chart_${chartIdx}_${input.name}.${dataIdx}`}
                                      className='block text-sm font-medium text-gray-700'
                                    >
                                      {input.label}
                                    </label>
                                    <select
                                      name={`chart_${chartIdx}_${input.name}.${dataIdx}`}
                                      className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-md'
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
                                  <div
                                    className={
                                      ["line", "scatter"].includes(
                                        type[chartIdx]
                                      )
                                        ? "col-span-4"
                                        : "col-span-3"
                                    }
                                  >
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
                                      } text-sm border-gray-300 rounded-md`}
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

                      {type[chartIdx] !== "pie" && (
                        <div className='relative border rounded-lg px-3 pt-6 pb-3 col-span-12 grid grid-cols-12 gap-y-6 gap-x-4'>
                          <h6 className='absolute top-0 left-0 -mt-3 ml-4 bg-white px-3 text-sm font-medium text-gray-900'>
                            Annotation
                          </h6>
                          {chartForm[type[chartIdx]]
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
                      )}
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
