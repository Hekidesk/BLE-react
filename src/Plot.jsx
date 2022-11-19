import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import sampleData from './sample_data';
import Chart from 'chart.js/auto';


function Plot() {
  const PPGSdata = {
    
    labels: [0],
    datasets: [
      {
        data: {...sampleData.ppgs}, //ppgs 
        label: "PPGS",
        borderColor: "#3333ff",
      }
    ]
  };

  const ECGSdata = {
    
    labels: [0],
    datasets: [
      {
        data: {...sampleData.ecgs}, //ecgs 
        label: "ECGS",
        borderColor: "#3333ff",
      }
    ]
  };

  const FORCESdata = {
    
    labels: [0],
    datasets: [
      {
        data: {...sampleData.forces}, //forces
        label: "FORCES",
        borderColor: "#3333ff",
      }
    ]
  };

  const options = {
    borderWidth : 1,
    responsive: false,
    title:{
      display:true,
      text:'PPGS',
      fontSize:20
    },
    legend:{
      display:true,
      position:'right'
    },
    scales: {
      y:
        {
          min: 0,
          max: 66000,
          stepSize: 1,
        },
      x:
        {
          min: 0,
          max: 10000,
          stepSize: 1,
        },
    },
  };
  

    return ( 
      <div>
          <Line data = {PPGSdata} options = {options} height = "600px" width = "3000px" />
          <Line data = {ECGSdata} options = {options} height = "600px" width = "3000px" />
          <Line data = {FORCESdata} options = {options} height = "600px" width = "3000px" />
          {/* {sampleData.ppgs.map((item) => (
              <tr>
                  <td>{item}</td>
              </tr>
            ))} */}
        </div>
     );
}

export default Plot;