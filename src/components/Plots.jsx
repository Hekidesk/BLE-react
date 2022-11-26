import { Line } from "react-chartjs-2";

const Plots = ({ data, label, value }) => {
  console.log(data, label, value);
  const plotData = {
    labels: [0],
    datasets: [
      {
        data: { ...[] },
        label: label,
        borderColor: "#A71587",
      },
    ],
  };

  const options = {
    responsive: false,
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      xAxes: [
        {
          type: "realtime",
          distribution: "linear",
          realtime: {
            onRefresh: function (chart) {
              chart.data.datasets[0].data.push({
                x: moment(),
                y: value,
              });
            },
            delay: 5000,
            time: {
              displayFormat: "ss",
            },
          },
          ticks: {
            displayFormats: 1,
            maxRotation: 0,
            minRotation: 0,
            stepSize: 1,
            minUnit: "second",
            source: "auto",
            autoSkip: true,
            callback: function (v) {
              return moment(v, "HH:mm:ss").format("ss");
            },
          },
        },
      ],
      yAxes: [
        [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      ],
    },
  };

  return <Line data={plotData} options={options} height="600px" width="100%" />;
};

export default Plots;
