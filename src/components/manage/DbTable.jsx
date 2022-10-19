import { useMemo, useState, useCallback } from "preact/hooks";
import streamSaver from "streamsaver";
import { unparse } from "papaparse";

import { db } from "../../contexts";
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

const filterToString = (filter) =>
  filter.length
    ? "WHERE " + filter.map((el) => [el[0], el[1], "?"].join(" ")).join(" AND ")
    : "";

function DbTable({ name }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState([]);
  const [focusId, setFocusId] = useState(undefined);
  const [page, setPage] = useState(1);

  const { sortAsc, handleSortClick, sortString } = useSort();

  const columns = useMemo(
    () =>
      db.value
        .exec(`PRAGMA table_info('${name}')`)[0]
        .values.map((el) => ({ name: el[1], type: el[2].toLowerCase() })),
    [name]
  );

  const data = useMemo(
    () =>
      db.value.exec(
        `SELECT rowid, ${columns
          .map((el) => el.name)
          .join(", ")} FROM '${name}' ${filterToString(
          filter
        )} ${sortString} LIMIT 10 OFFSET ${(page - 1) * 10}`,
        filter.map((el) =>
          ["LIKE", "NOT LIKE"].includes(el[1]) ? "%" + el[2] + "%" : el[2]
        )
      )[0],
    [sortString, page, detailOpen, filter]
  );

  const [
    {
      values: [[count]],
    },
  ] = useMemo(
    () =>
      db.value
        ? db.value.exec(
            `SELECT COUNT(*) FROM '${name}' ${filterToString(filter)}`,
            filter.map((el) =>
              ["LIKE", "NOT LIKE"].includes(el[1]) ? "%" + el[2] + "%" : el[2]
            )
          )
        : [{ values: [[0]] }],
    [db.value, filter, detailOpen]
  );

  const handleExport = useCallback(() => {
    const fileStream = streamSaver.createWriteStream(name + ".csv");
    const writer = fileStream.getWriter();
    const encoder = new TextEncoder();
    writer.write(
      encoder.encode(columns.map((col) => col.name).join(";") + "\r\n")
    );

    db.value.each(
      `SELECT * FROM '${name}' ${filterToString(filter)}`,
      filter.map((el) =>
        ["LIKE", "NOT LIKE"].includes(el[1]) ? "%" + el[2] + "%" : el[2]
      ),
      function (row) {
        writer.write(
          encoder.encode(
            unparse([columns.map((col) => row[col.name])], {
              delimiter: ";",
            }) + "\r\n"
          )
        );
      }
    );

    writer.close();
  }, [filter]);

  return (
    <section className='my-6 w-full rounded-lg overflow-hidden shadow'>
      <div className='py-3 px-6 bg-white flex justify-between items-center'>
        <h5 className='text-xl font-semibold text-gray-900 capitalize'>
          {name}
        </h5>
        <Actions
          tableName={name}
          setDetailOpen={setDetailOpen}
          setFilterOpen={setFilterOpen}
          setFocusId={setFocusId}
          handleExport={handleExport}
          filterCount={filter.length}
          columns={columns}
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
      <DetailModal
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
      />
    </section>
  );
}

export default DbTable;
