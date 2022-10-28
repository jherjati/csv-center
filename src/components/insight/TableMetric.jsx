import { useEffect, useState } from "preact/hooks";
import { dbWorker, formats } from "../../contexts";
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
import { filterToString, filterToValues } from "../../utils";
import ConfigModal from "./ConfigModal";
import annotationPlugin from "chartjs-plugin-annotation";

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

function TableMetric({ name, children }) {
  const [statsValues, setStatsValues] = useState([]);
  const [chartsValues, setChartsValues] = useState([]);

  const [filter, setFilter] = useState([]);

  const [config, setConfig] = useState({
    stats: [
      // array of string
      formats.value[name].find((col) => ["integer", "real"].includes(col.type))
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
              title: { display: true, text: "X Axis Column" },
            },
            y: { title: { display: true, text: "Y Axis Column" } },
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
        xColumn:
          formats.value[name].filter((col) =>
            ["integer", "real"].includes(col.type)
          )[0].name ?? null,
        yColumn:
          formats.value[name].filter((col) =>
            ["integer", "real"].includes(col.type)
          )[1].name ?? null,
        dataLimit: 250,
        borderColor: "#FFA500",
        fill: false,
      },
    ],
  });

  useEffect(() => {
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
                    parsing: el.columns[1].includes("("),
                    borderColor:
                      config.charts[idx - config.stats.length].borderColor,
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
      const sql = `${config.stats
        .filter((stat) => Boolean(stat))
        .map(
          (stat) =>
            `SELECT MAX(${stat}), AVG(${stat}), MIN(${stat}), COUNT(${stat}) FROM '${name}' ${filterToString(
              filter
            )};`
        )
        .join(" ")}
          ${config.charts
            .filter((chart) => chart.xColumn && chart.yColumn)
            .map((chart) =>
              chart.type === "bar"
                ? `SELECT ${chart.xColumn}, count(${
                    chart.yColumn
                  }) FROM '${name}' ${filterToString(filter)} GROUP BY ${
                    chart.xColumn
                  } ORDER BY count(${chart.yColumn});`
                : `SELECT ${chart.xColumn}, ${
                    chart.yColumn
                  } FROM '${name}' ${filterToString(filter)} ORDER BY ${
                    chart.xColumn
                  } LIMIT ${chart.dataLimit};`
            )
            .join(" ")}
        `;

      dbWorker.value.postMessage({
        id: "get metric",
        action: "exec",
        sql,
        params,
      });
    }
  }, [config, filter]);

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
          onPrintClick={() => {}}
        />
      </div>
      {statsValues.map((stat, idx) => (
        <Stats column={config.stats[idx]} values={stat} />
      ))}
      <div className='w-full grid grid-cols-6 pb-6'>
        {chartsValues.map((dataset, idx) => (
          <ChartBox key={idx} data={dataset} config={config.charts[idx]} />
        ))}
      </div>
      <hr />
      <FilterModal
        open={filterOpen}
        setOpen={setFilterOpen}
        tableName={name}
        columns={formats.value[name]}
        filter={filter}
        setFilter={setFilter}
      />
      <ConfigModal
        open={configOpen}
        setOpen={setConfigOpen}
        tableName={name}
        config={config}
        setConfig={setConfig}
      />
    </section>
  );
}

export default TableMetric;
