import { useEffect, useState } from "preact/hooks";
import { dbWorker, formats, metricConfigs } from "../../contexts";
import Actions from "./Actions";
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
import FilterModal from "./FilterModal";
import { filterToString, filterToValues, setSnackContent } from "../../utils";
import ConfigModal from "./ConfigModal";
import annotationPlugin from "chartjs-plugin-annotation";
import { forwardRef } from "react";

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

const TableMetric = forwardRef(({ name, children, handlePrint }, ref) => {
  const [statsValues, setStatsValues] = useState([]);
  const [chartsValues, setChartsValues] = useState([]);
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    if (!metricConfigs.value[name])
      metricConfigs.value = {
        ...metricConfigs.value,
        [name]: {
          stats: [
            // array of string
            formats.value[name].find((col) =>
              ["integer", "real"].includes(col.type)
            )?.name,
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
                      text: formats.value[name].filter((col) =>
                        ["integer", "real"].includes(col.type)
                      )[0]?.name,
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: formats.value[name].filter((col) =>
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
              xColumn: formats.value[name].filter((col) =>
                ["integer", "real"].includes(col.type)
              )[0]?.name,
              yColumn: formats.value[name].filter((col) =>
                ["integer", "real"].includes(col.type)
              )[1]?.name,
              dataLimit: 250,
              borderColor: "#ffa500",
              backgroundColor: "#ee4b2b",
              fill: false,
            },
          ],
        },
      };
  }, []);

  useEffect(() => {
    const config = metricConfigs.value[name];

    if (config.stats.length || config.charts.length) {
      dbWorker.value.onmessage = ({ data }) => {
        if (data.id === "get metric") {
          const newStatsValues = [],
            newChartsValues = [];
          data.results.map((el, idx) => {
            if (idx < config.stats.length) newStatsValues.push(el.values[0]);
            else {
              newChartsValues.push({
                labels:
                  config.charts[idx - config.stats.length].type === "line"
                    ? []
                    : el.values.map((value) => value[0]),
                datasets: [
                  {
                    label: el.columns[1],
                    normalized: true,
                    parsing: el.columns[1].includes("("), //bar chart need parsing, bar chart use operator
                    borderColor:
                      config.charts[idx - config.stats.length].borderColor,
                    backgroundColor:
                      config.charts[idx - config.stats.length].backgroundColor,
                    data: el.values.map((value) => ({
                      x: value[0],
                      y: value[1],
                    })),
                  },
                ],
              });
            }
          });
          setStatsValues(newStatsValues);
          setChartsValues(newChartsValues);
        }
      };

      const params = filterToValues(filter);
      const availableCharts = config.charts.filter(
        (chart) => chart.xColumn && chart.yColumn
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
                ? `SELECT ${chart.xColumn}, ${chart.dataOperator}(${
                    chart.yColumn
                  }) FROM '${name}' ${filterToString(filter)} GROUP BY ${
                    chart.xColumn
                  } ORDER BY ${chart.dataOperator}(${chart.yColumn});`
                : `SELECT ${chart.xColumn}, ${
                    chart.yColumn
                  } FROM '${name}' ${filterToString(filter)} ORDER BY ${
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
    <section className='bg-white overflow-hidden shadow rounded-lg divide-y my-6 pb-6'>
      <div className='py-3 px-6 bg-white flex justify-between items-center'>
        {children}
        <Actions
          filterCount={filter.length}
          onFilterClick={() => setFilterOpen(true)}
          onConfigClick={() => setConfigOpen(true)}
          onPrintClick={handlePrint}
        />
      </div>
      <div ref={ref}>
        {statsValues.map((stat, idx) => (
          <Stats column={metricConfigs.value[name].stats[idx]} values={stat} />
        ))}
        <hr />
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
      <hr />
      <FilterModal
        open={filterOpen}
        setOpen={setFilterOpen}
        tableName={name}
        filter={filter}
        setFilter={setFilter}
      />
      <ConfigModal open={configOpen} setOpen={setConfigOpen} tableName={name} />
    </section>
  );
});

export default TableMetric;
