import React, {useEffect, useRef, useState} from 'react';
import {Pie} from '@antv/g2plot';
import {getErrorException} from '../../service';

const PieChart = () => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // 错误异常 getErrorException
  const [errorData, setErrorData] = useState({
    totalAmount: "",
    rateOfIncrease: "",
    iconDetails: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response1 = await getErrorException({});
        setErrorData(response1.data);
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
    if (!loading && containerRef.current) {
      // 如果 errorData 为空或者 iconDetails 为空，设置默认数据
      const data = (errorData && Array.isArray(errorData.iconDetails) && errorData.iconDetails.length > 0)
        ? errorData.iconDetails.map(d => ({type: d.type, value: Number(d.value)})) // 确保值为数字类型
        : [
          {type: 'Null', value: 0},
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
        interactions: [{type: 'pie-legend-active'}, {type: 'element-active'}],
        legend: {
          position: 'left',
        },
        pieStyle: {
          lineWidth: 0,
        },
      });

      piePlot.render();

      return () => {
        piePlot.destroy();
      };
    }
  }, [loading, errorData]);

  return <div ref={containerRef} style={{width: '100%', height: '200px'}}/>;
};

export default PieChart;
