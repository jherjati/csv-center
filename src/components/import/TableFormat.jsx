import { useState, useCallback } from "preact/hooks";
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";

import FormatTabs from "./FormatTabs";
import Actions from "../core/Actions";
import FormatModal from "./FormatModal";
import FormatForm from "./FormatForm";

import { formats } from "../../contexts";
import { exportStringifiedJson, parseJsonFile } from "../../constants";

function TableFormat({ fields, file, tabName, setTabName }) {
  const [isModal, setIsModal] = useState(false);
  const [focusFormat, setFocusFormat] = useState();

  const openNewFormat = useCallback((event) => {
    event.preventDefault();
    setFocusFormat(null);
    setIsModal(true);
  }, []);

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
    <div
      style={{ animation: "forwards fadein2 1.6s" }}
      className='mt-6 px-6 pb-6 bg-white rounded-lg shadow'
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

      <FormatTabs
        tabName={tabName}
        setTabName={setTabName}
        setFocusFormat={setFocusFormat}
        setOpen={setIsModal}
      />

      <FormatForm tabName={tabName} fields={fields} file={file} />
      <FormatModal
        open={isModal}
        setOpen={setIsModal}
        focusFormat={focusFormat}
        tabName={tabName}
        setTabName={setTabName}
      />
    </div>
  );
}

export default TableFormat;
