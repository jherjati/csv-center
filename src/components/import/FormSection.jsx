import { types } from "../../constants";

function FormSection({ tabName, fields, columns }) {
  return (
    <section className='grid grid-cols-2 gap-4'>
      {tabName === "Dynamic"
        ? fields.map((col, id) => (
            <div key={id}>
              <label
                htmlFor={col + "_mapping"}
                className='block text-sm font-medium text-gray-700'
              >
                {col ?? ""}
              </label>
              <select
                name={col}
                id={col + "_mapping"}
                className='mt-2 w-full shadow-sm focus:ring-teal-500 focus:border-teal-500 block sm:text-sm border-gray-300 rounded-md'
              >
                {types.map(({ label }) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ))
        : columns.map((col, id) => {
            const candidates = col.aliases.concat([col.name]).map((el) =>
              el
                .trim()
                .toLowerCase()
                .replaceAll(/[^a-zA-Z0-9]/g, "_")
                .replaceAll("__", "_")
            );
            return (
              <div key={id}>
                <label
                  htmlFor={col.name + "_mapping"}
                  className='block text-sm font-medium text-gray-700'
                >
                  {col.name + ` (${col.type}) :`}
                </label>
                <select
                  name={col.name}
                  id={col.name + "_mapping"}
                  className='mt-2 w-full shadow-sm focus:ring-teal-500 focus:border-teal-500 block sm:text-sm border-gray-300 rounded-md'
                  defaultValue={fields.find((el) =>
                    candidates.includes(
                      el
                        .trim()
                        .toLowerCase()
                        .replaceAll(/[^a-zA-Z0-9]/g, "_")
                        .replaceAll("__", "_")
                    )
                  )}
                >
                  {fields.map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
    </section>
  );
}

export default FormSection;
