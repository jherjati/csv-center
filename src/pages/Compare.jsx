import ConfigCard from "../components/compare/ConfigCard";
import ResultCard from "../components/compare/ResultCard";
import { chartConfig, dataConfigs } from "../contexts";

function Compare({ dbTables }) {
  return (
    <main className='py-6'>
      <div className='mx-auto max-w-7xl px-8'>
        <h1 className='text-2xl font-semibold text-gray-900'>Compare</h1>
      </div>
      <div className='mx-auto max-w-7xl px-8'>
        <ResultCard
          chartConfig={chartConfig.value}
          dataConfigs={dataConfigs.value}
        />
        <ConfigCard
          chartConfig={chartConfig.value}
          dataConfigs={dataConfigs.value}
          setChartConfig={(i) => (chartConfig.value = i)}
          setDataConfigs={(i) => (dataConfigs.value = i)}
          dbTables={dbTables}
        />
      </div>
    </main>
  );
}

export default Compare;
