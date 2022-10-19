import { db, formats, withHeader } from "../../contexts";
import { useLocation } from "wouter-preact";
import { parse } from "papaparse";
import { parse as dateParse } from "date-fns";
import { useState, useMemo } from "preact/hooks";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useSnack } from "../../hooks";
import Tabs from "./Tabs";
import FormatModal from "./FormatModal";
import FormSection from "./FormSection";
import { types } from "../../constants";

const formatColumns = (columns) =>
  columns
    .map((el) => {
      return (
        el.name.replaceAll(/[^a-zA-Z0-9]/g, "_").replaceAll("__", "_") +
        " " +
        types.find((type) => type.label === el.type).db
      );
    })
    .join(", ");
const formatDynamic = (data, withHeader) =>
  Object.keys(data)
    .map((key) => {
      let columnName = "column_" + key;
      if (withHeader) {
        const temp = key.replaceAll(/[^a-zA-Z0-9]/g, "_").replaceAll("__", "_");
        columnName = temp.slice(-1) === "_" ? temp.slice(0, -1) : temp;
      }
      return (
        columnName + " " + types.find((type) => type.label === data[key]).db
      );
    })
    .join(", ");

function Mapping({ fields, file }) {
  const [_, setLocation] = useLocation();
  const [tabName, setTabName] = useState("Dynamic");
  const columns = useMemo(
    () => (tabName === "Dynamic" ? [] : formats.value[tabName]),
    [tabName, formats.value]
  );
  const [addOpen, setAddOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { setSnackContent } = useSnack();

  const handleImport = async (event) => {
    event.preventDefault();
    try {
      setIsImporting(true);
      const form = new FormData(event.target);
      let stepFunction;
      if (tabName === "Dynamic") {
        const tableName = file.name.split(".")[0];
        const formData = Object.fromEntries(form.entries());
        const newFormat = [],
          realKeys = [],
          dayKeys = [],
          monthKeys = [];

        Object.keys(formData).forEach((key) => {
          newFormat.push({ name: key, type: formData[key], aliases: [] });
          switch (formData[key]) {
            case "real":
              realKeys.push(key);
              break;
            case "date [dd-MM-yyyy]":
              dayKeys.push(key);
              break;
            case "date [MM-dd-yyyy]":
              monthKeys.push(key);
              break;
            default:
              break;
          }
        });

        formats.value = { ...formats.value, [tableName]: newFormat };
        db.value.run(
          `CREATE TABLE IF NOT EXISTS '${tableName}'( ${formatDynamic(
            formData,
            withHeader.value
          )} );`
        );

        stepFunction = (row) => {
          Object.keys(row.data).forEach((key) => {
            if (row.data[key].includes(",") && realKeys.includes(key)) {
              row.data[key] = row.data[key]
                .replaceAll(".", "")
                .replace(",", ".");
            } else if (dayKeys.includes(key)) {
              row.data[key] =
                dateParse(
                  row.data[key].trim().replaceAll(/[^a-zA-Z0-9]/g, "_"),
                  "dd_MM_yyyy"
                ) / 1000;
            } else if (monthKeys.includes(key)) {
              row.data[key] =
                dateParse(
                  row.data[key].trim().replaceAll(/[^a-zA-Z0-9]/g, "_"),
                  "MM_dd_yyyy"
                ) / 1000;
            }
          });
          const statement = `
            INSERT INTO '${tableName}' VALUES ( ${Object.keys(formData)
            .map(() => "?")
            .join(", ")} );
          `;
          db.value.run(
            statement,
            Object.keys(formData).map((key) => row.data[key])
          );
        };
      } else {
        const mapping = Object.fromEntries(form.entries());
        const realKeys = [],
          dayKeys = [],
          monthKeys = [];
        columns.forEach((col) => {
          switch (col.type) {
            case "real":
              realKeys.push(mapping[col.name]);
              break;
            case "date [dd-MM-yyyy]":
              dayKeys.push(mapping[col.name]);
              break;
            case "date [MM-dd-yyyy]":
              monthKeys.push(mapping[col.name]);
              break;
            default:
              break;
          }
        });

        db.value.run(
          `CREATE TABLE IF NOT EXISTS '${tabName}'( ${formatColumns(
            columns
          )} );`
        );

        stepFunction = (row) => {
          Object.keys(row.data).forEach((key) => {
            if (row.data[key].includes(",") && realKeys.includes(key)) {
              row.data[key] = row.data[key]
                .replaceAll(".", "")
                .replace(",", ".");
            } else if (dayKeys.includes(key)) {
              row.data[key] =
                dateParse(
                  row.data[key].trim().replaceAll(/[^a-zA-Z0-9]/g, "_"),
                  "dd_MM_yyyy"
                ) / 1000;
            } else if (monthKeys.includes(key)) {
              row.data[key] =
                dateParse(
                  row.data[key].trim().replaceAll(/[^a-zA-Z0-9]/g, "_"),
                  "MM_dd_yyyy"
                ) / 1000;
            }
          });
          const statement = `
            INSERT INTO '${tabName}' VALUES ( ${columns
            .map(() => "?")
            .join(", ")} );
            `;
          db.value.run(
            statement,
            columns.map((col) => row.data[mapping[col.name]])
          );
        };
      }

      parse(file, {
        header: withHeader.value,
        worker: true,
        skipEmptyLines: "greedy",
        step: stepFunction,
        error: function (error) {
          console.error(error);
          setIsImporting(false);
          setSnackContent([
            "error",
            "An Error Occured",
            "A row is skipped due to format error",
          ]);
        },
        complete: function () {
          setLocation("/manage");
          setSnackContent([
            "success",
            "Table Data Imported",
            "Happy exploration! Glad to help",
          ]);
        },
      });
    } catch (error) {
      console.error(error);
      setIsImporting(false);
      setSnackContent([
        "error",
        "An Error Occured",
        "You might miss something on your configuration",
      ]);
    }
  };

  const [focusFormat, setFocusFormat] = useState();

  return (
    <>
      <form
        className='px-6 pb-6 bg-white rounded-lg shadow'
        onSubmit={handleImport}
      >
        <title className='py-3 flex justify-between items-center'>
          <h4 className='text-xl font-semibold text-gray-900 capitalize'>
            Table Format
          </h4>
          <button
            onClick={(event) => {
              event.preventDefault();
              setFocusFormat(null);
              setAddOpen(true);
            }}
            className='inline-flex items-center py-2 px-4 space-x-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          >
            <PlusIcon className='h-5 w-5' aria-hidden='true' />
            <p>Add Format</p>
          </button>
        </title>
        <div className='w-full mb-6'>
          <Tabs
            tabName={tabName}
            setTabName={setTabName}
            setFocusFormat={setFocusFormat}
            setOpen={setAddOpen}
          />
        </div>
        <FormSection tabName={tabName} fields={fields} columns={columns} />
        <button className='py-3 px-6 mt-6 rounded-lg block mx-auto bg-teal-600 text-white'>
          {isImporting ? (
            <ArrowPathIcon className='w-6 h-6 animate-spin mx-3' />
          ) : (
            "Import"
          )}
        </button>
      </form>
      <FormatModal
        open={addOpen}
        setOpen={setAddOpen}
        focusFormat={focusFormat}
      />
    </>
  );
}

export default Mapping;
