import {
  FolderIcon,
  ChartPieIcon,
  ArrowDownOnSquareIcon,
  ArrowPathRoundedSquareIcon,
} from "@heroicons/react/24/outline";

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
