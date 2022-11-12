import { useState } from "react";
import "./App.css";

function App() {
  const [state, onChange] = useState("");

  async function onButtonClick() {
    navigator.bluetooth
      .requestDevice({
        filters: [{ namePrefix: "ECG-PPG-Server" }],
      })
      .then((device) => {
        device.gatt.connect().then((gatt) => {
          console.log(gatt);
          onChange(gatt.device.name);
          gatt.getPrimaryService("/ uuid ").then(console.log);
        });
        console.log(device);
      });
  }
  return (
    <>
      {state && <p>{state} connected!</p>}
      <button onClick={onButtonClick}>connect</button>
    </>
  );
}

export default App;
