import { signal } from "@preact/signals";

export const db = signal();
export const dbWorker = signal(new Worker("/sql/worker.sql-wasm.js"));

export const formats = signal(
  localStorage.getItem("predefined_tables")
    ? JSON.parse(localStorage.getItem("predefined_tables"))
    : {}
);

export const withHeader = signal(true);

export const snackbar = signal({
  visible: false,
  content: [
    "success",
    "Successfully saved!",
    "Anyone with a link can now view this file.",
  ],
});
