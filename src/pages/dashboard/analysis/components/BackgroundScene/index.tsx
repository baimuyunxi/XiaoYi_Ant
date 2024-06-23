import React, {useEffect, useRef, useState} from 'react';
import {Column} from '@antv/g2plot';
import {getBottomUpScenes} from '../../service';

const BackgroundScene = () => {
  const containerRef = useRef(null);

  const [loading, setLoading] = useState(true);

  // 兜底场景
  const [bottomUpData, setBottomUpData] = useState({
    totalAmount: "",
    rateOfIncrease: "",
    iconDetails: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getBottomUpScenes({});
        if (response.code !== '200') {
          new Error(response.message || 'Failed to fetch data');
        }
        setBottomUpData(response.data);
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
      // 如果 bottomUpData 为空或者 iconDetails 为空，设置默认数据
      const data = (bottomUpData && Array.isArray(bottomUpData.iconDetails) && bottomUpData.iconDetails.length > 0)
        ? bottomUpData.iconDetails.map(d => ({type: d.type, value: Number(d.value)})) // 确保值为数字类型
        : [
          {type: 'Null', value: 0},
        ];

      const chart = new Column(containerRef.current, {
        data,
        xField: 'type',
        yField: 'value',
        color: 'type',
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
          value: {
            alias: '数量',
          },
        },
      });

      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [loading, bottomUpData]);

  return <div ref={containerRef} style={{width: '100%', height: '300px'}}/>;
};

export default BackgroundScene;
