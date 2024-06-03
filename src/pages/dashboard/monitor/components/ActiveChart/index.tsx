import {Area} from '@ant-design/plots';
import {Col, Divider, Space, Statistic} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import useStyles from './index.style';
import numeral from 'numeral';
import Field from './Field';

function fixedZero(val: number) {
  return val * 1 < 10 ? `0${val}` : val;
}

function getActiveData() {
  const activeData = [];
  for (let i = 0; i < 24; i += 1) {
    activeData.push({
      x: `${fixedZero(i)}:00`,
      y: Math.floor(Math.random() * 200) + i * 50,
    });
  }
  return activeData;
}

const ActiveChart = () => {
  const timerRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);
  const {styles} = useStyles();
  const [activeData, setActiveData] = useState<{ x: string; y: number }[]>([]);
  const loopData = () => {
    requestRef.current = requestAnimationFrame(() => {
      timerRef.current = window.setTimeout(() => {
        setActiveData(getActiveData());
        loopData();
      }, 2000);
    });
  };

  useEffect(() => {
    loopData();
    return () => {
      clearTimeout(timerRef.current!);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.activeChart}>
      <Field label="异常挂机" value={''}/>
      <div
        style={{
          marginTop: 0,
        }}
      >
        <Area
          padding={[0, 0, 0, 0]}
          xField="x"
          axis={false}
          yField="y"
          height={84}
          style={{fill: 'linear-gradient(-90deg, white 0%, #6294FA 100%)', fillOpacity: 0.6}}
          data={activeData}
        />
      </div>
      <Divider/>
      <div>
        <Field label="场景兜底" value={''}/>
        <div style={{marginTop: 9,}}/>
        <Field label="兜底量" value={numeral(1234).format('0,0')}/>
      </div>
    </div>
  );
};

export default ActiveChart;
