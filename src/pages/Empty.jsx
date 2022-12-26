import { useLocation } from "wouter-preact";
import EmptyDb from "../components/core/EmptyDb";
import SampleLoader from "../components/core/SampleLoader";

function Empty() {
  const [location] = useLocation();
  return (
    <main className='py-6'>
      <div className='mx-auto max-w-7xl px-8'>
        <h1 className='text-2xl font-semibold text-gray-900 capitalize'>
          {location.replace("/", "")}
        </h1>
      </div>
      <div className='mx-auto max-w-7xl px-8'>
        <EmptyDb />
        <SampleLoader />
      </div>
    </main>
  );
}

export default Empty;
