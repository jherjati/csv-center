import { useEffect, useState } from "preact/hooks";
import { formats, metricConfigs } from "../../contexts";
import Actions from "../core/Actions";
import StatsBox from "./StatsBox";
import {
  Chart,
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartBox from "./ChartBox";
import FilterModal from "../core/FilterModal";
import ConfigModal from "./ConfigModal";
import annotationPlugin from "chartjs-plugin-annotation";
import { forwardRef } from "react";
import {
  Cog8ToothIcon,
  FunnelIcon,
  PrinterIcon,
} from "@heroicons/react/20/solid";

Chart.register(
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  annotationPlugin
);

const TableMetric = forwardRef(({ name, children, handlePrint }, ref) => {
  const columns = formats.value[name];
  const [filter, setFilter] = useState([]);

  // Fill Config Placeholder
  useEffect(() => {
    if (columns.length && !metricConfigs.value[name]) {
      const numberColumns = columns.filter((col) =>
        ["integer", "real"].includes(col.type)
      );
      metricConfigs.value = {
        ...metricConfigs.value,
        [name]: {
          stats: [numberColumns[0]?.name],
          charts: [
            {
              type: "line",
              options: {
                scales: {
                  x: {
                    type: "linear",
                    title: {
                      display: true,
                      text: numberColumns[0]?.name,
                    },
                  },
                },
                plugins: {
                  annotation: {
                    annotations: {
                      box: {
                        display: false,
                        type: "box",
                        backgroundColor: "rgba(255, 99, 132, 0.25)",
                        label: {
                          drawTime: "afterDraw",
                          display: true,
                          position: {
                            x: "start",
                            y: "center",
                          },
                        },
                      },
                    },
                  },
                },
              },
              span: 6,
              dataLimit: 250,
              yColumn: [numberColumns[1]?.name],
              borderColor: ["#ffa500"],
              backgroundColor: ["#ee4b2b"],
            },
          ],
        },
      };
    }
  }, [columns]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  return (
    <section className='bg-white overflow-hidden shadow rounded-lg my-6 pb-6'>
      <div className='py-3 px-6 bg-white flex justify-between items-center'>
        {children}
        <Actions
          count={filter.length}
          icons={[FunnelIcon, Cog8ToothIcon, PrinterIcon]}
          labels={["Filter", "Config", "Print"]}
          handlers={[
            () => setFilterOpen(true),
            () => setConfigOpen(true),
            handlePrint,
          ]}
        />
      </div>
      <div ref={ref} className='border-y border-gray-200'>
        {metricConfigs.value[name]?.stats.map((col) => (
          <StatsBox column={col} tableName={name} filter={filter} />
        ))}
        <div className='w-full grid grid-cols-6'>
          {metricConfigs.value[name]?.charts.map((config, idx) => (
            <ChartBox
              key={config.type + idx}
              config={config}
              tableName={name}
              filter={filter}
            />
          ))}
        </div>
      </div>
      {columns.length ? (
        <>
          <FilterModal
            open={filterOpen}
            setOpen={setFilterOpen}
            tableName={name}
            filter={filter}
            setFilter={setFilter}
            columns={columns}
          />
          <ConfigModal
            open={configOpen}
            setOpen={setConfigOpen}
            tableName={name}
            columns={columns}
          />
        </>
      ) : null}
    </section>
  );
});

export default TableMetric;
