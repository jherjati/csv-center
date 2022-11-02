import { types } from "../constants";
import { snackbar } from "../contexts";

export function paginate(page, maxPage) {
  if (maxPage <= 7) {
    return [1,2,3,4,5,6,7]
  } else if ([1, 2, maxPage - 1, maxPage].includes(page))
    return [1, 2, 3, 0, maxPage - 2, maxPage - 1, maxPage];
  else if ([3, 4].includes(page)) return [1, 0, 3, 4, 5, 0, maxPage];
  else if ([maxPage - 3, maxPage - 2].includes(page))
    return [1, 0, maxPage - 4, maxPage - 3, maxPage - 2, 0, maxPage];
  else return [1, 0, page - 1, page, page + 1, 0, maxPage];
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const doesContainSymbol = (inputString) =>
  /[^a-zA-Z0-9_]/.test(inputString);

export const realTransformer = (inputString) =>
  inputString.replaceAll(".", "").replace(",", ".");

export const symbolReplacer = (inputString) =>
  inputString.trim().replaceAll(/[^a-zA-Z0-9]/g, "_");

export const dbNameEscaper = (inputString) => {
  let toReturn = symbolReplacer(inputString)
    .toLowerCase()
    .replaceAll("__", "_");
  return toReturn.slice(-1) === "_" ? toReturn.slice(0, -1) : toReturn;
};

export const openSnack = () => {
  snackbar.value = { ...snackbar.value, visible: true };
  setTimeout(() => {
    snackbar.value = { ...snackbar.value, visible: false };
  }, 3000);
};

export const closeSnack = () =>
  (snackbar.value = { ...snackbar.value, visible: false });

export const setSnackContent = (newContent) => {
  snackbar.value = { content: newContent, visible: true };
  setTimeout(() => {
    snackbar.value = { ...snackbar.value, visible: false };
  }, 3000);
};

export const filterToString = (filter) =>
  filter.length
    ? "WHERE " +
      filter
        .map((el) =>
          [
            el[0],
            el[1],
            ["IS NULL", "IS NOT NULL"].includes(el[1]) ? "" : "?",
          ].join(" ")
        )
        .join(" AND ")
    : "";

export const filterToValues = (filter) =>
  filter
    .filter((el) => !["IS NULL", "IS NOT NULL"].includes(el[1]))
    .map((el) =>
      ["LIKE", "NOT LIKE"].includes(el[1]) ? "%" + el[2] + "%" : el[2]
    );

export function getPropByString(obj, str) {
  try {
    const path = str.split(".");
    let toReturn = { ...obj };
    path.forEach((key) => {
      toReturn = toReturn[key];
    });
    return toReturn;
  } catch (_) {}
}

export function setPropByString(obj = {}, str, val) {
  const keys = str.split(".");
  const last = keys.pop();
  keys.reduce((o, k) => (o[k] ??= {}), obj)[last] = val;
}

export const formatColumns = (columns) =>
  columns
    .map((el) => {
      return (
        dbNameEscaper(el.name) +
        " " +
        types.find((type) => type.label === el.type).db
      );
    })
    .join(", ");

export const formatDynamic = (data, withHeader) =>
  Object.keys(data)
    .map((key) => {
      let columnName = "column_" + key;
      if (withHeader) {
        columnName = dbNameEscaper(key);
      }
      return (
        columnName + " " + types.find((type) => type.label === data[key]).db
      );
    })
    .join(", ");
