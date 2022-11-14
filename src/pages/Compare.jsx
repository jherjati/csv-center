import { useErrorBoundary, useState } from "preact/hooks";
import PageError from "../components/core/PageError";
import EmptyDb from "../components/core/EmptyDb";
import { useTables } from "../hooks";
import { setSnackContent } from "../utils";
import ConfigCard from "../components/compare/ConfigCard";
import ResultCard from "../components/compare/ResultCard";

function Compare() {
  const { dbTables } = useTables();
  const [chartConfig, setChartConfig] = useState([
    ["options.scales.x.title.text", "coba dynamic"],
  ]);
  const [dataConfigs, setDataConfigs] = useState([
    {
      xColumn: "km_hm1",
      yColumn: "panjang_kerusakan",
      tableName: "exception_report",
      limit: 100,
      backgroundColor: "red",
      borderColor: "pink",
    },
    {
      xColumn: "km_hm1",
      yColumn: "kerusakan_mm",
      tableName: "exception_report_2",
      limit: 100,
      backgroundColor: "yellow",
      borderColor: "orange",
    },
  ]);

  const [error, resetError] = useErrorBoundary((error) => {
    console.error(error);
    setSnackContent([
      "error",
      "Unexpected Thing Happened",
      "Don't worry, refresh button is your friend",
    ]);
  });
  if (error) {
    return <PageError resetError={resetError} />;
  } else {
    return (
      <main className='py-6'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>Compare</h1>
        </div>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 md:px-8'>
          {(!dbTables || !dbTables.length) && <EmptyDb />}
          {dbTables && (
            <>
              <ResultCard chartConfig={chartConfig} dataConfigs={dataConfigs} />
              <ConfigCard
                chartConfig={chartConfig}
                dataConfigs={dataConfigs}
                setChartConfig={setChartConfig}
                setDataConfigs={setDataConfigs}
              />
            </>
          )}
        </div>
      </main>
    );
  }
}

export default Compare;
