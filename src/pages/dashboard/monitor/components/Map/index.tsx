import React, {useEffect, useRef, useState} from 'react';
import {Area} from '@antv/g2plot';
import {Col, Row, Statistic} from "antd";
import numeral from "numeral";
import useStyles from "@/pages/dashboard/monitor/style.style";

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

const DemoArea = () => {
  const {styles} = useStyles();
  const containerRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const data = generateRandomData();
    const totalDataPoints = data.length / 4; // 每种类型的时间点数量
    const visibleDataPoints = 11;
    const start = (totalDataPoints - visibleDataPoints) / totalDataPoints;
    const maxTotalValue = calculateMaxTotalValue(data);

    const areaPlot = new Area(containerRef.current, {
      data,
      isStack: true,
      xField: 'year',
      yField: 'value',
      seriesField: 'type',
      interactions: [{type: 'active-region', enable: false}],
      slider: {
        start,
        end: 1,
      },
      color: ({type}) => {
        // Define colors for each type
        const colors = {
          '失败': '#FFCCCC',
          '超时': '#80a4c9',
          '为N': '#CCCCFF',
        };
        return colors[type];
      },
    });

    areaPlot.render();
    setChart(areaPlot);

    // Cleanup function
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  return (
    <>
      <Row>
        <Col md={6} sm={12} xs={24}>
          <Statistic
            title="异常总量"
            suffix="次"
            value={numeral(124543233).format('0,0')}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="调用失败量" value="123" suffix="次"/>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="调用超时量" value='234' suffix="次"/>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="返回为N量" suffix="次" value={numeral(234).format('0,0')}/>
        </Col>
      </Row>
      <div className={styles.mapChart}>
        <div ref={containerRef} style={{width: '100%', height: '100%'}}/>
      </div>
    </>);
};

export default DemoArea;
