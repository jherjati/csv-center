import { classNames } from "../../utils";
import {
  AdjustmentsHorizontalIcon,
  TableCellsIcon,
} from "@heroicons/react/20/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

import { formats } from "../../contexts";

export default function Tabs({ tabName, setTabName, setFocusFormat, setOpen }) {
  return (
    <div className='border-b border-gray-200'>
      <nav className='-mb-px flex' aria-label='Tabs'>
        <button
          onClick={() => setTabName("Dynamic")}
          type={"button"}
          key={"Dynamic"}
          className={classNames(
            "Dynamic" === tabName
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            "group inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm flex-grow capitalize"
          )}
          aria-current={"Dynamic" === tabName ? "page" : undefined}
        >
          <AdjustmentsHorizontalIcon
            className={classNames(
              "Dynamic" === tabName
                ? "text-teal-500"
                : "text-gray-400 group-hover:text-gray-500",
              "-ml-0.5 mr-2 h-5 w-5"
            )}
            aria-hidden='true'
          />
          <span>Dynamic</span>
        </button>
        {Object.keys(formats.value).map((tab) => (
          <button
            onClick={() => setTabName(tab)}
            type={"button"}
            key={tab}
            className={classNames(
              tab === tabName
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              "group inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm flex-grow capitalize"
            )}
            aria-current={tab === tabName ? "page" : undefined}
          >
            <TableCellsIcon
              className={classNames(
                tab === tabName
                  ? "text-teal-500"
                  : "text-gray-400 group-hover:text-gray-500",
                "-ml-0.5 mr-2 h-5 w-5"
              )}
              aria-hidden='true'
            />
            <span className='grow text-left'>{tab}</span>
            <PencilSquareIcon
              className='h-5 w-5'
              onClick={(event) => {
                event.stopPropagation();
                setFocusFormat(tab);
                setOpen(true);
              }}
            />
          </button>
        ))}
      </nav>
    </div>
  );
}
