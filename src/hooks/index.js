import { useCallback, useState, useMemo, useEffect } from "preact/hooks";
import { onBefoleUnload } from "../constants";
import { DBWorker } from "../contexts";

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

export const useInitDB = () => {
  useEffect(() => {
    window.addEventListener("beforeunload", onBefoleUnload);
    DBWorker.value
      .pleaseDo({
        action: "open",
      })
      .catch(console.error);
    return () => {
      DBWorker.value.pleaseDo({ action: "close" });
    };
  }, []);
};

export const useTables = () => {
  const [dbTables, setDbTables] = useState();
  useEffect(() => {
    DBWorker.value
      .pleaseDo({
        id: "browse table",
        action: "exec",
        sql: `SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';`,
      })
      .then((data) => {
        if (data.results)
          setDbTables(data.results[0]?.values?.map((el) => el[0]));
      })
      .catch(console.error);
  }, []);

  return { dbTables };
};
