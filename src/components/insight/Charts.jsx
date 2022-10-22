import ChartEl from "./ChartEl";
import {
  Chart,
  DoughnutController,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  LineElement,
  Tooltip,
  Legend,
  PolarAreaController,
  RadialLinearScale,
  BarController,
  BarElement,
} from "chart.js";

Chart.register(
  LineController,
  CategoryScale,
  DoughnutController,
  LinearScale,
  PointElement,
  ArcElement,
  LineElement,
  Tooltip,
  Legend,
  PolarAreaController,
  RadialLinearScale,
  BarController,
  BarElement
);

function Charts() {
  return (
    <div className='w-full grid grid-cols-3 pb-6'>
      <ChartEl
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              label: "My First dataset",
              backgroundColor: "rgb(255, 99, 132)",
              borderColor: "rgb(255, 99, 132)",
              data: [0, 10, 5, 2, 20, 30, 45],
            },
          ],
        }}
        config={{
          type: "line",
          options: {},
        }}
      />
      <ChartEl
        data={{
          labels: ["Red", "Blue", "Yellow"],
          datasets: [
            {
              label: "My First Dataset",
              data: [300, 50, 100],
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
              ],
              hoverOffset: 4,
            },
          ],
        }}
        config={{
          type: "doughnut",
        }}
      />
      <ChartEl
        data={{
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
          ],
          datasets: [
            {
              label: "My First Dataset",
              data: [65, 59, 80, 81, 56, 55, 40],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 205, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(201, 203, 207, 0.2)",
              ],
              borderColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)",
              ],
              borderWidth: 1,
            },
          ],
        }}
        config={{
          type: "bar",
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        }}
      />
      <ChartEl
        data={{
          labels: ["Red", "Green", "Yellow", "Grey", "Blue"],
          datasets: [
            {
              label: "My First Dataset",
              data: [11, 16, 7, 3, 14],
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(75, 192, 192)",
                "rgb(255, 205, 86)",
                "rgb(201, 203, 207)",
                "rgb(54, 162, 235)",
              ],
            },
          ],
        }}
        config={{
          type: "polarArea",
          options: {},
        }}
      />
    </div>
  );
}

export default Charts;
