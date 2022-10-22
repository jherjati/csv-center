import Charts from "./Charts";
import Stats from "./Stats";

function TableMetric() {
  return (
    <section className='bg-white shadow rounded-lg divide-y my-6 pb-6'>
      <h5 className='text-xl font-semibold text-gray-900 capitalize py-3 px-6'>
        EM120
      </h5>
      <Stats />
      <Charts />
      <hr />
    </section>
  );
}

export default TableMetric;
