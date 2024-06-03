import { Column } from '@antv/g2plot';
import React, { useEffect, useRef, useState } from 'react';

const generateRandomData = () => {
  const types = ['失败', '超时', '为N'];
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

const calculateMaxTotalValue = (data) => {
  const groupedByYear = data.reduce((acc, curr) => {
    if (!acc[curr.year]) {
      acc[curr.year] = 0;
    }
    acc[curr.year] += curr.value;
    return acc;
  }, {});

  return Math.max(...Object.values(groupedByYear));
};

const DemoColumn = () => {
  const containerRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const data = generateRandomData();
    const maxTotalValue = calculateMaxTotalValue(data);

    const stackedColumnPlot = new Column(containerRef.current, {
      data,
      isStack: true,
      xField: 'year',
      yField: 'value',
      seriesField: 'type',
      label: {
        position: 'middle', // 'top', 'bottom', 'middle'
      },
      interactions: [{ type: 'active-region', enable: false }],
      connectedArea: {
        style: (oldStyle, element) => {
          return { fill: 'rgba(0,0,0,0.25)', stroke: oldStyle.fill, lineWidth: 0.5 };
        },
      },
      xAxis: {
        label: {
          autoRotate: false,
        },
      },
      yAxis: {
        max: maxTotalValue,
        tickInterval: 5,
        title: {
          text: '总值',
        },
      },
      slider: {
        start: 0.95,
        end: 1,
      },
      color: ({ type }) => {
        // Define colors for each type
        const colors = {
          '失败': '#FFCCCC',
          '超时': '#80a4c9',
          '为N': '#CCCCFF',
        };
        return colors[type];
      },
    });

    stackedColumnPlot.render();
    setChart(stackedColumnPlot);

    // Cleanup function
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default DemoColumn;
