import { classNames } from "../../utils";

export default function TableTabs({ dbTables, setActiveTable, activeTable }) {
  return (
    <div className='mt-6'>
      <nav className='flex' aria-label='Tabs'>
        {dbTables.map((tab, idx) => (
          <button
            onClick={() => setActiveTable(idx)}
            key={tab}
            className={classNames(
              idx === activeTable
                ? "bg-white text-gray-800"
                : "text-gray-600 hover:text-gray-800",
              "px-6 pb-2 pt-3 font-medium text-sm rounded-t-lg"
            )}
            aria-current={idx === activeTable ? "page" : undefined}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
