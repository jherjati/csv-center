import { useEffect, useMemo, useRef } from "preact/hooks";
import { Chart } from "chart.js";
import { filterToString, filterToValues, setSnackContent } from "../../utils";
import { DBWorker } from "../../constants";

function ChartBox({ config, name, filter }) {
  const elRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (!(config.xColumn && config.yColumn.length)) {
      setSnackContent([
        "error",
        "Insufficient Data",
        "Chart requires at least 2 real or integer columns",
      ]);
    }

    if (elRef.current) {
      chartRef.current = new Chart(elRef.current.getContext("2d"), {
        ...config,
      });
    }

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  useEffect(async () => {
    const sql =
      config.type === "bar"
        ? `SELECT ${config.xColumn}, ${config.dataOperator[0]}(${
            config.yColumn[0]
          }) FROM '${name}' ${filterToString(filter)} GROUP BY ${
            config.xColumn
          } ORDER BY ${config.dataOperator[0]}(${config.yColumn[0]});`
        : `SELECT ${config.xColumn}, ${config.yColumn.join(
            ", "
          )} FROM '${name}' ${filterToString(filter)} ORDER BY ${
            config.xColumn
          } LIMIT ${config.dataLimit};`;
    const params = filterToValues(filter);

    const { results } = await DBWorker.pleaseDo({
      id: "get chart data",
      action: "exec",
      params,
      sql,
    });

    if (results?.length) {
      const result = results[0];
      const data = {
        labels:
          config.type === "line" ? [] : result.values.map((value) => value[0]),
        datasets: config.borderColor.map((col, colIdx) => ({
          label: result.columns[colIdx + 1],
          normalized: true,
          parsing: config.type !== "line",
          borderColor: col,
          backgroundColor: config.backgroundColor[colIdx],
          data: result.values.map((value) => ({
            x: value[0],
            y: value[colIdx + 1],
          })),
        })),
      };
      chartRef.current.data = data;
      chartRef.current.update();
    }
  }, [config]);

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
