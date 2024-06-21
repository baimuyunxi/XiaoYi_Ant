import React, {useEffect, useRef} from 'react';
import {Pie} from '@antv/g2plot';

const PieChart = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const data = [
      {type: '身份证验证异常', value: 2577},
      {type: '号码输入异常', value: 2532},
      {type: '未命中有效服务节点', value: 1841},
      {type: '未重复场景 ≥4', value: 1125},
    ];

    const piePlot = new Pie(containerRef.current, {
      appendPadding: 10,
      data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,
      label: {
        type: 'outer',
        content: '{percentage}',
      },
      interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
      legend: {
        position: 'left',
      },
      pieStyle: {
        lineWidth: 0,
      },
    });

    piePlot.render();

    const interval = setInterval(() => {
      piePlot.changeData(data.map((d) => ({...d, value: Math.floor(d.value * Math.random())})));  // 确保数据变化为整数
    }, 120000);

    return () => {
      clearInterval(interval);
      piePlot.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{width: '100%', height: '200px'}}/>;
};

export default PieChart;
