import { useState, useCallback, useEffect } from "preact/hooks";
import streamSaver from "streamsaver";
import { unparse } from "papaparse";
import { format as dateFormat } from "date-fns";

import { formats } from "../../contexts";
import { useSort } from "../../hooks";
import Actions from "../core/Actions";
import Pagination from "./Pagination";
import DetailModal from "./DetailModal";
import FilterModal from "../core/FilterModal";
import {
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  Bars3Icon,
  DocumentMagnifyingGlassIcon,
  DocumentPlusIcon,
  DocumentArrowUpIcon,
  InboxIcon,
} from "@heroicons/react/20/solid";
import { onBefoleUnload, DBWorker, rawWorker } from "../../constants";
import { filterToString, filterToValues } from "../../utils";

function DbTable({ name, isInFormats, children }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState([]);
  const [focusId, setFocusId] = useState(undefined);
  const [page, setPage] = useState(1);

  const { sortAsc, handleSortClick, sortString } = useSort();

  // Column
  const [columns, setColumns] = useState(
    isInFormats ? formats.value[name] : []
  );
  useEffect(() => {
    if (!isInFormats) {
      DBWorker.pleaseDo({
        id: "browse column",
        action: "exec",
        sql: `PRAGMA table_info('${name}')`,
      }).then((data) => {
        setColumns(
          data.results[0]?.values.map((val) => ({
            name: val[1],
            type: val[2].toLowerCase(),
          }))
        );
      });
    } else {
      setColumns(formats.value[name]);
    }
  }, [name, isInFormats]);

  // Data
  const [data, setData] = useState([]);
  useEffect(() => {
    if (columns.length) {
      const newDateIndeks = [];
      DBWorker.pleaseDo({
        id: "browse row",
        action: "exec",
        sql: `SELECT ${[{ name: "rowid" }, ...columns]
          .map((el, idx) => {
            if (el.type?.includes("date")) {
              newDateIndeks.push(idx);
            }
            return el.name;
          })
          .join(", ")} FROM '${name}' ${filterToString(
          filter
        )} ${sortString} LIMIT 10 OFFSET ${(page - 1) * 10}`,
        params: filterToValues(filter),
      }).then((data) => {
        let toReturn = data.results[0];
        if (toReturn && newDateIndeks.length) {
          toReturn.values = toReturn.values.map((row) => {
            let newRow = [...row];
            newDateIndeks.forEach((indeks) => {
              newRow[indeks] = dateFormat(
                new Date(newRow[indeks] * 1000),
                /\[(.*?)\]/.exec(
                  columns.find((col) => col.name === toReturn.columns[indeks])
                    .type
                )[1]
              );
            });
            return newRow;
          });
        }
        setData(toReturn);
      });
    }
  }, [name, sortString, page, detailOpen, filter, columns]);

  // Count
  const [count, setCount] = useState(0);
  useEffect(() => {
    DBWorker.pleaseDo({
      id: "count row",
      action: "exec",
      sql: `SELECT COUNT(*) FROM '${name}' ${filterToString(filter)}`,
      params: filterToValues(filter),
    }).then((data) => {
      setCount(data.results[0]?.values[0]);
    });
  }, [name, filter, detailOpen]);

  // Export
  const handleExport = useCallback(() => {
    window.removeEventListener("beforeunload", onBefoleUnload);

    const fileStream = streamSaver.createWriteStream(name + ".csv");
    const encoder = new TextEncoder();

    const writerRef = fileStream.getWriter();
    writerRef.write(
      encoder.encode(columns.map((col) => col.name).join(";") + "\r\n")
    );

    rawWorker.onmessage = ({ data }) => {
      if (!data.finished) {
        writerRef.write(
          encoder.encode(
            unparse(
              [
                columns.map(({ name, type }) => {
                  if (type.includes("date")) {
                    return dateFormat(
                      new Date(data.row[name] * 1000),
                      /\[(.*?)\]/.exec(type)[1]
                    );
                  }
                  return data.row[name];
                }),
              ],
              {
                delimiter: ";",
              }
            ) + "\r\n"
          )
        );
      } else {
        writerRef.close();
        window.addEventListener("beforeunload", onBefoleUnload);
      }
    };

    rawWorker.postMessage({
      id: "export table",
      action: "each",
      sql: `SELECT * FROM '${name}' ${filterToString(filter)}`,
      params: filterToValues(filter),
    });
  }, [name, filter]);

  return (
    <section className='my-6 w-full rounded-lg overflow-hidden shadow '>
      <div className='py-3 px-6 bg-white flex justify-between items-center'>
        <div className='flex space-x-3'>
          {children}
          <button
            className='px-3 py-2 inline-flex items-center rounded-md border border-gray-300 bg-white text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            onClick={() => {
              DBWorker.pleaseDo({
                id: "save session",
                action: "export",
              }).then((buffer) => {
                const arraybuff = buffer;
                const blob = new Blob([arraybuff]);
                const a = document.createElement("a");
                document.body.appendChild(a);
                a.href = window.URL.createObjectURL(blob);
                a.download = "sql.db";
                a.onclick = function () {
                  setTimeout(function () {
                    window.URL.revokeObjectURL(a.href);
                  }, 1500);
                };
                a.click();
              });
            }}
          >
            <InboxIcon
              className='mr-2 h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
            <p>Save Session</p>
          </button>
        </div>
        <Actions
          count={filter.length}
          icons={[
            DocumentMagnifyingGlassIcon,
            DocumentPlusIcon,
            DocumentArrowUpIcon,
          ]}
          labels={["Filter", "Add", "Export"]}
          handlers={[
            () => setFilterOpen(true),
            () => {
              setFocusId(undefined);
              setDetailOpen(true);
            },
            handleExport,
          ]}
        />
      </div>
      <div className='overflow-scroll w-full'>
        <table className='min-w-full'>
          <thead className='bg-gray-50 border-b border-gray-300'>
            <tr>
              {data &&
                data.columns &&
                data.columns.length !== 0 &&
                data.columns.map((col) => (
                  <th
                    key={col}
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 first:pl-6 last:pr-6'
                  >
                    <span className='flex w-full justify-between items-center space-x-2'>
                      <h4 className='line-clamp-2 inline'>{col}</h4>
                      <button
                        onClick={() => {
                          handleSortClick(col);
                        }}
                        className={`inline ${
                          sortAsc[col] === undefined
                            ? "text-gray-300"
                            : "text-gray-500"
                        } rounded-full p-2 hover:bg-gray-200`}
                      >
                        {sortAsc[col] === true ? (
                          <BarsArrowDownIcon className='h-5 w-5' />
                        ) : sortAsc[col] === false ? (
                          <BarsArrowUpIcon className='h-5 w-5' />
                        ) : (
                          <Bars3Icon className='h-5 w-5' />
                        )}
                      </button>
                    </span>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody
            className={`bg-white ${false ? "divide-y divide-gray-10" : ""}`}
          >
            {data &&
              data.values &&
              data.values.length !== 0 &&
              data.values.map((row) => (
                <tr
                  onClick={(event) => {
                    event.preventDefault();
                    setFocusId(row[0]);
                    setDetailOpen(true);
                  }}
                  key={row[0]}
                  className='even:bg-gray-50 hover:bg-teal-100 cursor-pointer'
                >
                  {row.map((col, idx) => (
                    <td
                      key={idx}
                      className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 first:pl-6 last:pr-6'
                    >
                      <p className='line-clamp-2'>{col}</p>
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        setPage={setPage}
        maxPage={Math.ceil(count / 10)}
        count={count}
      />
      <DetailModal
        open={detailOpen}
        setOpen={setDetailOpen}
        tableName={name}
        focusId={focusId}
        columns={columns}
      />
      {columns.length ? (
        <FilterModal
          open={filterOpen}
          setOpen={setFilterOpen}
          tableName={name}
          filter={filter}
          setFilter={setFilter}
          columns={columns}
        />
      ) : null}
    </section>
  );
}

export default DbTable;
