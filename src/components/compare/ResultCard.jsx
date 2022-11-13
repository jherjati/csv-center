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

  const data = {
      labels: [0, 1, 2, 3, 4, 5, 6, 7, 8],
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
    config = {
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

  useEffect(() => {}, []);

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
