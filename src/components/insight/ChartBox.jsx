import { useEffect, useMemo, useRef } from "preact/hooks";
import { Chart } from "chart.js";
import { filterToString, filterToValues, setSnackContent } from "../../utils";
import { DBWorker, randomColors } from "../../constants";

function ChartBox({ config, tableName, filter }) {
  const elRef = useRef(),
    chartRef = useRef();

  useEffect(() => {
    if (!config.yColumn.length)
      setSnackContent([
        "error",
        "Insufficient Data",
        "Chart requires at least 2 real or integer columns",
      ]);

    if (elRef.current)
      chartRef.current = new Chart(elRef.current.getContext("2d"), config);

    return () => chartRef.current && chartRef.current.destroy();
  }, []);

  useEffect(async () => {
    let xColumn =
        config.type === "pie"
          ? config.xColumn
          : config.options.scales.x.title.text,
      sql =
        config.type === "line"
          ? `SELECT ${xColumn}, ${config.yColumn.join(
              ", "
            )} FROM '${tableName}' ${filterToString(
              filter
            )} ORDER BY ${xColumn} LIMIT ${config.dataLimit};`
          : `SELECT ${xColumn}, ${config.dataOperator[0]}(${
              config.yColumn[0]
            }) FROM '${tableName}' ${filterToString(
              filter
            )} GROUP BY ${xColumn} ORDER BY ${config.dataOperator[0]}(${
              config.yColumn[0]
            });`;

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
        datasets: config.yColumn.map((_, yIdx) => ({
          normalized: true,
          parsing: !(config.type === "line"),
          label: result.columns[yIdx + 1],
          borderColor:
            config.type === "pie" ? randomColors : config.borderColor[yIdx],
          backgroundColor:
            config.type === "pie" ? randomColors : config.backgroundColor[yIdx],
          data: result.values.map((value) =>
            config.type === "pie"
              ? value[yIdx + 1]
              : {
                  x: value[0],
                  y: value[yIdx + 1],
                }
          ),
        })),
      };
      chartRef.current.data = data;
      if (config.type !== "pie")
        chartRef.current.options.scales.x.title.text = xColumn;
      chartRef.current.update();
    }
  }, [
    config.options.scales?.x?.title?.text,
    config.dataOperator,
    config.yColumn,
    config.dataLimit,
    config.borderColor,
    config.backgroundColor,
  ]);

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
