import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

function LayerLegend({ setOpen, configs, setFocusLayer, setLayerConfigs }) {
  return (
    <div className='absolute bottom-9 right-4 w-1/3 p-2 z-10 space-y-1'>
      {configs.map(({ layerName, circleColor }) => (
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
            style={{ backgroundColor: circleColor }}
          />
          <h6 className='grow overflow-x-scroll text-left'>{layerName}</h6>
          <TrashIcon
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setLayerConfigs((prev) =>
                prev.filter((conf) => conf.layerName !== layerName)
              );
            }}
            type='button'
            role={"button"}
            className='h-4 w-4 hover:text-red-600'
          />
        </button>
      ))}
      <button
        onClick={() => {
          setOpen(true);
        }}
        className='flex items-center space-x-2 border p-2 rounded-lg w-full border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
      >
        <PlusIcon className='h-4 w-4 rounded-full' />
        <h6 className='grow overflow-x-scroll text-left'>Add Layer</h6>
      </button>
    </div>
  );
}

export default LayerLegend;
