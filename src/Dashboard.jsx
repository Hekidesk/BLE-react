import { Button, Col, Divider, Grid, Row, Slider, Stack, Toggle } from "rsuite";
import Diagram from "./Diagram";
import React, { useState } from "react";

const selectWindow = (data, all, windowsize) => {
  if (all) {
    return data.slice(200);
  }

  return data.slice(data.length - windowsize, data.length);
};

const size = 200;

export const Dashboard = ({
  device,
  setCharastirctic,
  setDevice,
  charastirctic,
  data1,
  setData1,
  selection,
  resetData,
}) => {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(10);
  const [heartBeat, setHeartBeat] = useState();
  

  const disconnect = () => {
    device.gatt.disconnect();
    setCharastirctic(null);
    setDevice(null);
  };

  let startTime;

  const start = () => {
    startTime = performance.now()
    charastirctic.startNotifications();
  };

  const stop = () => {
    charastirctic.stopNotifications();

    if (selection.ecg) {
      const duration = performance.now() - startTime;
      const heartBeat = HeartBeat(data1['ecg'], Math.round(duration / 1000))
      setHeartBeat(heartBeat)
    }
  };
  return (
    <>
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
                    }, 1000);
                    setTimeout(() => {
                      stop();
                    }, count * 1000 + 1000);
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
                  resetData();
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
            <Col xs={5}>
              <p>
                {data1.ppg.length ?? data1.ecg.length ?? data1.force.length}{" "}
                count
              </p>
            </Col>
          </Row>
        </Grid>
        <Divider>Plots</Divider>
        {selection.ppg && (
          <Diagram
            dataKey={"ppg"}
            flow={selectWindow(data1.ppg, !show, size)}
          />
        )}
        {selection.ecg && (
          <>
            <Diagram
              dataKey={"ecg"}
              flow={selectWindow(data1.ecg, !show, size)}
            />
            <p>{heartBeat}</p>
          </>
        )}
        {selection.force && (
          <Diagram
            dataKey={"force"}
            flow={selectWindow(data1.force, !show, size)}
          />
        )}
        {/* <Divider>Data</Divider>
        <code>{JSON.stringify(data1, null, 2)}</code> */}
      </div>
    </>
  );
};
