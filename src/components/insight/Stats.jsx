import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../utils";

export default function Stats({ column, values }) {
  const stats = [
    {
      name: "Maximum",
      change:
        parseFloat(((values[0] - values[1]) / values[1]) * 100).toFixed(2) +
        "%",
      changeType: "increase",
    },
    {
      name: "Average",
      change: "0%",
      changeType: "increase",
    },
    {
      name: "Minimum",
      change:
        parseFloat(((values[2] - values[1]) / values[1]) * 100).toFixed(2) +
        "%",
      changeType: "decrease",
    },
  ];
  return (
    <dl className='grid grid-cols-1 divide-y divide-gray-200 overflow-hidden md:grid-cols-3 md:divide-y-0 md:divide-x'>
      {stats.map((item, idx) => (
        <div key={item.name} className='px-4 py-5 sm:p-6'>
          <dt className='text-base font-normal text-gray-900'>
            {item.name} {column} value
          </dt>
          <dd className='mt-1 flex items-baseline justify-between md:block lg:flex'>
            <div className='flex items-baseline text-2xl font-semibold text-indigo-600'>
              {parseFloat(values[idx]).toFixed(2)}
              <span className='ml-2 text-sm font-medium text-gray-500'>
                from {values[3]} rows
              </span>
            </div>

            {idx !== 1 && (
              <div
                className={classNames(
                  item.changeType === "increase"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800",
                  "inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0"
                )}
              >
                {item.changeType === "increase" ? (
                  <ArrowUpIcon
                    className='-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500'
                    aria-hidden='true'
                  />
                ) : (
                  <ArrowDownIcon
                    className='-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500'
                    aria-hidden='true'
                  />
                )}

                <span className='sr-only'>
                  {" "}
                  {item.changeType === "increase"
                    ? "Increased"
                    : "Decreased"}{" "}
                  by{" "}
                </span>
                {item.change}
              </div>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
