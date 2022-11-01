import {
  FolderIcon,
  ChartPieIcon,
  ArrowDownOnSquareIcon,
  ArrowPathRoundedSquareIcon,
} from "@heroicons/react/24/outline";
import { formats } from "../contexts";
import { getPropByString } from "../utils";

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
    },
    {
      name: "dataLimit",
      label: "First Data Limit",
      type: "number",
      step: 25,
    },
    {
      name: "borderColor",
      label: "Border Color",
      type: "color",
    },
    {
      name: "backgroundColor",
      label: "Background Color",
      type: "color",
    },
    {
      name: "options.plugins.annotation.annotations.box1.yMin",
      label: "Annotation Y Min",
      type: "number",
    },
    {
      name: "options.plugins.annotation.annotations.box1.yMax",
      label: "Annotation Y Max",
      type: "number",
    },
    {
      name: "options.plugins.annotation.annotations.box1.label.content",
      label: "Annotation Label",
      type: "text",
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
      name: "yColumn",
      label: "Y Axis Column",
      type: "select",
      options: (tableName) =>
        formats.value[tableName]
          .filter((col) => ["integer", "real"].includes(col.type))
          .map((col) => col.name),
    },
    {
      name: "dataOperator",
      label: "Y Axis Operator",
      type: "select",
      options: () => ["count", "min", "max", "avg", "sum"],
    },
    {
      name: "borderColor",
      label: "Border Color",
      type: "color",
    },
    {
      name: "backgroundColor",
      label: "Background Color",
      type: "color",
    },
    {
      name: "options.plugins.annotation.annotations.box1.yMin",
      label: "Annotation Y Min",
      type: "number",
    },
    {
      name: "options.plugins.annotation.annotations.box1.yMax",
      label: "Annotation Y Max",
      type: "number",
    },
    {
      name: "options.plugins.annotation.annotations.box1.label.content",
      label: "Annotation Label",
      type: "text",
    },
  ],
};
