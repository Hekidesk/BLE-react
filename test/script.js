var chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

function randomScalingFactor() {
  return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
}

function onRefresh(chart) {
  chart.config.data.datasets.forEach(function (dataset) {
    dataset.data.push({
      x: new Date().getTime(),
      y: randomScalingFactor(),
    });
  });
}

var color = Chart.helpers.color;
var config = {
  type: "line",
  data: {
    datasets: [
      {
        label: "Dataset 1 (linear interpolation)",
        backgroundColor: color(chartColors.blue).rgbString(),
        borderColor: chartColors.blue,
        fill: false,
        lineTension: 0,
        borderDash: [1, 1],
        data: [],
      },
    ],
  },
  options: {
    title: {
      display: true,
      text: "Line chart (hotizontal scroll) sample",
    },
    scales: {
      xAxes: [
        {
          type: "realtime",
          reverse: true,
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "value",
          },
        },
      ],
    },
    tooltips: {
      mode: "nearest",
      intersect: false,
    },
    hover: {
      mode: "nearest",
      intersect: false,
    },
    plugins: {
      streaming: {
        duration: 30000,
        refresh: 20,
        delay: 0,
        onRefresh: onRefresh,
      },
    },
  },
};

window.onload = function () {
  var ctx = document.getElementById("myChart").getContext("2d");
  window.myChart = new Chart(ctx, config);
};

document.getElementById("randomizeData").addEventListener("click", function () {
  config.data.datasets.forEach(function (dataset) {
    dataset.data.forEach(function (dataObj) {
      dataObj.y = randomScalingFactor();
    });
  });
  window.myChart.update();
});

var colorNames = Object.keys(chartColors);
document.getElementById("addDataset").addEventListener("click", function () {
  var colorName = colorNames[config.data.datasets.length % colorNames.length];
  var newColor = chartColors[colorName];
  var newDataset = {
    label: "Dataset " + (config.data.datasets.length + 1),
    backgroundColor: color(newColor).alpha(0.5).rgbString(),
    borderColor: newColor,
    fill: false,
    lineTension: 0,
    data: [],
  };

  config.data.datasets.push(newDataset);
  window.myChart.update();
});

document.getElementById("removeDataset").addEventListener("click", function () {
  config.data.datasets.pop();
  window.myChart.update();
});

document.getElementById("addData").addEventListener("click", function () {
  onRefresh(window.myChart);
  window.myChart.update();
});
