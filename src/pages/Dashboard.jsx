import { useErrorBoundary } from "preact/hooks";
import PageError from "../components/core/PageError";
import TableMetric from "../components/dashboard/TableMetric";
import { useSnack } from "../hooks";

function Dashboard() {
  const { setSnackContent } = useSnack();
  const [error, resetError] = useErrorBoundary((error) => {
    console.error(error);
    setSnackContent([
      "error",
      "Unexpected Thing Happened",
      "Don't worry, refresh button is your friend",
    ]);
  });

  if (error) {
    return <PageError resetError={resetError} />;
  } else {
    return (
      <main className='py-6'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>Dashboard</h1>
        </div>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 md:px-8'>
          <TableMetric />
        </div>
      </main>
    );
  }
}

export default Dashboard;
