import {
  ArrowDownOnSquareIcon,
  ArrowPathRoundedSquareIcon,
  CommandLineIcon,
  MapIcon,
  ListBulletIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";
import { wrap } from "comlink";

export const rawWorker = new Worker("/sql/db-worker.js");
export const DBWorker = wrap(rawWorker);

export const navigation = [
  { name: "Import", href: "/", icon: ArrowDownOnSquareIcon },
  { name: "Manage", href: "/manage", icon: ListBulletIcon },
  { name: "Map", href: "/map", icon: MapIcon },
  {
    name: "Insight",
    href: "/insight",
    icon: PresentationChartBarIcon,
  },
  {
    name: "Compare",
    href: "/compare",
    icon: ArrowPathRoundedSquareIcon,
  },

  {
    name: "Command",
    href: "/command",
    icon: CommandLineIcon,
  },
];

export const operators = {
  base: [
    {
      sign: "=",
      text: "equals",
    },
    {
      sign: "!=",
      text: "doesn't equal",
    },
    {
      sign: ">",
      text: "greater than",
    },
    {
      sign: "<",
      text: "less than",
    },
    {
      sign: "IS NULL",
      text: "is null",
    },
    {
      sign: "IS NOT NULL",
      text: "is not null",
    },
  ],
  text: [
    {
      sign: "LIKE",
      text: "contains",
    },
    {
      sign: "NOT LIKE",
      text: "doesn't contain",
    },
  ],
  integer: [],
  real: [],
};

export const types = [
  { label: "text", db: "text", input: "text" },
  { label: "integer", db: "integer", input: "number" },
  { label: "real", db: "real", input: "number" },
  { label: "date [MM-dd-yyyy]", db: "integer", input: "date" },
  { label: "date [dd-MM-yyyy]", db: "integer", input: "date" },
  { label: "date [yyyy-MM-dd]", db: "integer", input: "date" },
];

export const getInputType = (appType) => {
  if (appType === "text") {
    return "text";
  } else if (appType.includes("date ")) {
    return "date";
  } else if (["integer", "real"].includes(appType)) {
    return "number";
  }
};

export const getDbType = (appType) => {
  if (["text", "real"].includes(appType)) {
    return appType;
  } else if (appType === "integer" || appType.includes("date ")) {
    return "integer";
  }
};

export const chartForm = {
  line: [
    {
      name: "span",
      label: "Chart Width",
      type: "select",
      options: () => [1, 2, 3, 4, 5, 6],
    },
    {
      name: "dataLimit",
      label: "First Data Limit",
      type: "number",
      step: 25,
    },
    {
      name: "xColumn",
      label: "X Axis Column",
      type: "select",
      options: (columns) =>
        columns
          .filter((col) => ["integer", "real"].includes(col.type))
          .map((col) => col.name),
    },
    {
      name: "yColumn",
      label: "Y Axis Column",
      type: "select",
      options: (columns) =>
        columns
          .filter((col) => ["integer", "real"].includes(col.type))
          .map((col) => col.name),
      section: "data",
    },
    {
      name: "borderColor",
      label: "Border Color",
      type: "color",
      section: "data",
    },
    {
      name: "backgroundColor",
      label: "Background Color",
      type: "color",
      section: "data",
    },
    {
      name: "options.plugins.annotation.annotations.box1.yMin",
      label: "Y Min",
      type: "number",
      section: "annotation",
    },
    {
      name: "options.plugins.annotation.annotations.box1.yMax",
      label: "Y Max",
      type: "number",
      section: "annotation",
    },
    {
      name: "options.plugins.annotation.annotations.box1.label.content",
      label: "Label",
      type: "text",
      section: "annotation",
    },
  ],
  bar: [
    {
      name: "span",
      label: "Chart Width",
      type: "select",
      options: () => [1, 2, 3, 4, 5, 6],
    },
    {
      name: "xColumn",
      label: "X Axis Column (Group By)",
      type: "select",
      options: (columns) =>
        columns
          .filter((col) => ["integer", "text"].includes(col.type))
          .map((col) => col.name),
    },
    {
      name: "dataOperator",
      label: "Y Axis Operator",
      type: "select",
      options: () => ["count", "min", "max", "avg", "sum"],
      section: "data",
    },
    {
      name: "yColumn",
      label: "Y Axis Column",
      type: "select",
      options: (columns) =>
        columns
          .filter((col) => ["integer", "real"].includes(col.type))
          .map((col) => col.name),
      section: "data",
    },
    {
      name: "borderColor",
      label: "Border Color",
      type: "color",
      section: "data",
    },
    {
      name: "backgroundColor",
      label: "Background Color",
      type: "color",
      section: "data",
    },
    {
      name: "options.plugins.annotation.annotations.box1.yMin",
      label: "Y Min",
      type: "number",
      section: "annotation",
    },
    {
      name: "options.plugins.annotation.annotations.box1.yMax",
      label: "Y Max",
      type: "number",
      section: "annotation",
    },
    {
      name: "options.plugins.annotation.annotations.box1.label.content",
      label: "Label",
      type: "text",
      section: "annotation",
    },
  ],
};

export const onBefoleUnload = (event) => {
  event.preventDefault();
  return (event.returnValue =
    "Are you sure you saved your work before leaving?");
};

export const exportStringifiedJson = (filename, string) => {
  const blob = new Blob([string], {
    type: "text/json",
  });
  const link = document.createElement("a");

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove();
};

export async function parseJsonFile(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
}
