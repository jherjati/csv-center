import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { TbCircle, TbCircles, TbCircle2 } from "react-icons/tb";
import { formats, layerConfigs } from "../../contexts";

const configForm = {
  circle: {
    layerName: ["text", "Layer Name"],
    tableName: ["select", "Table Name"],
    longColumn: ["select", "Longitude Column"],
    latColumn: ["select", "Latitude Column"],
    circleColor: ["color", "Color"],
    circleRadius: ["number", "Radius", 0],
  },
  heatmap: {
    layerName: ["text", "Layer Name"],
    tableName: ["select", "Table Name"],
    longColumn: ["select", "Longitude Column"],
    latColumn: ["select", "Latitude Column"],
    heatmapIntensity: ["number", "Intensity", 0],
    heatmapOpacity: ["number", "Opacity", 0],
    heatmapRadius: ["number", "Radius", 1],
    heatmapWeight: ["number", "Weight", 0],
  },
};

export default function LayerModal({
  open,
  setOpen,
  dbTables,
  isEditing,
  layerConfig,
}) {
  const [type, setType] = useState("circle");
  const layerForm = useMemo(() => configForm[type], [type]);

  const [localLayerConfig, setLocalLayerConfig] = useState({
    layerName: null,
    tableName: null,
    longColumn: null,
    latColumn: null,
    circleColor: null,
    circleRadius: 3,
  });

  useEffect(() => {
    if (open) {
      if (isEditing) {
        setLocalLayerConfig(layerConfig);
        setType(layerConfig.type);
      } else {
        setLocalLayerConfig({
          layerName: null,
          tableName: null,
          longColumn: null,
          latColumn: null,
          circleColor: null,
          circleRadius: 3,
        });
      }
    }
  }, [open]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      const data = Object.fromEntries(form.entries());
      const newConfigs = ((prev) => {
        if (isEditing) {
          const newConfigs = [...prev];
          const oldIdx = newConfigs.findIndex(
            (conf) => conf.layerName === layerConfig.layerName
          );
          newConfigs[oldIdx] = data;
          return newConfigs;
        } else {
          return [...prev, data];
        }
      })(layerConfigs.value);
      layerConfigs.value = newConfigs;
      setOpen(false);
    },
    [layerConfig]
  );

  const handleChange = (event) => {
    setLocalLayerConfig((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6'>
                <form
                  id='detail-form'
                  onSubmit={handleSubmit}
                  onReset={(event) => {
                    event.preventDefault();
                    setOpen(false);
                  }}
                >
                  <h4 className='text-lg leading-6 font-medium text-gray-900 capitalize'>
                    {isEditing && layerConfig
                      ? layerConfig.layerName
                      : "New Layer"}
                  </h4>
                  {/* Inputs */}
                  <div className='mt-6 grid gap-y-6 gap-x-4 grid-cols-6'>
                    <div className='col-span-6 grid grid-cols-6 gap-x-3 gap-y-1'>
                      <label className='col-span-6 block text-sm font-medium text-gray-700'>
                        Layer Type
                      </label>
                      <div className='col-span-2'>
                        <input
                          onChange={(event) => setType(event.target.value)}
                          type='radio'
                          id='circle-layer'
                          name='type'
                          value='circle'
                          class='hidden peer'
                          checked={type === "circle"}
                        />
                        <label
                          for='circle-layer'
                          class='inline-flex justify-center items-center space-x-3 p-2 w-full text-gray-700 bg-white rounded-lg border border-gray-200 cursor-pointer  peer-checked:border-teal-600 peer-checked:text-teal-600 peer-checked:bg-gray-100 hover:text-gray-600 hover:bg-gray-100'
                        >
                          <TbCircle className='h-4 w-4' />
                          <h6 class='text-sm font-semibold'>Circle Layer</h6>
                        </label>
                      </div>
                      <div className='col-span-2'>
                        <input
                          onChange={(event) => {
                            setType(event.target.value);
                            if (!isEditing)
                              setLocalLayerConfig({
                                layerName: null,
                                tableName: null,
                                longColumn: null,
                                latColumn: null,
                                heatmapIntensity: 1,
                                heatmapOpacity: 1,
                                heatmapRadius: 30,
                                heatmapWeight: 1,
                              });
                          }}
                          type='radio'
                          id='heatmap-layer'
                          name='type'
                          value='heatmap'
                          class='hidden peer'
                          checked={type === "heatmap"}
                        />
                        <label
                          for='heatmap-layer'
                          class='inline-flex justify-center items-center space-x-3 p-2 w-full text-gray-700 bg-white rounded-lg border border-gray-200 cursor-pointer  peer-checked:border-teal-600 peer-checked:text-teal-600 peer-checked:bg-gray-100 hover:text-gray-600 hover:bg-gray-100'
                        >
                          <TbCircles className='h-4 w-4' />
                          <h6 class='text-sm font-semibold'>Heatmap Layer</h6>
                        </label>
                      </div>
                      <div className='col-span-2 relative'>
                        <input
                          type='radio'
                          id='cluster-layer'
                          name='type'
                          value='cluster'
                          class='hidden peer'
                          disabled
                        />
                        <label
                          for='cluster-layer'
                          class='inline-flex justify-center items-center space-x-3 p-2 w-full text-gray-700 bg-white rounded-lg border border-gray-200 peer-disabled:opacity-50'
                        >
                          <TbCircle2 className='h-4 w-4' />
                          <h6 class='text-sm font-semibold'>Cluster Layer</h6>
                        </label>
                        <span className='absolute top-0 right-0 -mr-2 -mt-4 py-1 px-3 text-xs flex justify-center items-center bg-teal-400 text-white rounded-xl shadow'>
                          Upcoming
                        </span>
                      </div>
                    </div>

                    {Object.keys(layerForm).map((key) =>
                      key === "tableName" ? (
                        <div key={key} className='col-span-3'>
                          <label
                            htmlFor={key}
                            className='block text-sm font-medium text-gray-700'
                          >
                            {layerForm[key][1]}
                          </label>
                          <select
                            name={key}
                            className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-md'
                            value={localLayerConfig[key]}
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
                        <div key={key} className='col-span-3'>
                          <label
                            htmlFor={key}
                            className='block text-sm font-medium text-gray-700'
                          >
                            {layerForm[key][1]}
                          </label>
                          <select
                            name={key}
                            className='mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-md'
                            value={localLayerConfig[key]}
                            onChange={handleChange}
                            required
                          >
                            <option></option>
                            {formats.value[localLayerConfig.tableName]
                              ?.filter((col) => ["real"].includes(col.type))
                              .map((col) => (
                                <option value={col.name}>{col.name}</option>
                              ))}
                          </select>
                        </div>
                      ) : (
                        <div key={key} className='col-span-3'>
                          <label
                            htmlFor={key}
                            className='block text-sm font-medium text-gray-700'
                          >
                            {layerForm[key][1]}
                          </label>
                          <input
                            type={layerForm[key][0]}
                            step='any'
                            min={layerForm[key][2]}
                            max={layerForm[key][1] === "Opacity" ? 1 : null}
                            name={key}
                            className={`mt-1 shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full ${
                              layerForm[key][0] === "color"
                                ? "h-10 p-0 border-0"
                                : ""
                            } text-sm border-gray-300 rounded-md`}
                            value={localLayerConfig[key]}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      )
                    )}
                  </div>
                  {/* Buttons */}
                  <div className='flex justify-center border-t mt-3 pt-3 border-teal-100'>
                    <button
                      type='reset'
                      className='bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
                    >
                      Apply
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
