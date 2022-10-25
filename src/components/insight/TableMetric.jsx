import { useEffect, useState } from "preact/hooks";
import { dbWorker, formats } from "../../contexts";
import Actions from "./Actions";
import ChartItem from "./ChartItem";
import Stats from "./Stats";

function TableMetric({ name, children }) {
  const [statsValues, setStatsValues] = useState([]);
  const [chartsValues, setChartsValues] = useState([]);
  const [config, setConfig] = useState({
    stats: [
      ...[
        formats.value[name].find((col) =>
          ["integer", "real"].includes(col.type)
        ) &&
          formats.value[name].find((col) =>
            ["integer", "real"].includes(col.type)
          ).name,
      ],
    ],
    charts: [],
  });

  useEffect(() => {
    if (config.stats.length) {
      dbWorker.value.onmessage = ({ data }) => {
        if (data.id === "get metric") {
          setStatsValues(
            data.results
              .filter((_, idx) => idx < config.stats.length)
              .map((el) => el.values[0])
          );
        }
      };

      dbWorker.value.postMessage({
        id: "get metric",
        action: "exec",
        sql: `${config.stats
          .map(
            (stat) =>
              `SELECT MAX(${stat}), AVG(${stat}), MIN(${stat}), COUNT(${stat}) FROM '${name}';`
          )
          .join(" ")}`,
      });
    }
  }, [config]);

  return (
    <section className='bg-white overflow-hidden shadow rounded-lg divide-y my-6 pb-6'>
      <div className='py-3 px-6 bg-white flex justify-between items-center'>
        {children}
        <Actions />
      </div>
      {statsValues.map((stat, idx) => (
        <Stats column={config.stats[idx]} values={stat} />
      ))}
      <div className='w-full grid grid-cols-6 pb-6'>
        {[
          {
            config: {
              type: "line",
              colors: ["green"],
              lineOptions: {
                dotSize: 1.25,
                regionFill: 1, // default: 1
              },
              valuesOverPoints: 1,
            },
            data: {
              labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [{ values: [18, 40, 30, 35, 8, 52, 17, -4] }],
            },
            span: 6,
          },
        ].map((chart, idx) => (
          <ChartItem key={idx} {...chart} />
        ))}
      </div>
      <hr />
    </section>
  );
}

export default TableMetric;
