import { useCallback, useState, useMemo, useEffect } from "preact/hooks";
import { dbWorker } from "../contexts";

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
    try {
      window.addEventListener("beforeunload", (event) => {
        event.preventDefault();
        return (event.returnValue =
          "Are you sure you saved your work before leaving?");
      });
      dbWorker.value.onerror = (error) => {
        console.error(error);
      };
      dbWorker.value.postMessage({ action: "open" });
    } catch (err) {
      console.error(err);
    }
    return () => {
      dbWorker.value.postMessage({ action: "close" });
    };
  }, []);
};

export const useTables = () => {
  const [dbTables, setDbTables] = useState();
  useEffect(() => {
    dbWorker.value.onmessage = ({ data }) => {
      setDbTables(data.results[0]?.values);
    };
    dbWorker.value.postMessage({
      id: "browse table",
      action: "exec",
      sql: `SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';`,
    });
  }, []);

  return { dbTables };
};
