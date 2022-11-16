import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as LoadingLogp } from "../../loading.svg";
import "./index.css";
import * as echarts from "echarts";

const BarChart = (props: { data: any[] }) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    console.log(props.data)
    if (props.data) {
      let chartInstance = echarts.init(chartRef.current);
      const option = {
        legend: {},
        tooltip: {},
        dataset: {
          source: props.data,
        },
        xAxis: { type: "category" },
        yAxis: {},
        series: [{ type: "bar" }],
      };
      chartInstance.setOption(option);
    }
  }, [props]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Data for different Store (using Echarts)</h2>
      <div ref={chartRef} style={{ height: "400px" }}></div>
    </div>
  );
};

export default BarChart;
