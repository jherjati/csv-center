import { useEffect, useState } from "preact/hooks";
import { DBWorker, formats, metricConfigs } from "../../contexts";
import Actions from "../core/Actions";
import StatsBox from "./StatsBox";
import {
  Chart,
  LineController,
  BarController,
  PieController,
  ScatterController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartBox from "./ChartBox";
import FilterModal from "../core/FilterModal";
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
  PieController,
  ScatterController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  annotationPlugin
);

const TableMetric = forwardRef(
  ({ tableName, children, handlePrint, isInFormats }, ref) => {
    // Column
    const [columns, setColumns] = useState(
      isInFormats ? formats.value[tableName] : []
    );
    useEffect(() => {
      if (!isInFormats) {
        DBWorker.value
          .pleaseDo({
            id: "browse column",
            action: "exec",
            sql: `PRAGMA table_info('${tableName}')`,
          })
          .then(({ results }) => {
            const columns = results[0]?.values.map((val) => ({
              name: val[1],
              type: val[2].toLowerCase(),
              aliases: [val[1]],
            }));
            setColumns(columns);
            formats.value = { ...formats.value, [tableName]: columns };
          });
      } else {
        setColumns(formats.value[tableName]);
      }
    }, [tableName, isInFormats]);

    const filter = metricConfigs.value[tableName]
      ? metricConfigs.value[tableName].filter
      : [];

    // Fill Config Placeholder
    useEffect(() => {
      if (columns.length && !metricConfigs.value[tableName]) {
        const numberColumns = columns.filter((col) =>
          ["integer", "real"].includes(col.type)
        );
        metricConfigs.value = {
          ...metricConfigs.value,
          [tableName]: {
            stats: [numberColumns[0]?.name],
            charts: [
              {
                id: Date.now(),
                type: "line",
                options: {
                  scales: {
                    x: {
                      type: "linear",
                      title: {
                        display: true,
                        text: numberColumns[0]?.name,
                      },
                    },
                  },
                  plugins: {
                    annotation: {
                      annotations: {
                        box: {
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
                dataLimit: 250,
                yColumn: [numberColumns[1]?.name],
                borderColor: ["#ffa500"],
                backgroundColor: ["#ee4b2b"],
              },
            ],
            filter: [],
          },
        };
      }
    }, [columns]);

    const [modalType, setModalType] = useState();

    return (
      <section className='bg-white overflow-hidden shadow rounded-lg my-6 pb-6'>
        <div className='py-3 px-6 bg-white flex justify-between items-center'>
          {children}
          <Actions
            count={filter.length}
            icons={[FunnelIcon, Cog8ToothIcon, PrinterIcon]}
            labels={["Filter", "Config", "Print"]}
            handlers={[
              () => setModalType("filter"),
              () => setModalType("config"),
              handlePrint,
            ]}
          />
        </div>
        <div ref={ref} className='border-y border-gray-200'>
          {metricConfigs.value[tableName]?.stats.map((col) => (
            <StatsBox column={col} tableName={tableName} filter={filter} />
          ))}
          <div className='w-full grid grid-cols-6'>
            {metricConfigs.value[tableName]?.charts.map((config, idx) => (
              <ChartBox
                key={config.type + idx}
                config={config}
                tableName={tableName}
                filter={filter}
              />
            ))}
          </div>
        </div>
        {columns.length ? (
          <>
            <FilterModal
              open={modalType === "filter"}
              closeModal={setModalType}
              tableName={tableName}
              filter={filter}
              setFilter={(cb) =>
                (metricConfigs.value = {
                  ...metricConfigs.value,
                  [tableName]: {
                    ...metricConfigs.value[tableName],
                    filter: cb(filter),
                  },
                })
              }
              columns={columns}
            />
            <ConfigModal
              open={modalType === "config"}
              closeModal={setModalType}
              tableName={tableName}
              columns={columns}
            />
          </>
        ) : null}
      </section>
    );
  }
);

export default TableMetric;
