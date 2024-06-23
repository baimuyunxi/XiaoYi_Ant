import React, {useEffect, useRef, useState} from 'react';
import {Bar} from '@antv/g2plot';
import {getArtificialExceptions} from '../../service';

const DemoBar = () => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [artificialData, setArtificialData] = useState({
    totalAmount: "",
    rateOfIncrease: "",
    smallIconDetails: [],
    iconDetails: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getArtificialExceptions({});
        if (response.code !== '200') {
          new Error(response.message || 'Failed to fetch data');
        }
        setArtificialData(response.data);
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
      // 辅助函数，用于插入换行符和居中文字
      const formatLabel = (text) => {
        const maxLength = 5; // 调整这个值以控制每行的长度
        const regex = new RegExp(`.{1,${maxLength}}`, 'g');
        return text.match(regex).join('\n');
      };

      // 如果 artificialData 为空或者 smallIconDetails 为空，设置默认数据
      const data = (artificialData && Array.isArray(artificialData.iconDetails) && artificialData.iconDetails.length > 0)
        ? artificialData.iconDetails.map(d => ({type: d.type, value: Number(d.value)})) // 确保值为数字类型
        : [
          {type: 'Null', value: 0},
        ];

      const barPlot = new Bar(containerRef.current, {
        data: data,
        xField: 'value',
        yField: 'type',
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
        barStyle: {
          radius: [23, 23, 0, 0],
        },
        color: '#03AED2',
      });

      barPlot.render();

      return () => {
        barPlot.destroy();
      };
    }
  }, [loading, artificialData]);

  return (
    <div ref={containerRef} style={{width: '100%', height: '180px'}}/>
  );
};

export default DemoBar;
