import classes from "./LoadingCover.module.css";

function LoadingCover() {
  return (
    <div
      className={
        classes.myShimmer + " absolute top-0 left-0 w-full h-full z-10"
      }
    />
  );
}

export default LoadingCover;
