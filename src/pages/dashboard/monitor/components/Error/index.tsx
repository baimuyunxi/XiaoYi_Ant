import React, {useEffect, useRef} from 'react';
import {Column} from '@antv/g2plot';
import {Tooltip} from "antd";

const generateRandomData = () => {
  const types = ['拒识', '超时', '按键错误', '超时&按键错误 >=4'];
  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0);
  const endTime = new Date();
  const interval = 10 * 60 * 1000; // 10 minutes in milliseconds

  const data = [];

  for (let time = startTime.getTime(); time <= endTime.getTime(); time += interval) {
    const current = new Date(time);
    const timeString = current.toTimeString().slice(0, 8); // Format time as HH:MM:SS
    types.forEach(type => {
      data.push({
        year: timeString,
        value: parseFloat((Math.random() * 10 + 3).toFixed(1)), // Generates random value between 3 and 13
        type,
      });
    });
  }

  return data;
};

const ColumnChart = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const data = generateRandomData();
    const column = new Column(containerRef.current, {
      data,
      xField: 'year',
      yField: 'value',
      seriesField: 'type',
      isGroup: true,
      columnStyle: {
        radius: [20, 20, 0, 0],
      },
      color: ({ type }) => {
        // Define colors for each type
        const colors = {
          '拒识': '#FBE7C6',
          '超时': '#B4F8C8',
          '按键错误': '#A0E7E5',
          '超时&按键错误 >=4': '#FFAEBC'
        };
        return colors[type];
      },
      xAxis: {
        label: {
          autoRotate: false,
        },
      },
      slider: {
        start: 0.95,
        end: 1,
      },
    });

    column.render();
    return () => {
      column.destroy();
    };
  }, []);


  return <div ref={containerRef} style={{width: '100%', height: '100%'}}/>;
};


export default ColumnChart;
