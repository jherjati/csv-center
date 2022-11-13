import { useEffect, useRef, useState } from "preact/hooks";
import {
  Chart,
  LineController,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { dbWorker } from "../../contexts";
Chart.register(
  LineController,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function ResultCard() {
  const elRef = useRef();
  const chartRef = useRef();

  const [data, setData] = useState({
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
  });

  const config = {
    type: "line",
    options: {
      responsive: true,
      scales: {
        x: {
          type: "linear",
          title: {
            display: true,
            text: "km_hm1",
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  };

  useEffect(() => {
    if (elRef.current) {
      chartRef.current = new Chart(elRef.current.getContext("2d"), {
        ...config,
        data,
      });
    }

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data]);

  useEffect(() => {
    dbWorker.value.onmessage = ({ data }) => {
      const datasets = data.results.map(({ columns, values }, idx) => ({
        label: `exception_report_${idx + 1} (${columns[1]})`,
        data: values.map((val) => ({ x: val[0], y: val[1] })),
        parsing: false,
        normalized: true,
        borderColor: idx ? "pink" : "orange",
        backgroundColor: idx ? "red" : "yellow",
      }));
      setData({ datasets });
    };

    const sql = `
    SELECT km_hm1, panjang_kerusakan FROM exception_report ORDER BY km_hm1 LIMIT 100;
    SELECT km_hm1, kerusakan_mm FROM exception_report_2 ORDER BY km_hm1 LIMIT 100;
    `;
    const params = [];
    dbWorker.value.postMessage({ id: "compare", action: "exec", params, sql });
  }, []);

  return (
    <section className='my-6 py-3 bg-white shadow rounded-lg'>
      <h4 className='px-6 text-xl font-semibold text-gray-900 capitalize'>
        Result
      </h4>
      <canvas className='w-full p-3' ref={elRef}></canvas>
    </section>
  );
}

export default ResultCard;
