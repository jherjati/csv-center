import { useCallback, useState, useMemo } from "preact/hooks";

export const useSort = () => {
  const [sortAsc, setSortAsc] = useState({});
  const handleSortClick = useCallback(
    (columnName) =>
      setSortAsc((prev) => {
        if (prev[columnName] === undefined) {
          return { ...prev, [columnName]: true };
        } else if (prev[columnName] === true) {
          return { ...prev, [columnName]: false };
        } else {
          return { ...prev, [columnName]: undefined };
        }
      }),
    []
  );
  const sortString = useMemo(() => {
    const sortArr = [];
    Object.keys(sortAsc).forEach((key) => {
      if (sortAsc[key] !== undefined) {
        sortArr.push(sortAsc[key] ? key + " ASC" : key + " DESC");
      }
    });
    const sort = sortArr.length ? "ORDER BY " + sortArr.join(", ") : "";
    return sort;
  }, [sortAsc]);

  return { sortAsc, handleSortClick, sortString };
};
