import { useCallback } from "preact/hooks";
import { Chart } from "chart.js";

function ChartEl({ data, config }) {
  const elRef = useCallback((node) => {
    if (node) {
      new Chart(node.getContext("2d"), { ...config, data });
    }
  }, []);

  return (
    <div
      className={`${
        ["line", "bar"].includes(config.type) ? "col-span-2" : "col-span-1"
      } `}
    >
      <canvas className='w-full p-3' ref={elRef}></canvas>
    </div>
  );
}

export default ChartEl;
