import { useErrorBoundary } from "preact/hooks";
import { setSnackContent } from "../../utils";
import PageError from "./PageError";

function PageHOC({ children }) {
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
    return children;
  }
}

export default PageHOC;
