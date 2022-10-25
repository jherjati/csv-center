import { useEffect, useState } from "preact/hooks";
import { dbWorker, formats } from "../../contexts";
import Actions from "./Actions";
import Stats from "./Stats";
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import ChartBox from "./ChartBox";

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

function TableMetric({ name, children }) {
  const [statsValues, setStatsValues] = useState([]);
  const [chartsValues, setChartsValues] = useState([]);

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
        dataLimit: 100,
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
                datasets: [
                  {
                    label: el.columns[1],
                    normalized: true,
                    parsing: false,
                    borderColor: "orange",
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

      dbWorker.value.postMessage({
        id: "get metric",
        action: "exec",
        sql: `${config.stats
          .filter((stat) => Boolean(stat))
          .map(
            (stat) =>
              `SELECT MAX(${stat}), AVG(${stat}), MIN(${stat}), COUNT(${stat}) FROM '${name}';`
          )
          .join(" ")}
            ${config.charts
              .filter((chart) => chart.xColumn && chart.yColumn)
              .map(
                (chart) =>
                  `SELECT ${chart.xColumn}, ${chart.yColumn} FROM '${name}' ORDER BY ${chart.xColumn} LIMIT ${chart.dataLimit}`
              )}
          `,
      });
    }
  }, [config]);

  return (
    <section className='bg-white overflow-hidden shadow rounded-lg divide-y my-6 pb-6'>
      <div className='py-3 px-6 bg-white flex justify-between items-center'>
        {children}
        <Actions
          onFilterClick={() => {}}
          onConfigClick={() => {}}
          onPrintClick={() => {}}
        />
      </div>
      {statsValues.map((stat, idx) => (
        <Stats column={config.stats[idx]} values={stat} />
      ))}
      <div className='w-full grid grid-cols-6 pb-6'>
        {chartsValues.map((chart, idx) => (
          <ChartBox key={idx} data={chart} config={config.charts[idx]} />
        ))}
      </div>
      <hr />
    </section>
  );
}

export default TableMetric;
