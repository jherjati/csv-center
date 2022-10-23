import { classNames } from "../../utils";

export default function TableTabs({ dbTables, setActiveTable, activeTable }) {
  return (
    <nav className='flex space-x-4' aria-label='Tabs'>
      {dbTables.map((tab, idx) => (
        <button
          onClick={() => setActiveTable(idx)}
          key={tab}
          className={classNames(
            idx === activeTable
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-500 hover:text-gray-700",
            "px-3 py-2 font-medium text-sm rounded-md"
          )}
          aria-current={idx === activeTable ? "page" : undefined}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
