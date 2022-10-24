import { useEffect, useState } from "preact/hooks";
import { dbWorker } from "../../contexts";
import Charts from "./Charts";
import Stats from "./Stats";

function TableMetric({ name }) {
  const [stats, setStats] = useState([]);
  const [config, setConfig] = useState({ stats: ["column_4"] });

  useEffect(() => {
    dbWorker.value.onmessage = ({ data }) => {
      console.log(data.results[0].values);
      if (data.id === "get metric") {
        setStats(data.results[0].values);
      }
    };

    dbWorker.value.postMessage({
      id: "get metric",
      action: "exec",
      sql: `${config.stats.map(
        (stat) =>
          `SELECT MAX(${stat}), AVG(${stat}), MIN(${stat}), COUNT(${stat}) FROM '${name}';`
      )}`,
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
      <Charts />
      <hr />
    </section>
  );
}

export default TableMetric;
