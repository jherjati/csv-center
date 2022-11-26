import { useLocation } from "wouter-preact";
import { parse } from "papaparse";
import { parse as dateParse } from "date-fns";
import { useState, useMemo } from "preact/hooks";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

import { formats, withHeader } from "../../contexts";
import { types, DBWorker } from "../../constants";
import {
  dbNameEscaper,
  formatColumns,
  formatDynamic,
  realTransformer,
  setSnackContent,
  symbolReplacer,
} from "../../utils";

function FormatForm({ tabName, fields, file }) {
  const [_, setLocation] = useLocation();

  const columns = useMemo(
    () => (tabName === "Dynamic" ? [] : formats.value[tabName]),
    [tabName, formats.value]
  );
  const [isImport, setIsImport] = useState(false);

  const handleImport = async (event) => {
    event.preventDefault();
    try {
      setIsImport(true);
      const form = new FormData(event.target);
      let stepFunction,
        tableName = tabName;

      if (tabName === "Dynamic") {
        tableName = file.name.split(".")[0];
        const formData = Object.fromEntries(form.entries());
        const newFormat = [],
          realKeys = [],
          dateKeys = [];

        Object.keys(formData).forEach((key) => {
          newFormat.push({
            name: withHeader.value ? dbNameEscaper(key) : "column_" + key,
            type: formData[key],
            aliases: withHeader.value ? [] : [key],
          });
          if (formData[key] === "real") {
            realKeys.push(key);
          } else if (
            types
              .filter((ty) => ty.label.includes("date "))
              .map((ty) => ty.label)
              .includes(formData[key])
          ) {
            dateKeys.push({
              key: key,
              format: symbolReplacer(/\[(.*?)\]/.exec(formData[key])[1]),
            });
          }
        });

        const newFormats = { ...formats.value, [tableName]: newFormat };
        localStorage.setItem("predefined_tables", JSON.stringify(newFormats));
        formats.value = newFormats;

        await DBWorker.pleaseDo({
          id: "create table",
          action: "exec",
          sql: `CREATE TABLE IF NOT EXISTS '${tableName}'( ${formatDynamic(
            formData,
            withHeader.value
          )} );`,
        });

        stepFunction = (row, parser) => {
          Object.keys(row.data).forEach((key) => {
            if (row.data[key].includes(",") && realKeys.includes(key)) {
              row.data[key] = realTransformer(row.data[key]);
            } else if (dateKeys.map((k) => k.key).includes(key)) {
              row.data[key] =
                dateParse(
                  symbolReplacer(row.data[key]),
                  dateKeys.find((k) => k.key === key).format,
                  new Date()
                ) / 1000;
            }
          });
          const statement = `
            INSERT INTO '${tableName}' VALUES ( ${Object.keys(formData)
            .map(() => "?")
            .join(", ")} );
          `;

          parser.pause();
          DBWorker.pleaseDo({
            id: "insert row",
            action: "exec",
            sql: statement,
            params: Object.keys(formData).map((key) => row.data[key]),
          }).then(() => parser.resume());
        };
      } else {
        const mapping = Object.fromEntries(form.entries());
        const realKeys = [],
          dateKeys = [];
        columns.forEach((col) => {
          if (col.type === "real") {
            realKeys.push(mapping[col.name]);
          } else if (
            types
              .filter((ty) => ty.label.includes("date "))
              .map((ty) => ty.label)
              .includes(col.type)
          ) {
            dateKeys.push({
              key: mapping[col.name],
              format: symbolReplacer(/\[(.*?)\]/.exec(col.type)[1]),
            });
          }
        });

        await DBWorker.pleaseDo({
          id: "create table",
          action: "exec",
          sql: `CREATE TABLE IF NOT EXISTS '${tableName}'( ${formatColumns(
            columns
          )} );`,
        });

        stepFunction = (row, parser) => {
          Object.keys(row.data).forEach((key) => {
            if (row.data[key].includes(",") && realKeys.includes(key)) {
              row.data[key] = realTransformer(row.data[key]);
            } else if (dateKeys.map((k) => k.key).includes(key)) {
              row.data[key] =
                dateParse(
                  symbolReplacer(row.data[key]),
                  dateKeys.find((k) => k.key === key).format,
                  new Date()
                ) / 1000;
            }
          });
          const statement = `
            INSERT INTO '${tableName}' VALUES ( ${columns
            .map(() => "?")
            .join(", ")} );
            `;

          parser.pause();
          DBWorker.pleaseDo({
            id: "insert row",
            action: "exec",
            sql: statement,
            params: columns.map((col) => row.data[mapping[col.name]]),
          }).then(() => parser.resume());
        };
      }

      parse(file, {
        header: withHeader.value,
        skipEmptyLines: "greedy",
        step: stepFunction,
        error: function (error) {
          console.error(error);
          setIsImport(false);
          setSnackContent([
            "error",
            "An Error Occured",
            "A row is skipped due to format error",
          ]);
        },
        complete: function () {
          DBWorker.pleaseDo({
            id: "check complete",
            action: "exec",
            sql: `PRAGMA main.quick_check('${tableName}')`,
          }).then((data) => {
            setSnackContent([
              "success",
              tableName + " Table Checked",
              data.error
                ? "Something missed, maybe not needed, keep going!"
                : "All is well, happy exploration!",
            ]);
            setLocation("/manage?table=" + tableName);
          });
        },
      });
    } catch (error) {
      console.error(error);
      setIsImport(false);
      setSnackContent([
        "error",
        "An Error Occured",
        "You might miss something on your configuration",
      ]);
    }
  };

  return (
    <form onSubmit={handleImport}>
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
                  className='mt-2 w-full shadow-sm focus:ring-teal-500 focus:border-teal-500 block text-sm border-gray-300 rounded-md'
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
              const candidates = col.aliases
                .concat([col.name])
                .map((el) => dbNameEscaper(el).toLowerCase());
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
                    className='mt-2 w-full shadow-sm focus:ring-teal-500 focus:border-teal-500 block text-sm border-gray-300 rounded-md'
                    defaultValue={fields.find((el) =>
                      candidates.includes(dbNameEscaper(el).toLowerCase())
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
      <button className='py-3 px-6 mt-6 rounded-lg block mx-auto bg-teal-600 text-white'>
        {isImport ? (
          <ArrowPathIcon className='w-6 h-6 animate-spin mx-3' />
        ) : (
          "Import"
        )}
      </button>
    </form>
  );
}

export default FormatForm;
