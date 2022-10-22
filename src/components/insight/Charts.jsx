import ChartItem from "./ChartItem";

function Charts() {
  return (
    <div className='w-full grid grid-cols-6 pb-6'>
      <ChartItem
        config={{
          type: "bar",
          colors: ["purple"],
          axisOptions: {
            xAxisMode: "tick",
            xIsSeries: true,
          },
          barOptions: {
            stacked: true,
            spaceRatio: 0.5,
          },
          valuesOverPoints: 1,
        }}
        data={{
          labels: [
            "12am-3am",
            "3am-6am",
            "6am-9am",
            "9am-12pm",
            "12pm-3pm",
            "3pm-6pm",
            "6pm-9pm",
            "9pm-12am",
          ],

          datasets: [
            {
              values: [25, 40, 30, 35, 8, 52, 17, -4],
            },
          ],
        }}
        span={6}
      />

      <ChartItem
        config={{
          type: "percentage",
          valuesOverPoints: 1,
        }}
        data={{
          labels: [
            "12am-3am",
            "3am-6am",
            "6am-9am",
            "9am-12pm",
            "12pm-3pm",
            "3pm-6pm",
            "6pm-9pm",
            "9pm-12am",
          ],
          datasets: [
            {
              values: [25, 40, 30, 35, 8, 52, 17, -4],
            },
          ],
        }}
        span={6}
      />

      <ChartItem
        config={{
          type: "line",
          colors: ["green"],
          lineOptions: {
            dotSize: 1.25,
            regionFill: 1, // default: 1
          },
          valuesOverPoints: 1,
        }}
        data={{
          labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [{ values: [18, 40, 30, 35, 8, 52, 17, -4] }],
        }}
        span={6}
      />
    </div>
  );
}

export default Charts;
