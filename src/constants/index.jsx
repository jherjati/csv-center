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
    name: "Dashboard",
    href: "/dashboard",
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
