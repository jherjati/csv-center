import UserFeedback from "../components/guide/UserFeedback";

function Guide() {
  return (
    <main className='py-6'>
      <div className='mx-auto max-w-7xl px-8'>
        <h1 className='text-2xl font-semibold text-gray-900'>Guide</h1>
      </div>
      <div className='w-full px-6 mt-4 flex'>
        <article className='prose bg-white rounded-lg p-6 shadow'>
          <h3>User Guide (Alpha Release)</h3>
          <p>
            Hi there! Welcome to the CSV center. Our mission is to make working
            with CSV files a breeze. We use SQLite and web assembly to create an
            in-browser database, your data privacy and security is our number 1
            priority. CSV center is built as a progressive web app and is
            designed to be an offline-first app, so you don't need to worry
            about an internet connection after your first visit. Currently, only
            the <strong>map page</strong>, <strong>bug report</strong> , and{" "}
            <strong>feature request</strong> require an internet connection. All
            other features, such as importing, managing, and pulling insights,
            are fully offline, as well as the ability to write custom SQL
            commands. We hope you enjoy using CSV center!
          </p>
          <ol>
            <li>
              <p>Importing </p>
              <p>
                On import page you can import your csv file or easily load your
                previous session. Session file will have .db format since it is
                actually sqlite db file. As for importing csv file, simply drag
                and drop or click the input area, you can then choose csv file
                from your file system. The parsing functionality is heavily rely
                on papaparse. We can support all papaparse config, but for now
                “with header” is the only one we think needed to support. After
                you choose your file you will need to map/match your data format
                with later db table format. In general, we provides (via SQLite)
                3 data types ;
              </p>
            </li>
            <ul>
              <li>
                <strong>Text</strong> : use it as default, safe to choose yet
                can’t be used as line chart x or y axis and other limitations
                such as unexpected number sorting.
              </li>
              <li>
                <strong>Integer</strong> : use it for number that can be written
                without a fractional component, including zero, positive, and
                negative.
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
              scene since SQLite doesn’t support it natively. As an info, hyphen
              symbol (-) in date format at the date options is actually
              placeholder symbol, your column format can use any symbol, it will
              be recognized, but it must match the format order.
            </p>

            <li>Managing</li>

            <p>
              On manage page you can do BREAD operations. BREAD stands for
              Browse, Read, Edit, Add, and Delete. Browse is facilitated via
              table view. Read, Edit, and Delete can be accomplished after you
              click the row and prompted with detailed view. Add is accommodated
              via add button at the top right action buttons. On this page you
              can also find export button, save session button, and filter
              functionality. Notice that we try our best to match filter
              operator and value type with your column type. Currently all
              filter criteria will be joined by AND logical operator. We are
              working on advance filter where you can customize “AND block” and
              “OR block” as needed.
            </p>

            <li>Map Viewing</li>

            <p>
              On map page you can observe your (spatial) data on the map. If you
              have data with longitude and latitude columns, congratulations!
              all you have to do is click the add layer button and make the
              necessary configurations. You will see your data will be displayed
              as points on the map. As usual, you can do BREAD operation to your
              layer configuration, we try our best to optimize the visualisation
              process.
            </p>

            <li>Pulling Insight</li>

            <p>
              On insight page you can pull statistic data and draw chart based
              on your custom configuration. You can then export it to pdf either
              to download or print it later. The charting functionality is
              heavily rely on chartjs. Currently we accommodate these chart
              types :{" "}
            </p>
            <ul>
              <li>
                <p>
                  <strong>Line</strong> chart, good for continuous data, integer
                  or real. Support multiline chart.
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

            <li>Comparing</li>

            <p>
              On the comparison page, you can compare values from two or more
              datasets. You just have to choose which data will be used as the
              graphical visualization data source. You need to specify where the
              X and Y values come from via Column X and Column Y dropdowns. The
              color of the graphs can also be changed so that you can easily
              differentiate data graph visualizations from one another. When all
              config meet your need, just press the apply button and the data
              graph visualization will be drawn according to the settings you
              have made.
            </p>

            <li>Running SQLite Command</li>

            <p>
              On command page, you can run your raw sql query, do with your own
              risk though. You can do anything to your data here, mainly we used
              it for data wrangling and some join operation. In the meantime,
              you can save query result as new db table.
            </p>
          </ol>
          <p>Enjoy diving into your data and discovering new insights !</p>
        </article>
        <UserFeedback />
      </div>
    </main>
  );
}

export default Guide;
