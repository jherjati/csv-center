import { useState, useCallback, useEffect } from "preact/hooks";
import streamSaver from "streamsaver";
import { unparse } from "papaparse";
import { format as dateFormat } from "date-fns";

import { dbWorker, formats } from "../../contexts";
import { useSort } from "../../hooks";
import Actions from "./Actions";
import Pagination from "./Pagination";
import DetailModal from "./DetailModal";
import FilterModal from "./FilterModal";
import {
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  Bars3Icon,
} from "@heroicons/react/20/solid";
import { types } from "../../constants";

const filterToString = (filter) =>
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
const filterToValues = (filter) =>
  filter
    .filter((el) => !["IS NULL", "IS NOT NULL"].includes(el[1]))
    .map((el) =>
      ["LIKE", "NOT LIKE"].includes(el[1]) ? "%" + el[2] + "%" : el[2]
    );

function DbTable({ name, isInFormats }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState([]);
  const [focusId, setFocusId] = useState(undefined);
  const [page, setPage] = useState(1);

  const { sortAsc, handleSortClick, sortString } = useSort();

  // Column
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    if (isInFormats) {
      setColumns(formats.value[name]);
    } else {
      dbWorker.value.onmessage = ({ data }) => {
        setColumns(
          data.results[0]?.values.map((el) => ({
            name: el[1],
            type: el[2].toLowerCase(),
          }))
        );
      };

      dbWorker.value.postMessage({
        id: "browse column",
        action: "exec",
        sql: `PRAGMA table_info('${name}')`,
      });
    }
  }, [name, isInFormats]);

  // Data
  const [data, setData] = useState([]);
  useEffect(() => {
    if (columns.length) {
      const dateIndeks = [];

      dbWorker.value.onmessage = ({ data }) => {
        if (data.id === "browse row") {
          let toReturn = data.results[0];

          if (toReturn && dateIndeks.length) {
            toReturn.values = toReturn.values.map((row) => {
              let newRow = [...row];
              dateIndeks.forEach((indeks) => {
                newRow[indeks] = dateFormat(
                  new Date(newRow[indeks] * 1000),
                  "yyyy-MM-dd"
                );
              });
              return newRow;
            });
          }

          setData(toReturn);
        }
      };

      dbWorker.value.postMessage({
        id: "browse row",
        action: "exec",
        sql: `SELECT ${[{ name: "rowid" }, ...columns]
          .map((el, idx) => {
            if (
              types
                .filter((ty) => ty.input === "date")
                .map((ty) => ty.label)
                .includes(el.type)
            ) {
              dateIndeks.push(idx);
            }
            return el.name;
          })
          .join(", ")} FROM '${name}' ${filterToString(
          filter
        )} ${sortString} LIMIT 10 OFFSET ${(page - 1) * 10}`,
        params: filterToValues(filter),
      });
    }
  }, [sortString, page, detailOpen, filter, columns]);

  // Count
  const [count, setCount] = useState(0);
  useEffect(() => {
    dbWorker.value.onmessage = ({ data }) => {
      if (data.id === "count row") setCount(data.results[0]?.values[0]);
    };

    dbWorker.value.postMessage({
      id: "count row",
      action: "exec",
      sql: `SELECT COUNT(*) FROM '${name}' ${filterToString(filter)}`,
      params: filterToValues(filter),
    });
  }, [filter, detailOpen]);

  const handleExport = useCallback(() => {
    const fileStream = streamSaver.createWriteStream(name + ".csv");
    const writer = fileStream.getWriter();
    const encoder = new TextEncoder();
    writer.write(
      encoder.encode(columns.map((col) => col.name).join(";") + "\r\n")
    );

    dbWorker.value.onmessage = ({ data }) => {
      console.log(data);
      if (data.finished) {
        writer.close();
      } else {
        writer.write(
          encoder.encode(
            unparse([columns.map((col) => data.row[col.name])], {
              delimiter: ";",
            }) + "\r\n"
          )
        );
      }
    };

    dbWorker.value.postMessage({
      id: "download table",
      action: "each",
      sql: `SELECT * FROM '${name}' ${filterToString(filter)}`,
      params: filterToValues(filter),
    });
  }, [filter]);

  return (
    <section className='my-6 w-full rounded-lg overflow-hidden shadow'>
      <div className='py-3 px-6 bg-white flex justify-between items-center'>
        <h5 className='text-xl font-semibold text-gray-900 capitalize'>
          {name}
        </h5>
        <Actions
          setDetailOpen={setDetailOpen}
          setFilterOpen={setFilterOpen}
          setFocusId={setFocusId}
          handleExport={handleExport}
          filterCount={filter.length}
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
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900 first:pl-4 first:sm:pl-6 last:pr-4 last:sm:pr-6'
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
                      className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 first:pl-4 first:sm:pl-6 last:pr-4 last:sm:pr-6'
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
      {/* <DetailModal
        open={detailOpen}
        setOpen={setDetailOpen}
        tableName={name}
        focusId={focusId}
        columns={columns}
      />
      <FilterModal
        open={filterOpen}
        setOpen={setFilterOpen}
        tableName={name}
        filter={filter}
        setFilter={setFilter}
        columns={columns}
      /> */}
    </section>
  );
}

export default DbTable;
