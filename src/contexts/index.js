import { signal } from "@preact/signals";

export const withHeader = signal(true);

export const formats = signal(
  localStorage.getItem("predefined_tables")
    ? JSON.parse(localStorage.getItem("predefined_tables"))
    : {}
);

export const snackbar = signal({
  visible: false,
  content: [
    "success",
    "Successfully saved!",
    "Anyone with a link can now view this file.",
  ],
});

export const metricConfigs = signal({});

export const chartConfig = signal([["options.scales.x.title.text", null]]);

export const dataConfigs = signal([
  {
    id: window.crypto.randomUUID(),
    tableName: null,
    xColumn: null,
    yColumn: null,
    limit: 250,
    backgroundColor: null,
    borderColor: null,
  },
]);
