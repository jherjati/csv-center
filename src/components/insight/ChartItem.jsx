import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";
import { useCallback, useEffect, useMemo, useRef } from "preact/hooks";

function ChartItem({ config, data }) {
  const chartRef = useRef();

  const elRef = useCallback((node) => {
    if (node) chartRef.current = new Chart(node, { ...config, data });
  }, []);

  useEffect(() => {
    chartRef.current.update(data);
  }, [data]);

  const colSpan = useMemo(() => {
    switch (config.span) {
      case 1:
        return "col-span-1";
      case 2:
        return "col-span-2";
      case 3:
        return "col-span-3";
      case 4:
        return "col-span-4";
      case 5:
        return "col-span-5";
      case 6:
        return "col-span-6";
      default:
        return "col-span-6";
    }
  }, []);

  return (
    <aside className={` ${colSpan} min-h-max`}>
      <div className='w-full p-3' ref={elRef}></div>
    </aside>
  );
}

export default ChartItem;
