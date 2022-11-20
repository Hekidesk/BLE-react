import { useState } from "react";
import "./App.css";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';


const ServiceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CharistristicUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

function App() {
  const [state, setState] = useState("");
  const [ppg, setPpg] = useState();
  const [ecg, setEcg] = useState();
  const [force, setForce] = useState();
  const [ data1, setData1] = useState([])
  const [ data2, setData2] = useState([])
  const [ data3, setData3] = useState([])

  const ppgs = [];
  const ecgs = [];
  const forces = [];

  async function onButtonClick() {
    navigator.bluetooth
      .requestDevice({
        optionalServices: [ServiceUUID],
        filters: [{ namePrefix: "ECG-PPG-Server" }],
      })
      .then((device) => {
        device.gatt.connect().then((gatt) => {
          gatt.getPrimaryService(ServiceUUID).then((service) => {
            service
              .getCharacteristic(CharistristicUUID)
              .then((charastirctic) => {
                charastirctic.oncharacteristicvaluechanged = (data) => {
                  setPpg(data.srcElement.value.getUint16(0, true));
                  ppgs.push(data.srcElement.value.getUint16(0, true));
                  setEcg(data.srcElement.value.getUint16(2, true));
                  ecgs.push(data.srcElement.value.getUint16(2, true));
                  setForce(data.srcElement.value.getUint16(4, true));
                  forces.push(data.srcElement.value.getUint16(4, true));
                  setData1(ppgs);
                  setData2(ecgs);
                  setData3(forces);
                };
                charastirctic.startNotifications();
                setTimeout(() => {
                  charastirctic.stopNotifications();
                }, 10 * 1000);
              });
          });
        });
      });
  }

  const PPGSdata = {
    labels: [0],
    datasets: [
      {
        data: {...data1}, //ppgs 
        label: "PPGS",
        borderColor: "#3333ff",
      }
    ]
  };

  const ECGSdata = {
    
    labels: [0],
    datasets: [
      {
        data: {...data2}, //ecgs 
        label: "ECGS",
        borderColor: "#3333ff",
      }
    ]
  };

  const FORCESdata = {
    
    labels: [0],
    datasets: [
      {
       data: {...data3}, //forces
        label: "FORCES",
        borderColor: "#3333ff",
      }
    ]
  };

 
const options = (y)=>( {
   responsive: false,
  elements: {
    line: {
      tension: 0.5
    }
  },
  scales: {
    xAxes: [
      {
        type: "realtime",
        distribution: "linear",
        realtime: {
          onRefresh: function(chart) {
            chart.data.datasets[0].data.push({
              x: moment(),
              y: y
            });
          },
          delay: 5000,
          time: {
            displayFormat: "ss"
          }
        },
        ticks: {
          displayFormats: 1,
          maxRotation: 0,
          minRotation: 0,
          stepSize: 2,
          maxTicksLimit: 30,
          minUnit: "second",
          source: "auto",
          autoSkip: true,
          callback: function(value) {
            return moment(value, "HH:mm:ss").format("ss");
          }
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: false,
          max: 10000
        }
      }
    ]
  }
});
  return (
    <>
      {state && <p>{state} connected!</p>}
      {ppg && <p>{ppg} ppg!</p>}
      {ecg && <p>{ecg} ecg!</p>}
      {force && <p>{force} force!</p>}
      <br />
      <button onClick={onButtonClick}>connect</button>

      <Line data = {PPGSdata} options = {options(ppg)} height = "600px" width = "3000px" />
      <Line data = {ECGSdata} options = {options(ecg)} height = "600px" width = "3000px" />
      <Line data = {FORCESdata} options = {options(force)} height = "600px" width = "3000px" />

    </>
  );
}

export default App;
