import { useEffect, useMemo, useRef } from "preact/hooks";
import { Chart } from "chart.js";

function ChartBox({ data, config }) {
  const elRef = useRef();
  const chartRef = useRef();

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

  const colSpan = useMemo(() => {
    switch (config.span) {
      case "1":
        return "col-span-1";
      case "2":
        return "col-span-2";
      case "3":
        return "col-span-3";
      case "4":
        return "col-span-4";
      case "5":
        return "col-span-5";
      case "6":
        return "col-span-6";
      default:
        return "col-span-6";
    }
  }, [config.span]);

  return (
    <div className={`${colSpan} `}>
      <canvas className='w-full p-3' ref={elRef}></canvas>
    </div>
  );
}

export default ChartBox;
