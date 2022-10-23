import { snackbar } from "../contexts";

export function paginate(page, maxPage) {
  if ([1, 2, maxPage - 1, maxPage].includes(page))
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
