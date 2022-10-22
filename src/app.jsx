import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import initSqlJs from "sql.js";
import { Suspense, lazy } from "preact/compat";
import { Link, Route, Switch, useLocation } from "wouter-preact";
import { useEffect, useState } from "preact/hooks";
import { db } from "./contexts";
import { navigation } from "./constants";
import { classNames } from "./utils";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { Fragment } from "preact";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Import = lazy(() => import("./pages/Import"));
const Manage = lazy(() => import("./pages/Manage"));
const Compare = lazy(() => import("./pages/Compare"));

import SWModal from "./components/core/SWModal";
import SnackBar from "./components/core/Snackbar";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  useEffect(async () => {
    try {
      const SQL = await initSqlJs({ locateFile: (file) => "/sql/" + file });
      db.value = new SQL.Database();
      window.addEventListener("beforeunload", (event) => {
        event.preventDefault();
        return (event.returnValue =
          "Are you sure you saved your work before leaving?");
      });
    } catch (err) {
      console.error(err);
    }
    return () => {
      db.value.close();
    };
  }, []);

  return (
    <div>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-40 md:hidden'
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-600 bg-opacity-75' />
          </Transition.Child>

          <div className='fixed inset-0 z-40 flex'>
            <Transition.Child
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'
            >
              <Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-gray-800'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-in-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in-out duration-300'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='absolute top-0 right-0 -mr-12 pt-2'>
                    <button
                      type='button'
                      className='ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className='sr-only'>Close sidebar</span>
                      <XMarkIcon
                        className='h-6 w-6 text-white'
                        aria-hidden='true'
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className='h-0 flex-1 overflow-y-auto pt-5 pb-4'>
                  <div className='flex flex-shrink-0 items-center px-4'>
                    <img
                      className='h-8 w-auto'
                      src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
                      alt='Your Company'
                    />
                  </div>
                  <nav className='mt-5 space-y-1 px-2'>
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          location === item.href
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            location === item.href
                              ? "text-gray-300"
                              : "text-gray-400 group-hover:text-gray-300",
                            "mr-4 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden='true'
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className='flex flex-shrink-0 bg-gray-700 p-4'>
                  <a href='#' className='group block flex-shrink-0'>
                    <div className='flex items-center'>
                      <div>
                        <img
                          className='inline-block h-10 w-10 rounded-full'
                          src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                          alt=''
                        />
                      </div>
                      <div className='ml-3'>
                        <p className='text-base font-medium text-white'>
                          Tom Cook
                        </p>
                        <p className='text-sm font-medium text-gray-400 group-hover:text-gray-300'>
                          View profile
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className='w-14 flex-shrink-0'>
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className='hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col'>
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className='flex min-h-0 flex-1 flex-col bg-gray-800'>
          <div className='flex flex-1 flex-col overflow-y-auto pt-5 pb-4'>
            <div className='flex flex-shrink-0 items-center px-4 space-x-6'>
              <img
                className='h-8 w-auto'
                src='android-chrome-512x512.png'
                alt='Kotaku'
              />
              <h1 className='text-white font-semibold text-lg'>Kotaku</h1>
            </div>
            <nav className='mt-5 flex-1 space-y-1 px-2'>
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
            <button className='p-4 group block w-full flex-shrink-0 hover:bg-gray-700'>
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

      {/* Main Area */}
      <div className='flex flex-1 flex-col md:pl-64'>
        <div className='sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden'>
          <button
            type='button'
            className='-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
            onClick={() => setSidebarOpen(true)}
          >
            <span className='sr-only'>Open sidebar</span>
            <Bars3Icon className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        <Switch className='flex-1'>
          <Route path='/'>
            <Suspense fallback={<></>}>
              <Import />
            </Suspense>
          </Route>
          <Route path='/manage'>
            <Suspense fallback={<></>}>
              <Manage />
            </Suspense>
          </Route>
          <Route path='/compare'>
            <Suspense fallback={<></>}>
              <Compare />
            </Suspense>
          </Route>
          <Route path='/dashboard'>
            <Suspense fallback={<></>}>
              <Dashboard />
            </Suspense>
          </Route>
        </Switch>
      </div>
      <SWModal />
      <SnackBar />
    </div>
  );
}
