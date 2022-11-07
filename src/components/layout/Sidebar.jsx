import { Link, useLocation } from "wouter-preact";
import { navigation } from "../../constants";
import { classNames } from "../../utils";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

function Sidebar() {
  const [location, setLocation] = useLocation();

  return (
    <div className='fixed inset-y-0 flex w-56 flex-col'>
      <div className='flex min-h-0 flex-1 flex-col bg-gray-800'>
        <div className='flex flex-1 flex-col overflow-y-auto pb-4'>
          <img
            className='w-full bg-white'
            src='long_icon.png'
            alt='CSV Center'
          />
          <nav className='mt-2 flex-1 space-y-1 px-2'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  location === item.href
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                )}
              >
                <item.icon
                  className={classNames(
                    location === item.href
                      ? "text-gray-300"
                      : "text-gray-400 group-hover:text-gray-300",
                    "mr-3 flex-shrink-0 h-6 w-6"
                  )}
                  aria-hidden='true'
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className='flex flex-shrink-0 bg-gray-700'>
          <button
            onClick={() => {
              setLocation("/guidance");
            }}
            className='p-4 group block w-full flex-shrink-0 hover:bg-gray-700'
          >
            <div className='flex items-center'>
              <QuestionMarkCircleIcon
                className='mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300 scale-150'
                aria-hidden='true'
              />
              <div className='ml-3 text-left'>
                <p className='text-sm font-medium text-gray-300 group-hover:text-white'>
                  Guidance
                </p>
                <p className='text-xs font-medium text-gray-400 group-hover:text-gray-300'>
                  Simply get started
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
