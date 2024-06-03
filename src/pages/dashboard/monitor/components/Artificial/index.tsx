import React, { useEffect, useRef } from 'react';
import { Bar } from '@antv/g2plot';

const DemoBar = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const data = [
      { action: '10000转人工异常', value: 56 },
      { action: '10001转人工异常', value: 18 },
    ];

    // Helper function to insert line breaks and center text
    const formatLabel = (text) => {
      const maxLength = 5; // Adjust this value to control the length of each line
      const regex = new RegExp(`.{1,${maxLength}}`, 'g');
      return text.match(regex).join('\n');
    };

    const barPlot = new Bar(containerRef.current, {
      data,
      xField: 'value',
      yField: 'action',
      yAxis: {
        label: {
          formatter: formatLabel,
          style: {
            fill: 'rgba(0,0,0,1)',
            opacity: 0.6,

          },
        },
      },
      label: {
        position: 'middle',
        style: {
          fill: 'rgba(255,255,255,1)',
          opacity: 0.6,
          fontSize: 14,
        },
      },
    });

    barPlot.render();
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '180px' }} />;
};

export default DemoBar;
