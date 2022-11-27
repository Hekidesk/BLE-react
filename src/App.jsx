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

import "rsuite/dist/rsuite.min.css";
import { Line } from "react-chartjs-2";

const ServiceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const ReadCharistristicUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const WriteCharistristicUUID = "e505ffd3-ecd5-4365-b57d-70202ab71692";

const selectWindow = (data, all, windowsize) => {
  if (all) {
    return data;
  }

  return data.slice(data.length - windowsize, data.length);
};

function App() {
  const [charastirctic, setCharastirctic] = useState();
  const [device, setDevice] = useState();

  const [show, setShow] = useState(false);
  const [count, setCount] = useState(10);

  const [ppg, setPpg] = useState();
  const [ecg, setEcg] = useState();
  const [force, setForce] = useState();
  const [data1, setData1] = useState({
    ppg: [],
    ecg: [],
    force: [],
  });

  const ppgs = [];
  const ecgs = [];
  const forces = [];

  function Bytes2Float16(bytes) {
    let sign = bytes & 0x8000 ? -1 : 1;
    let exponent = ((bytes >> 10) & 0x1f) - 15;
    let significand = bytes & ~(-1 << 10);

    if (exponent == 16)
      return sign * (significand ? Number.NaN : Number.POSITIVE_INFINITY);

    if (exponent == -15) {
      if (significand == 0) return sign * 0.0;
      exponent = -14;
      significand /= 1 << 9;
    } else significand = (significand | (1 << 10)) / (1 << 10);

    return sign * significand * Math.pow(2, exponent);
  }

  function connect() {
    navigator.bluetooth
      .requestDevice({
        optionalServices: [ServiceUUID],
        filters: [{ name: "ECG-PPG-Server" }],
      })
      .then((device) => {
        setDevice(device);
        device.gatt.connect().then((gatt) => {
          gatt.getPrimaryService(ServiceUUID).then((service) => {
            service
              .getCharacteristic(WriteCharistristicUUID)
              .then((char) => {
                return char.writeValue(0x8f); //auth
              })
              .then(() => {
                return service
                  .getCharacteristic(WriteCharistristicUUID)
                  .then((char2) => {
                    return char2.writeValue(0x07); //send 3 data
                  });
              })
              .then((_) => {
                service
                  .getCharacteristic(ReadCharistristicUUID)
                  .then((charastirctic) => {
                    setCharastirctic(charastirctic);

                    charastirctic.oncharacteristicvaluechanged = (data) => {
                      setPpg(data.srcElement.value.getUint16(0, true));
                      ppgs.push(data.srcElement.value.getUint16(0, true));

                      setEcg(data.srcElement.value.getInt16(2, true));
                      ecgs.push(data.srcElement.value.getInt16(2, true));

                      setForce(
                        Bytes2Float16(data.srcElement.value.getUint16(4, true))
                      );
                      forces.push(
                        Bytes2Float16(data.srcElement.value.getUint16(4, true))
                      );
                      setData1({
                        ppg: ppgs,
                        ecg: ecgs,
                        force: forces,
                      });
                    };
                  });
              });
          });
        });
      });
  }

  const disconnect = () => {
    device.gatt.disconnect();
    setCharastirctic(null);
    setDevice(null);
  };

  const start = () => {
    charastirctic.startNotifications();
  };

  const stop = () => {
    charastirctic.stopNotifications();
  };

  const sr = 200;

  const PPGSdata = {
    labels: [0],
    datasets: [
      {
        data: { ...selectWindow(data1.ppg, !show, sr) }, //ppgs
        label: "PPG",
        borderColor: "#3333ff",
      },
    ],
  };

  const ECGSdata = {
    labels: [0],
    datasets: [
      {
        data: { ...selectWindow(data1.ecg, !show, sr) }, //ecgs
        label: "ECG",
        borderColor: "#9F288D",
      },
    ],
  };

  const FORCESdata = {
    labels: [0],
    datasets: [
      {
        data: { ...selectWindow(data1.force, !show, sr) }, //forces
        label: "FORCE",
        borderColor: "#85A434",
      },
    ],
  };

  const options = (y) => ({
    responsive: true,
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
              chart.data.datasets[0].data.push({
                x: moment(),
                y: y,
              });
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
            stepSize: 1000,
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

  if (!charastirctic) {
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
                setData1({ ppg: [], ecg: [], force: [] });
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
          <Col xs={5}>
            <p>{force} force</p>
          </Col>
        </Row>
      </Grid>
      <Divider>Plots</Divider>
      <Line
        data={PPGSdata}
        options={options(ppg)}
        height="400px"
        width="3000px"
      />
      <Line
        data={ECGSdata}
        options={options(ecg)}
        height="400px"
        width="3000px"
      />
      <Line
        data={FORCESdata}
        options={options(force)}
        height="400px"
        width="3000px"
      />
      <Divider>Data</Divider>
      <code>{JSON.stringify(data1, null, 2)}</code>
    </div>
  );
}

export default App;
