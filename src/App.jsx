import "./App.css";
import * as React from "react";
import { Button, Popover, Toggle } from "rsuite";
import { useState } from "react";
import "rsuite/dist/rsuite.min.css";
import { Dashboard } from "./Dashboard";

const ServiceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const ReadCharistristicUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const WriteCharistristicUUID = "e505ffd3-ecd5-4365-b57d-70202ab71692";

const size = 200;

const getCode = (selection) => {
  const { ppg, ecg, force } = selection;
  if (ppg && !ecg && !force) return 0x01;
  if (!ppg && ecg && !force) return 0x02;
  if (ppg && ecg && !force) return 0x03;
  if (!ppg && !ecg && force) return 0x04;
  if (ppg && !ecg && force) return 0x05;
  if (!ppg && ecg && force) return 0x06;
  if (ppg && ecg && force) return 0x07;
  return 0x00;
};

function App() {
  const [charastirctic, setCharastirctic] = useState();
  const [device, setDevice] = useState();

  const [selection, setSelection] = useState({
    ppg: false,
    ecg: false,
    force: false,
  });

  const [data1, setData1] = useState({
    ppg: [],
    ecg: [],
    force: [],
  });

  const ppgs = [];
  const ecgs = [];
  const forces = [];

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
                return char.writeValue(new Uint8Array([0x8f]).buffer); //auth 0x8f
              })
              .then(() => {
                return service
                  .getCharacteristic(WriteCharistristicUUID)
                  .then((char2) => {
                    return char2.writeValue(
                      new Uint8Array([getCode(selection)]).buffer
                    ); //send 3 data 0x07
                  });
              })
              .then(() => {
                service
                  .getCharacteristic(ReadCharistristicUUID)
                  .then((charastirctic) => {
                    setCharastirctic(charastirctic);

                    charastirctic.oncharacteristicvaluechanged = (data) => {
                      ppgs.push(data.srcElement.value.getUint16(0, true));
                      ecgs.push(data.srcElement.value.getInt16(2, true));
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

  if (!charastirctic) {
    return (
      <div className="container">
        <Popover title="Hekidesk" visible>
          <h4>Turn on your bluetooth!</h4>
          <br />
          <h6>Click on connect and select device.</h6>
        </Popover>
        <div className="selection">
          <div>
            <label>PPG: </label>
            <Toggle
              size="lg"
              checkedChildren="PPG"
              unCheckedChildren=" "
              onChange={(e) => setSelection({ ...selection, ppg: e })}
            />
            <label>ECG: </label>
            <Toggle
              size="lg"
              checkedChildren="ECG"
              unCheckedChildren=" "
              onChange={(e) => setSelection({ ...selection, ecg: e })}
            />
            <label>FORCE: </label>
            <Toggle
              size="lg"
              checkedChildren="FORCE"
              unCheckedChildren=" "
              onChange={(e) => setSelection({ ...selection, force: e })}
            />
          </div>
          <Button
            size="lg"
            color="violet"
            appearance="primary"
            onClick={connect}
          >
            connect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      device={device}
      setCharastirctic={setCharastirctic}
      setDevice={setDevice}
      charastirctic={charastirctic}
      data1={data1}
      setData1={setData1}
      selection={selection}
    />
  );
}

export default App;

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
