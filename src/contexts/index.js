import { effect, signal, computed } from "@preact/signals";
import { wrap } from "comlink";

export const rawWorker = signal(new Worker("/sql/db-worker.js"));
export const DBWorker = computed(() => wrap(rawWorker.value));

export const withHeader = signal(true);

export const formats = signal(
  localStorage.getItem("predefined_tables")
    ? JSON.parse(localStorage.getItem("predefined_tables"))
    : {}
);

effect(() =>
  localStorage.setItem("predefined_tables", JSON.stringify(formats.value))
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

export const commandText = signal(`
SELECT 
  * 
FROM 
  sqlite_schema 
WHERE 
  type = 'table' 
  AND name NOT LIKE 'sqlite_%';

PRAGMA table_info('table_name');
`);

export const layerConfigs = signal([]);

export const isSampleData = signal(false);

export const ignoredFields = signal([]);
