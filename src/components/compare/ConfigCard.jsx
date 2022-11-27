import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "preact/hooks";
import { formats } from "../../contexts";

const configForm = {
  tableName: ["select", "Table Name"],
  xColumn: ["text", "X Column"],
  yColumn: ["text", "Y Column"],
  limit: ["number", "First Data Limit"],
  backgroundColor: ["color", "Background Color"],
  borderColor: ["color", "Border Color"],
};

function ConfigCard({
  chartConfig,
  setChartConfig,
  dataConfigs,
  setDataConfigs,
  dbTables,
}) {
  const [localGeneralConfig, setLocalGeneralConfig] = useState(chartConfig);
  const [localChartConfig, setLocalChartConfig] = useState(dataConfigs);
  const [tabIdx, setTabIdx] = useState(0);

  const handleChange = (event) => {
    setLocalChartConfig((prev) => {
      const newConfigs = [...prev];
      const newConfig = {
        ...prev[tabIdx],
        [event.target.name]: event.target.value,
      };
      newConfigs[tabIdx] = newConfig;
      return newConfigs;
    });
  };

  return (
    <section className='my-6 pt-3 pb-6 bg-white shadow rounded-lg'>
      <h4 className='px-6 text-xl font-semibold text-gray-900 capitalize'>
        Configuration
      </h4>
      <form
        className='px-6 mt-6'
        onSubmit={(event) => {
          event.preventDefault();
          setChartConfig(localGeneralConfig);
          setDataConfigs(localChartConfig);
        }}
      >
        <label
          htmlFor='options.scales.x.title.text'
          className='block text-sm font-medium text-gray-700'
        >
          X Axis Label
        </label>
        <input
          type='text'
          name='options.scales.x.title.text'
          className='w-full mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block text-sm border-gray-300 rounded-md'
          value={
            localGeneralConfig.find(
              ([name]) => name === "options.scales.x.title.text"
            )[1]
          }
          onChange={(event) =>
            setLocalGeneralConfig([
              ["options.scales.x.title.text", event.target.value],
            ])
          }
        />
        {/* Tabs */}
        <div className='flex text-sm font-medium mt-3'>
          {localChartConfig.map(({ id }, configIdx) => (
            <button
              key={id}
              onClick={(event) => {
                event.preventDefault();
                setTabIdx(configIdx);
              }}
              className={`flex grow border-x border-t rounded-t-md pl-3 pr-2 pt-2 pb-1 justify-between ${
                configIdx === tabIdx
                  ? "border-gray-400"
                  : "border-b border-b-gray-400"
              }`}
            >
              <h6
                className={`${
                  configIdx === tabIdx
                    ? "text-gray-700"
                    : "text-gray-300 hover:text-gray-700"
                }`}
              >
                {"Dataset " + (configIdx + 1)}
              </h6>
              {Boolean(configIdx) && (
                <XCircleIcon
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (configIdx === tabIdx) {
                      setTabIdx(0);
                    }
                    setLocalChartConfig((prev) => [
                      ...prev.filter((el) => el.id !== id),
                    ]);
                  }}
                  className='w-5 h-5 text-gray-400 hover:text-gray-700'
                />
              )}
            </button>
          ))}
          <button
            onClick={() => {
              setLocalChartConfig((prev) => [
                ...prev,
                {
                  id: window.crypto.randomUUID(),
                  tableName: null,
                  xColumn: null,
                  yColumn: null,
                  limit: 250,
                  backgroundColor: null,
                  borderColor: null,
                },
              ]);
            }}
            className='flex border-x border-t border-b border-b-gray-400 rounded-t-md px-2 pt-2 pb-1 justify-between'
          >
            <PlusCircleIcon className='w-5 h-5 text-gray-400 hover:text-gray-700' />
          </button>
        </div>
        {/* Config */}
        <div
          key={tabIdx}
          className='w-full h-56 border-b border-x border-gray-400 rounded-b-md grid grid-cols-12 p-6 gap-x-4'
        >
          {Object.keys(configForm).map((key) =>
            key === "tableName" ? (
              <div className='col-span-4'>
                <label
                  htmlFor={key}
                  className='block text-sm font-medium text-gray-700'
                >
                  {configForm[key][1]}
                </label>
                <select
                  name={key}
                  className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-md'
                  value={localChartConfig[tabIdx][key]}
                  onChange={handleChange}
                  required
                >
                  <option></option>
                  {dbTables.map((opt) => (
                    <option value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ) : key.includes("Column") ? (
              <div className='col-span-4'>
                <label
                  htmlFor={key}
                  className='block text-sm font-medium text-gray-700'
                >
                  {configForm[key][1]}
                </label>
                <select
                  name={key}
                  className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-md'
                  value={localChartConfig[tabIdx][key]}
                  onChange={handleChange}
                  required
                >
                  <option></option>
                  {formats.value[localChartConfig[tabIdx].tableName]
                    ?.filter((col) => ["real", "integer"].includes(col.type))
                    .map((col) => (
                      <option value={col.name}>{col.name}</option>
                    ))}
                </select>
              </div>
            ) : (
              <div className='col-span-4'>
                <label
                  htmlFor={key}
                  className='block text-sm font-medium text-gray-700'
                >
                  {configForm[key][1]}
                </label>
                <input
                  type={configForm[key][0]}
                  name={key}
                  className={`mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full ${
                    configForm[key][0] === "color" ? "h-10 p-0 border-0" : ""
                  } text-sm border-gray-300 rounded-md`}
                  value={localChartConfig[tabIdx][key]}
                  onChange={handleChange}
                  required
                />
              </div>
            )
          )}
        </div>
        <button className='py-3 px-6 mt-6 rounded-lg block mx-auto bg-teal-600 text-white'>
          Apply
        </button>
      </form>
    </section>
  );
}

export default ConfigCard;
