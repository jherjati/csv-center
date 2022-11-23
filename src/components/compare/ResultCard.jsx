import { useEffect, useRef } from "preact/hooks";
import {
  Chart,
  LineController,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { DBWorker } from "../../contexts";
import { setPropByString } from "../../utils";
Chart.register(
  LineController,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function ResultCard({ chartConfig, dataConfigs }) {
  const elRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (elRef.current) {
      chartRef.current = new Chart(elRef.current.getContext("2d"), {
        type: "line",
        options: {
          responsive: true,
          scales: {
            x: {
              type: "linear",
              title: {
                display: true,
                text: "X Axis Label",
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
        data: {
          datasets: [
            {
              label: "data 1",
              data: [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
                { x: 4, y: 4 },
                { x: 5, y: 5 },
                { x: 6, y: 6 },
                { x: 7, y: 7 },
                { x: 8, y: 8 },
              ],
            },
            {
              label: "data 2",
              data: [
                { x: 0, y: 4 },
                { x: 1, y: 4 },
                { x: 2, y: 4 },
                { x: 3, y: 4 },
                { x: 4, y: 4 },
                { x: 5, y: 4 },
                { x: 6, y: 4 },
                { x: 7, y: 4 },
                { x: 8, y: 4 },
              ],
            },
          ],
        },
      });
    }

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    const sql = dataConfigs
      .map(
        ({ xColumn, yColumn, tableName, limit }) =>
          `SELECT ${xColumn}, ${yColumn} FROM ${tableName} ORDER BY ${xColumn} LIMIT ${limit}`
      )
      .join(" ; ");
    const params = [];
    DBWorker.pleaseDo({ id: "compare", action: "exec", params, sql }).then(
      (data) => {
        if (data.results?.length) {
          const datasets = data.results.map(({ columns, values }, idx) => ({
            label: `${dataConfigs[idx].tableName} (${columns[1]})`,
            data: values.map((val) => ({ x: val[0], y: val[1] })),
            parsing: false,
            normalized: true,
            backgroundColor: dataConfigs[idx].backgroundColor,
            borderColor: dataConfigs[idx].borderColor,
          }));
          chartRef.current.data = { datasets };
          chartConfig.forEach((conf) =>
            setPropByString(chartRef.current, conf[0], conf[1])
          );
          chartRef.current.update();
        }
      }
    );
  }, [chartConfig, dataConfigs]);

  return (
    <section className='my-6 py-3 bg-white shadow rounded-lg'>
      <canvas className='w-full p-3' ref={elRef}></canvas>
    </section>
  );
}

export default ResultCard;
