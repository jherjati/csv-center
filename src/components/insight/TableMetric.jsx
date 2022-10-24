import { useEffect, useState } from "preact/hooks";
import { dbWorker, formats } from "../../contexts";
import ChartItem from "./ChartItem";
import Stats from "./Stats";

function TableMetric({ name }) {
  const [stats, setStats] = useState([]);
  const [config, setConfig] = useState({
    stats: [
      formats.value[name].find((col) => ["integer", "real"].includes(col.type))
        .name,
    ],
  });

  useEffect(() => {
    dbWorker.value.onmessage = ({ data }) => {
      if (data.id === "get metric") {
        setStats(
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
  }, [config]);

  return (
    <section className='bg-white shadow rounded-lg divide-y my-6 pb-6'>
      <h5 className='text-xl font-semibold text-gray-900 capitalize py-3 px-6'>
        {name}
      </h5>
      {stats.map((stat, idx) => (
        <Stats column={config.stats[idx]} values={stat} />
      ))}
      <div className='w-full grid grid-cols-6 pb-6'>
        <ChartItem
          config={{
            type: "line",
            colors: ["green"],
            lineOptions: {
              dotSize: 1.25,
              regionFill: 1, // default: 1
            },
            valuesOverPoints: 1,
          }}
          data={{
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{ values: [18, 40, 30, 35, 8, 52, 17, -4] }],
          }}
          span={6}
        />
        <ChartItem
          config={{
            type: "bar",
            colors: ["orange"],
            axisOptions: {
              xAxisMode: "tick",
              xIsSeries: true,
            },
            barOptions: {
              stacked: true,
              spaceRatio: 0.5,
            },
            valuesOverPoints: 1,
          }}
          data={{
            labels: [
              "12am-3am",
              "3am-6am",
              "6am-9am",
              "9am-12pm",
              "12pm-3pm",
              "3pm-6pm",
              "6pm-9pm",
              "9pm-12am",
            ],

            datasets: [
              {
                values: [25, 40, 30, 35, 8, 52, 17, -4],
              },
            ],
          }}
          span={6}
        />
        <ChartItem
          config={{
            type: "percentage",
            valuesOverPoints: 1,
          }}
          data={{
            labels: [
              "12am-3am",
              "3am-6am",
              "6am-9am",
              "9am-12pm",
              "12pm-3pm",
              "3pm-6pm",
              "6pm-9pm",
              "9pm-12am",
            ],
            datasets: [
              {
                values: [25, 40, 30, 35, 8, 52, 17, -4],
              },
            ],
          }}
          span={6}
        />
      </div>
      <hr />
    </section>
  );
}

export default TableMetric;
