import { useEffect, useState } from "preact/hooks";
import { formats, metricConfigs } from "../../contexts";
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
  Legend,
} from "chart.js";
import ChartBox from "./ChartBox";
import FilterModal from "../core/FilterModal";
import { filterToString, filterToValues } from "../../utils";
import ConfigModal from "./ConfigModal";
import annotationPlugin from "chartjs-plugin-annotation";
import { forwardRef } from "react";
import {
  Cog8ToothIcon,
  FunnelIcon,
  PrinterIcon,
} from "@heroicons/react/20/solid";
import { DBWorker } from "../../constants";

Chart.register(
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
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
        DBWorker.pleaseDo({
          id: "browse column",
          action: "exec",
          sql: `PRAGMA table_info('${name}')`,
        }).then((data) => {
          if (data.id === "browse column") {
            setColumns(
              data.results[0]?.values.map((el) => ({
                name: el[1],
                type: el[2].toLowerCase(),
              }))
            );
          }
        });
      } else {
        setColumns(formats.value[name]);
      }
    }, [name, isInFormats]);

    const [statsValues, setStatsValues] = useState([]);
    const [filter, setFilter] = useState([]);

    // Fill Config Placeholder
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

    // Stats Data
    useEffect(() => {
      const config = metricConfigs.value[name];
      if (config?.stats.length || config?.charts.length) {
        const sql = `${config.stats
          .filter((stat) => Boolean(stat))
          .map(
            (stat) =>
              `SELECT MAX(${stat}), AVG(${stat}), MIN(${stat}), COUNT(${stat}) FROM '${name}' ${filterToString(
                filter
              )}`
          )
          .join("; ")}
        `;
        const params = filterToValues(filter);

        DBWorker.pleaseDo({
          id: "get metric",
          action: "exec",
          sql,
          params,
        }).then(({ results }) => {
          setStatsValues(
            results.map((result) => {
              return result.values[0];
            })
          );
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
            {metricConfigs.value[name]?.charts.map((config) => {
              return (
                <ChartBox
                  key={config.type}
                  config={config}
                  name={name}
                  filter={filter}
                />
              );
            })}
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
