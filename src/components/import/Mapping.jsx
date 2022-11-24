import { formats, withHeader } from "../../contexts";
import { useLocation } from "wouter-preact";
import { parse } from "papaparse";
import { parse as dateParse } from "date-fns";
import { useState, useMemo, useCallback } from "preact/hooks";
import {
  ArrowDownCircleIcon,
  ArrowPathIcon,
  ArrowUpCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import Tabs from "./Tabs";
import FormatModal from "./FormatModal";
import FormSection from "./FormSection";
import { exportStringifiedJson, parseJsonFile, types, DBWorker } from "../../constants";
import {
  dbNameEscaper,
  formatColumns,
  formatDynamic,
  realTransformer,
  setSnackContent,
  symbolReplacer,
} from "../../utils";
import Actions from "../core/Actions";

function Mapping({ fields, file, tabName, setTabName }) {
  const [_, setLocation] = useLocation();

  const columns = useMemo(
    () => (tabName === "Dynamic" ? [] : formats.value[tabName]),
    [tabName, formats.value]
  );
  const [addOpen, setAddOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (event) => {
    event.preventDefault();
    try {
      setIsImporting(true);
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
          DBWorker
            .pleaseDo({
              id: "insert row",
              action: "exec",
              sql: statement,
              params: Object.keys(formData).map((key) => row.data[key]),
            })
            .then(() => parser.resume());
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
          DBWorker
            .pleaseDo({
              id: "insert row",
              action: "exec",
              sql: statement,
              params: columns.map((col) => row.data[mapping[col.name]]),
            })
            .then(() => parser.resume());
        };
      }

      parse(file, {
        header: withHeader.value,
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
          DBWorker
            .pleaseDo({
              id: "check complete",
              action: "exec",
              sql: `PRAGMA main.quick_check('${tableName}')`,
            })
            .then((data) => {
              setSnackContent([
                "success",
                tableName + " Table Checked",
                data.error
                  ? "Something missed, maybe not needed, keep going!"
                  : "All is well, happy exploration!",
              ]);
              setLocation("/manage");
            });
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

  const openNewFormat = (event) => {
    event.preventDefault();
    setFocusFormat(null);
    setAddOpen(true);
  };

  const importFormat = useCallback(() => {
    try {
      let input = document.createElement("input");
      input.type = "file";
      input.setAttribute("accept", "application/json");
      input.onchange = async (event) => {
        const importedFormats = await parseJsonFile(event.target.files[0]);
        const newFormats = { ...formats.value };
        Object.keys(importedFormats).forEach(
          (key) => (newFormats[key] = importedFormats[key])
        );
        localStorage.setItem("predefined_tables", JSON.stringify(newFormats));
        formats.value = newFormats;
      };
      input.click();
    } catch (error) {}
  }, [formats.value]);

  const exportFormat = useCallback(() => {
    try {
      exportStringifiedJson(
        "csv_formats.json",
        localStorage.getItem("predefined_tables")
      );
    } catch (error) {}
  }, []);

  return (
    <>
      <form
        style={{ animation: "forwards fadein2 1.6s" }}
        className='mt-6 px-6 pb-6 bg-white rounded-lg shadow'
        onSubmit={handleImport}
      >
        <title className='py-3 flex justify-between items-center'>
          <h4 className='text-xl font-semibold text-gray-900 capitalize'>
            Table Format
          </h4>

          <Actions
            icons={[PlusCircleIcon, ArrowDownCircleIcon, ArrowUpCircleIcon]}
            labels={["Add", "Import", "Export"]}
            handlers={[openNewFormat, importFormat, exportFormat]}
          />
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
        tabName={tabName}
        setTabName={setTabName}
      />
    </>
  );
}

export default Mapping;
