function Guidance() {
  return (
    <main className='py-6'>
      <div className='mx-auto px-8 text-2xl text-center font-semibold text-gray-900'>
        Guidance
      </div>
      <div className='mx-auto px-4 sm:px-6 md:px-8'>
        <div className='py-4 w-full'>
          <article className='prose mx-auto'>
            <p>
              Hey folks, welcome to CSV center! We are in a mission to make
              working with CSV file such a breeze. Under the hood, we leverage
              SQLite as in-browser database via web assembly. Built from ground
              up as a progressive web application, CSV center is supposed to be
              offline first app so you don’t need to worry about internet
              connection after the very first visit. Currently only bug report
              and feature request need internet connection. Apart from that, our
              main workflow is fully offline, that is import, manage, pull
              insight, and in some case write custom command.
            </p>
            <ol>
              <li>
                <p>Importing </p>
                <p>
                  On import page you can import your csv file or easily load
                  your previous session. Session file will have .db format since
                  it is actually sqlite db file. As for importing csv file,
                  simply drag and drop or click the input area, you can then
                  choose csv file from your file system. The parsing
                  functionality is heavily rely on papaparse. We can support all
                  papaparse config, but for now “with header” is the only one we
                  think needed to support. After you choose your file you will
                  need to map/match your data format with later db table format.
                  In general, we provides (via SQLite) 3 data types ;
                </p>
              </li>
              <ul>
                <li>
                  <strong>Text</strong> : use it as default, safe to choose yet
                  can’t be used as line chart x or y axis and other limitations
                  such as unexpected number sorting.
                </li>
                <li>
                  <strong>Integer</strong> : use it for number that can be
                  written without a fractional component, including zero,
                  positive, and negative.
                </li>
                <li>
                  <p>
                    <strong>Real</strong> : use it for real or float number,
                    number that needs decimal value or has fractional component.
                  </p>
                </li>
              </ul>
              <p>
                Other that that, we also provide additional data type like{" "}
                <strong>date</strong>, parsed as UNIX epoch integer behind the
                scene since SQLite doesn’t support it natively. As an info,
                hyphen symbol (-) in date format at the date options is actually
                placeholder symbol, your column format can use any symbol, it
                will be recognized, but it must match the format order.
              </p>

              <li>Managing</li>

              <p>
                On manage page you can do BREAD operations. BREAD stand for
                Browse, Read, Edit, Add, and Delete. Browse is facilitated via
                table view. Read, Edit, and Delete can be accomplished after you
                click the row and prompted with detailed view. Add is
                accommodated via add button at the top right action buttons. On
                this page you can also find export button, save session button,
                and filter functionality. Notice that we try our best to match
                filter operator and value type with your column type. Currently
                all filter criteria will be joined by AND logical operator. We
                are working on advance filter while you can custom “AND block”
                and “OR block” as needed.
              </p>

              <li>Pulling Insight</li>

              <p>
                On insight page you can pull statistic data and draw chart based
                on your custom configuration. You can then export it to pdf
                either to download or print it later. The charting functionality
                is heavily rely on chartjs. Currently we accommodate these chart
                types :{" "}
              </p>
              <ul>
                <li>
                  <p>
                    <strong>Line</strong> chart, good for continuous data,
                    integer or real. Support multiline chart.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Bar</strong> chart, good for aggregate data, x axis
                    (usually label) could be either integer or text.
                  </p>
                </li>
              </ul>
              <p>
                <strong>Pie</strong> chart and othert type support will come in
                the future. We are working on multi chart support now. In
                addition, you can also add annotation to your chart if needed.
              </p>

              <li>Run SQL Command</li>

              <p>
                On command page, you can run your raw sql query, do with your
                own risk though. You can do anything to your data here, mainly
                we used it for data wrangling and some join operation. In the
                meantime, you can save query result as new db table.
              </p>
            </ol>
          </article>
        </div>
      </div>
    </main>
  );
}

export default Guidance;
