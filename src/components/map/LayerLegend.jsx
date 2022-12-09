import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { layerConfigs } from "../../contexts";

function LayerLegend({ setOpen, setFocusLayer }) {
  return (
    <div className='absolute bottom-6 right-2 w-72 z-10 space-y-1'>
      {layerConfigs.value.map(({ layerName, circleColor, type }) => (
        <button
          key={layerName}
          className='flex items-center space-x-2 border p-2 rounded-lg w-full border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
          onClick={() => {
            setFocusLayer(layerName);
            setOpen(true);
          }}
        >
          <span
            className='h-4 w-4 p-1 rounded-full'
            style={{
              backgroundColor: type === "heatmap" ? "red" : circleColor,
            }}
          />
          <h6 className='grow overflow-x-scroll text-left'>{layerName}</h6>
          <TrashIcon
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              layerConfigs.value = layerConfigs.value.filter(
                (conf) => conf.layerName !== layerName
              );
            }}
            type='button'
            role='button'
            className='h-4 w-4 hover:text-red-600'
          />
        </button>
      ))}
      <button
        onClick={() => setOpen(true)}
        className='flex items-center space-x-2 border p-2 rounded-lg w-full border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
      >
        <PlusIcon className='h-4 w-4 rounded-full' />
        <h6 className='grow overflow-x-scroll text-left'>Add Layer</h6>
      </button>
    </div>
  );
}

export default LayerLegend;
