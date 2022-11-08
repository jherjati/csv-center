import { useEffect, useState } from "preact/hooks";
import { dbWorker, formats, metricConfigs } from "../../contexts";
import Actions from "../core/Actions";
import Stats from "./Stats";
import {
  Chart,
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
} from "chart.js";
import ChartBox from "./ChartBox";
import FilterModal from "../core/FilterModal";
import { filterToString, filterToValues, setSnackContent } from "../../utils";
import ConfigModal from "./ConfigModal";
import annotationPlugin from "chartjs-plugin-annotation";
import { forwardRef } from "react";
import {
  Cog8ToothIcon,
  FunnelIcon,
  PrinterIcon,
} from "@heroicons/react/20/solid";

Chart.register(
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  annotationPlugin
);

const TableMetric = forwardRef(
  ({ name, children, handlePrint, isInFormats }, ref) => {
    // Column
    const [columns, setColumns] = useState(
      isInFormats ? formats.value[name] : []
    );
    useEffect(() => {
      if (!isInFormats) {
        dbWorker.value.onmessage = ({ data }) => {
          if (data.id === "browse column") {
            setColumns(
              data.results[0]?.values.map((el) => ({
                name: el[1],
                type: el[2].toLowerCase(),
              }))
            );
          }
        };
        dbWorker.value.postMessage({
          id: "browse column",
          action: "exec",
          sql: `PRAGMA table_info('${name}')`,
        });
      } else {
        setColumns(formats.value[name]);
      }
    }, [name, isInFormats]);

    const [statsValues, setStatsValues] = useState([]);
    const [chartsValues, setChartsValues] = useState([]);
    const [filter, setFilter] = useState([]);

    useEffect(() => {
      if (columns.length && !metricConfigs.value[name])
        metricConfigs.value = {
          ...metricConfigs.value,
          [name]: {
            stats: [
              // array of string
              columns.find((col) => ["integer", "real"].includes(col.type))
                ?.name,
            ],
            charts: [
              // array of chart config
              {
                type: "line",
                options: {
                  scales: {
                    x: {
                      type: "linear",
                      title: {
                        display: true,
                        text: columns.filter((col) =>
                          ["integer", "real"].includes(col.type)
                        )[0]?.name,
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: columns.filter((col) =>
                          ["integer", "real"].includes(col.type)
                        )[1]?.name,
                      },
                    },
                  },
                  plugins: {
                    annotation: {
                      annotations: {
                        box1: {
                          display: false,
                          type: "box",
                          backgroundColor: "rgba(255, 99, 132, 0.25)",
                          label: {
                            drawTime: "afterDraw",
                            display: true,
                            position: {
                              x: "start",
                              y: "center",
                            },
                          },
                        },
                      },
                    },
                  },
                },
                span: 6,
                xColumn: columns.filter((col) =>
                  ["integer", "real"].includes(col.type)
                )[0]?.name,
                dataLimit: 250,
                yColumn: [
                  columns.filter((col) =>
                    ["integer", "real"].includes(col.type)
                  )[1]?.name,
                ],
                borderColor: ["#ffa500"],
                backgroundColor: ["#ee4b2b"],
              },
            ],
          },
        };
    }, [columns]);

    useEffect(() => {
      const config = metricConfigs.value[name];

      if (config?.stats.length || config?.charts.length) {
        dbWorker.value.onmessage = ({ data }) => {
          if (data.id === "get metric") {
            const newStatsValues = [],
              newChartsValues = [];
            data.results.map((result, idx) => {
              if (idx < config.stats.length)
                newStatsValues.push(result.values[0]);
              else {
                newChartsValues.push({
                  labels:
                    config.charts[idx - config.stats.length].type === "line"
                      ? []
                      : result.values.map((value) => value[0]),
                  datasets: config.charts[
                    idx - config.stats.length
                  ].borderColor.map((col, colIdx) => ({
                    label: result.columns[colIdx + 1],
                    normalized: true,
                    parsing: result.columns[colIdx + 1].includes("("), //bar chart need parsing, bar chart use operator
                    borderColor: col,
                    backgroundColor:
                      config.charts[idx - config.stats.length].backgroundColor[
                        colIdx
                      ],
                    data: result.values.map((value) => ({
                      x: value[0],
                      y: value[colIdx + 1],
                    })),
                  })),
                });
              }
            });
            setStatsValues(newStatsValues);
            setChartsValues(newChartsValues);
          } else if (data.id === "browse column") {
            setColumns(
              data.results[0]?.values.map((el) => ({
                name: el[1],
                type: el[2].toLowerCase(),
              }))
            );
          }
        };

        const params = filterToValues(filter);
        const availableCharts = config.charts.filter(
          (chart) => chart.xColumn && chart.yColumn.length
        );
        const sql = `${config.stats
          .filter((stat) => Boolean(stat))
          .map(
            (stat) =>
              `SELECT MAX(${stat}), AVG(${stat}), MIN(${stat}), COUNT(${stat}) FROM '${name}' ${filterToString(
                filter
              )};`
          )
          .join(" ")}
          ${availableCharts
            .map((chart) =>
              chart.type === "bar"
                ? `SELECT ${chart.xColumn}, ${chart.dataOperator[0]}(${
                    chart.yColumn[0]
                  }) FROM '${name}' ${filterToString(filter)} GROUP BY ${
                    chart.xColumn
                  } ORDER BY ${chart.dataOperator[0]}(${chart.yColumn[0]});`
                : `SELECT ${chart.xColumn}, ${chart.yColumn.join(
                    ", "
                  )} FROM '${name}' ${filterToString(filter)} ORDER BY ${
                    chart.xColumn
                  } LIMIT ${chart.dataLimit};`
            )
            .join(" ")}
        `;

        if (!availableCharts.length) {
          setSnackContent([
            "error",
            "Insufficient Data",
            "Chart requires at least 2 real or integer columns",
          ]);
        }

        dbWorker.value.postMessage({
          id: "get metric",
          action: "exec",
          sql,
          params,
        });
      }
    }, [metricConfigs.value, filter]);

    const [filterOpen, setFilterOpen] = useState(false);
    const [configOpen, setConfigOpen] = useState(false);

    return (
      <section className='bg-white overflow-hidden shadow rounded-lg my-6 pb-6'>
        <div className='py-3 px-6 bg-white flex justify-between items-center'>
          {children}
          <Actions
            count={filter.length}
            icons={[FunnelIcon, Cog8ToothIcon, PrinterIcon]}
            labels={["Filter", "Config", "Print"]}
            handlers={[
              () => setFilterOpen(true),
              () => setConfigOpen(true),
              handlePrint,
            ]}
          />
        </div>
        <div ref={ref} className='border-y border-gray-200'>
          {statsValues.map((stat, idx) => (
            <Stats
              column={metricConfigs.value[name].stats[idx]}
              values={stat}
            />
          ))}
          <div className='w-full grid grid-cols-6'>
            {chartsValues.map((dataset, idx) => (
              <ChartBox
                key={idx}
                data={dataset}
                config={metricConfigs.value[name].charts[idx]}
              />
            ))}
          </div>
        </div>
        {columns.length ? (
          <>
            <FilterModal
              open={filterOpen}
              setOpen={setFilterOpen}
              tableName={name}
              filter={filter}
              setFilter={setFilter}
              columns={columns}
            />
            <ConfigModal
              open={configOpen}
              setOpen={setConfigOpen}
              tableName={name}
              columns={columns}
            />
          </>
        ) : null}
      </section>
    );
  }
);

export default TableMetric;
