import { useState } from "react";
import {
  Button,
  Col,
  Divider,
  Grid,
  Popover,
  Row,
  Slider,
  Stack,
  Toggle,
} from "rsuite";
import "./App.css";
import Chart from "chart.js/auto";

// import zoomPlugin from "chartjs-plugin-zoom";

// Chart.register(zoomPlugin);

import "rsuite/dist/rsuite.min.css";
import { Line } from "react-chartjs-2";
import { useFakeSignalFeed } from "./singal/FakeSingalFeed";


const selectWindow = (data, all, windowsize) => {
  if (all) {
    return data;
  }

  return data.slice(data.length - windowsize, data.length);
};

function App() {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(10);
  const { stop, start, isConnected } = useFakeSignalFeed(0x07, hanldeCallback)

  const sr = 200;
  const ppgs = [];
  const ecgs = [];
  const forces = [];
  const ppgBuffer = [];
  const ecgBuffer = [];
  const forceBuffer = [];

  const hanldeCallback = ({ ppg, ecg, force }) => {
    ppgs.push(ppg)
    ecgs.push(ecg)
    forces.push(force)

    const now = moment();
    ppgBuffer.push({ x: now, y: ppg })
    ecgBuffer.push({ x: now, y: ecg })
    forceBuffer.push({ x: now, y: force })
  }

  const PPGSdata = {
    labels: [0],
    datasets: [
      {
        data: { ...selectWindow(ppgs, !show, sr) }, //ppgs
        label: "PPG",
        borderColor: "#3333ff",
      },
    ],
  };

  const ECGSdata = {
    labels: [0],
    datasets: [
      {
        data: { ...selectWindow(ecgs, !show, sr) }, //ecgs
        label: "ECG",
        borderColor: "#9F288D",
      },
    ],
  };

  const FORCESdata = {
    labels: [0],
    datasets: [
      {
        data: { ...selectWindow(forces, !show, sr) }, //forces
        label: "FORCE",
        borderColor: "#85A434",
      },
    ],
  };

  const options = (newData) => ({
    responsive: false,
    // plugins: {
    //   zoom: {
    //     zoom: {
    //       wheel: {
    //         enabled: true,
    //       },
    //       pinch: {
    //         enabled: true,
    //       },
    //       mode: "xy",
    //     },
    //   },
    // },
    elements: {
      line: {
        tension: 0,
      },
    },
    scales: {
      xAxes: [
        {
          type: "realtime",
          distribution: "linear",
          realtime: {
            onRefresh: function (chart) {
              const data = chart.data.datasets[0].data
              chart.data.datasets[0].data = [...data, ...newData];
            },
            delay: 0,
            time: {
              displayFormat: "ss",
            },
          },
          ticks: {
            displayFormats: 1,
            maxRotation: 0,
            minRotation: 0,
            stepSize: 10,
            minUnit: "second",
            source: "auto",
            autoSkip: true,
            callback: function (value) {
              return moment(value, "HH:mm:ss").format("ss");
            },
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  });

  if (!isConnected) {
    return (
      <div className="container">
        <Popover title="Hekidesk" visible>
          <h4>Turn on your bluetooth!</h4>
          <br />
          <h6>Click on connect and select device.</h6>
        </Popover>
        <Button size="lg" color="violet" appearance="primary" onClick={connect}>
          connect
        </Button>
      </div>
    );
  }

  return (
    <div className="main">
      <Grid fluid>
        <Row gutter={16}>
          <Col xs={12} style={{ marginBottom: "1em" }}>
            Manual start:
            <Toggle
              onChange={() => {
                if (!show) {
                  start();
                  setShow(true);
                } else {
                  stop();
                  setShow(false);
                }
              }}
              size="lg"
              checkedChildren="on"
              unCheckedChildren="off"
            />
          </Col>
          <Col xs={12} style={{ marginBottom: "1em" }}>
            <Button color="violet" appearance="primary" onClick={disconnect}>
              disconnect
            </Button>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={6}>
            <Stack
              spacing={6}
              direction={"column"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Button
                color="green"
                appearance="primary"
                onClick={() => {
                  setTimeout(() => {
                    start();
                  }, 5000);
                  setTimeout(() => {
                    stop();
                  }, count * 1000 + 5000);
                }}
              >
                take sample for {count} seconds
              </Button>
              <h5> start after 5 seconds!</h5>
            </Stack>
          </Col>

          <Col xs={3}>
            <Button
              color="yellow"
              appearance="primary"
              onClick={() => {
              }}
            >
              reset
            </Button>
          </Col>
          <Col xs={3}>
            <Button
              color="red"
              appearance="primary"
              onClick={() => {
                stop();
              }}
            >
              stop
            </Button>
          </Col>
          <Col xs={12}>
            sample time:
            <Slider
              style={{ marginTop: "1em" }}
              onChange={setCount}
              step={5}
              defaultValue={count}
              min={5}
              max={120}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "1em" }}>
          <Col xs={3}>inputs:</Col>
          <Col xs={3}>
            <p>{ppg} ppg</p>
          </Col>
          <Col xs={3}>
            <p>{ecg} ecg</p>
          </Col>
          <Col xs={3}>
            <p>{force} force</p>
          </Col>
          <Col xs={5}>
            <p>{data1.ecg.length} count</p>
          </Col>
        </Row>
      </Grid>
      <Divider>Plots</Divider>
      <Line
        data={PPGSdata}
        options={options(ppgBuffer)}
        height="600px"
        width="3500px"
      />
      <Line
        data={ECGSdata}
        options={options(ecgBuffer)}
        height="600px"
        width="3500px"
      />
      <Line
        data={FORCESdata}
        options={options(forceBuffer)}
        height="600px"
        width="3500px"
      />
      <Divider>Data</Divider>
      <code>{JSON.stringify(data1, null, 2)}</code>
    </div>
  );
}

export default App;
