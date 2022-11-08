import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  PaperClipIcon,
  TagIcon,
} from "@heroicons/react/20/solid";
import { classNames, setSnackContent } from "../../utils";

const labels = [
  { name: "Bug Report", value: "bug report" },
  { name: "Feature Request", value: "feature request" },
  { name: "Others", value: "others" },
];

export default function UserFeedback() {
  const [labelled, setLabelled] = useState(labels[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [filename, setFilename] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const form = new FormData(event.target);
      const data = Object.fromEntries(form.entries());
      let res;
      if (filename) {
        res = await fetch("https://3ey9cs7f.directus.app/files", {
          method: "POST",
          body: form,
        });
        data.attachment = (await res.json()).data.id;
      } else {
        delete data.attachment;
      }
      res = await fetch("https://3ey9cs7f.directus.app/items/user_feedback", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("something");
      event.target.reset();
      setFilename();
      setSnackContent([
        "success",
        "Feedback Submitted",
        "Thank you for the feedback, we will consider it carefully",
      ]);
    } catch (_) {
      setSnackContent([
        "error",
        "Something unexpected happened",
        "Maybe you can try again later, don't give up :)",
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='relative w-full h-fit ml-6 bg-white rounded-lg overflow-hidden border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500'
    >
      <section>
        <label htmlFor='title' className='sr-only'>
          Title
        </label>
        <input
          type='text'
          name='title'
          id='title'
          className='block w-full border-0 pt-2.5 text-lg font-medium placeholder-gray-500 focus:ring-0'
          placeholder='Title'
        />
        <label htmlFor='description' className='sr-only'>
          Description
        </label>
        <textarea
          rows={9}
          name='description'
          id='description'
          className='block w-full resize-none border-0 py-0 placeholder-gray-500 focus:ring-0 sm:text-sm'
          placeholder='Write a description...'
          defaultValue={""}
        />
      </section>

      <div className='absolute z-10 right-0 top-0 flex flex-nowrap justify-end space-x-2 py-2 px-3'>
        <input
          type='text'
          className='hidden'
          name='tags'
          value={JSON.stringify([labelled.value])}
        />
        <Listbox
          as='div'
          value={labelled}
          onChange={setLabelled}
          className='flex-shrink-0'
        >
          {({ open }) => (
            <>
              <Listbox.Label className='sr-only'> Add a label </Listbox.Label>
              <div className='relative'>
                <Listbox.Button className='relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 py-2 px-2 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-3'>
                  <TagIcon
                    className={classNames(
                      labelled.value === null
                        ? "text-gray-300"
                        : "text-gray-500",
                      "h-5 w-5 flex-shrink-0 sm:-ml-1"
                    )}
                    aria-hidden='true'
                  />
                  <span
                    className={classNames(
                      labelled.value === null ? "" : "text-gray-900",
                      "hidden truncate sm:ml-2 sm:block"
                    )}
                  >
                    {labelled.value === null ? "Label" : labelled.name}
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                    {labels.map((label) => (
                      <Listbox.Option
                        key={label.value}
                        className={({ active }) =>
                          classNames(
                            active ? "bg-gray-100" : "bg-white",
                            "relative cursor-default select-none py-2 px-3"
                          )
                        }
                        value={label}
                      >
                        <div className='flex items-center'>
                          <span className='block truncate font-medium'>
                            {label.name}
                          </span>
                        </div>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>

      <div className='flex items-center justify-between space-x-3 border-t border-gray-200 py-2 px-3'>
        <div className='flex'>
          <label
            htmlFor='attachment'
            role='button'
            className='group -my-2 inline-flex items-center rounded-full py-2 text-left text-gray-400'
          >
            <PaperClipIcon
              className='mr-2 h-5 w-5 group-hover:text-gray-500'
              aria-hidden='true'
            />
            <span className='text-sm italic text-gray-500 group-hover:text-gray-600'>
              {filename ?? "Attach related file"}
            </span>
          </label>
          <input
            name='attachment'
            id='attachment'
            type='file'
            className='hidden'
            onChange={(event) => {
              setFilename(event.target.files[0].name);
            }}
          />
        </div>
        <div className='flex-shrink-0'>
          <button
            type='submit'
            className='w-20 text-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          >
            {isLoading ? (
              <ArrowPathIcon className='w-5 h-5 mx-auto animate-spin' />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
