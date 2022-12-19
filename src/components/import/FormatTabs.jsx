import { classNames } from "../../utils";
import { TableCellsIcon } from "@heroicons/react/20/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

import { formats } from "../../contexts";

export default function FormatTabs({
  tabName,
  setTabName,
  setFocusFormat,
  setOpen,
}) {
  return (
    <div className='border-b border-gray-200 w-full mb-6'>
      <div className='-mb-px flex overflow-x-scroll' aria-label='Format Tabs'>
        <button
          onClick={() => setTabName("Dynamic")}
          type={"button"}
          key={"Dynamic"}
          className={classNames(
            "Dynamic" === tabName
              ? "border-gray-500 text-teal-700"
              : "border-transparent hover:border-gray-300 text-teal-600 hover:text-teal-700",
            "group inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm grow capitalize"
          )}
          aria-current={"Dynamic" === tabName ? "page" : undefined}
        >
          <TableCellsIcon className='-ml-0.5 mr-2 h-5 w-5' aria-hidden='true' />
          <p>New</p>
        </button>
        {Object.keys(formats.value).map((tab) => (
          <button
            onClick={() => setTabName(tab)}
            type={"button"}
            key={tab}
            className={classNames(
              tab === tabName
                ? "border-gray-500 text-teal-700"
                : "border-transparent hover:border-gray-300 text-teal-600 hover:text-teal-700",
              "group inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm grow capitalize"
            )}
            aria-current={tab === tabName ? "page" : undefined}
          >
            <p className='grow text-left'>{tab}</p>
            <PencilSquareIcon
              className='h-5 w-5 ml-3'
              onClick={(event) => {
                event.stopPropagation();
                setFocusFormat(tab);
                setOpen(true);
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
