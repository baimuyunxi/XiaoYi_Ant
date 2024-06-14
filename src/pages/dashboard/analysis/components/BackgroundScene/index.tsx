import React, {useEffect, useRef} from 'react';
import {Column} from '@antv/g2plot';

const BackgroundScene = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const data = [
      {genre: '场景一', sold: 12},
      {genre: '场景二', sold: 115},
      {genre: '场景三', sold: 120},
      {genre: '场景四', sold: 350},
      {genre: '场景五', sold: 150},
    ];

    const chart = new Column(containerRef.current, {
      data,
      xField: 'genre',
      yField: 'sold',
      color: 'genre',
      label: {
        position: 'middle', // 'top', 'bottom', 'middle',
        style: {
          fill: '#FFFFFF',
          opacity: 0.6,
        },
      },
      xAxis: {
        label: {
          autoHide: false,
          autoRotate: false,
        },
      },
      meta: {
        type: {
          alias: '类别',
        },
        sales: {
          alias: '数量',
        },
      },
    });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{width: '100%', height: '300px'}}/>;
};

export default BackgroundScene;
