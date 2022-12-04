import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Diagram = ({ dataKey, flow }) => {
  const steam = [...flow].map((item, id) => {
    return {
      name: id,
      [dataKey]: item,
      impression: 100,
    };
  });
  const [state, setState] = React.useState({
    data: [],
    left: "dataMin",
    right: "dataMax",
    refAreaLeft: "",
    refAreaRight: "",
    top: "dataMax+10",
    bottom: "dataMin-10",
    animation: true,
  });

  const getAxisYDomain = (from, to, ref, offset) => {
    const refData = steam.slice(from - 1, to);

    let [bottom, top] = [refData[0][ref], refData[0][ref]];

    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });

    return [(bottom | 0) - offset, (top | 0) + offset];
  };

  function zoom() {
    let { refAreaLeft, refAreaRight } = state;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setState(() => ({
        ...state,
        data: steam,
        refAreaLeft: "",
        refAreaRight: "",
      }));
      return;
    }

    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    const [bottom, top] = getAxisYDomain(refAreaLeft, refAreaRight, dataKey, 1);

    setState(() => ({
      ...state,
      refAreaLeft: "",
      refAreaRight: "",
      data: steam,
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top,
    }));
  }

  function zoomOut() {
    setState(() => ({
      ...state,
      data: steam,
      refAreaLeft: "",
      refAreaRight: "",
      left: "dataMin",
      right: "dataMax",
      top: "dataMax+1",
      bottom: "dataMin",
    }));
  }
  return (
    <div className="highlight-bar-charts" style={{ userSelect: "none" }}>
      <button type="button" className="btn update" onClick={zoomOut}>
        {dataKey}
      </button>
      <LineChart
        width={1500}
        height={600}
        data={steam}
        onMouseDown={(e) => setState({ ...state, refAreaLeft: e.activeLabel })}
        onMouseMove={(e) =>
          state.refAreaLeft &&
          setState({ ...state, refAreaRight: e.activeLabel })
        }
        onMouseUp={zoom}
      >
        <CartesianGrid />
        <XAxis
          dataKey="name"
          domain={[state.left, state.right]}
          type="number"
        />
        <YAxis domain={[state.bottom, state.top]} type="number" yAxisId="1" />
        <Tooltip />
        <Line
          yAxisId="1"
          type="natural"
          dataKey={dataKey}
          stroke="#8884d8"
          animationDuration={300}
        />
        {state.refAreaLeft && state.refAreaRight ? (
          <ReferenceArea
            yAxisId="1"
            x1={state.refAreaLeft}
            x2={state.refAreaRight}
            strokeOpacity={0.3}
          />
        ) : null}
      </LineChart>
    </div>
  );
};

export default Diagram;
