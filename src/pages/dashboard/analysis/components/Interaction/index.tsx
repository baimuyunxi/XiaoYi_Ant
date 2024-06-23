import React, {useEffect, useRef, useState} from 'react';
import {Pie} from '@antv/g2plot';
import {getInteractionAnomalies} from '../../service';

const PieChart = () => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [interactionData, setInteractionData] = useState({
    totalAmount: "",
    rateOfIncrease: "",
    iconDetails: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getInteractionAnomalies({});
        if (response.code !== '200') {
          new Error(response.message || 'Failed to fetch data');
        }
        setInteractionData(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // @ts-ignore
  useEffect(() => {
    if (!loading && containerRef.current){
      // 如果 interactionData 为空或者 iconDetails 为空，设置默认数据
      const data = (interactionData && Array.isArray(interactionData.iconDetails) && interactionData.iconDetails.length > 0)
        ? interactionData.iconDetails.map(d => ({type: d.type, value: Number(d.value)})) // 确保值为数字类型
        : [
          {type: 'Null', value: 0},
        ];

      const piePlot = new Pie(containerRef.current, {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        startAngle: Math.PI,
        endAngle: Math.PI * 1.5,
        label: {
          type: 'inner',
          offset: '-8%',
          content: ({value}) => `${value}`, // 显示数量而不是标签名称
          style: {fontSize: 12},
        },
        legend: {
          position: 'left',
        },
        interactions: [{type: 'element-active'}],
        pieStyle: {
          lineWidth: 0,
        },
      });

      piePlot.render();

      const interval = setInterval(() => {
        piePlot.changeData(data.map((d) => ({...d, value: Math.floor(d.value * Math.random())}))); // 确保数据变化为整数
      }, 120000);

      return () => {
        clearInterval(interval);
        piePlot.destroy();
      };
    }
  }, [loading, interactionData]);

  return (
    <div ref={containerRef} style={{width: '100%', height: '200px'}}/>
  );
};

export default PieChart;
