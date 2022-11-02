import {
  FolderIcon,
  ChartPieIcon,
  ArrowDownOnSquareIcon,
  ArrowPathRoundedSquareIcon,
} from "@heroicons/react/24/outline";
import { formats } from "../contexts";

export const navigation = [
  { name: "Import", href: "/", icon: ArrowDownOnSquareIcon },
  { name: "Manage", href: "/manage", icon: FolderIcon },
  {
    name: "Insight",
    href: "/insight",
    icon: ChartPieIcon,
  },
  {
    name: "Compare",
    href: "/compare",
    icon: ArrowPathRoundedSquareIcon,
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
      options: (tableName) =>
        formats.value[tableName]
          .filter((col) => ["integer", "real"].includes(col.type))
          .map((col) => col.name),
    },
    {
      name: "yColumn",
      label: "Y Axis Column",
      type: "select",
      options: (tableName) =>
        formats.value[tableName]
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
      options: (tableName) =>
        formats.value[tableName]
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
      options: (tableName) =>
        formats.value[tableName]
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
