import React, {useEffect, useRef} from 'react';
import {Line} from '@antv/g2plot';
import {Col, Row, Statistic, Tooltip} from "antd";
import useStyles from "@/pages/dashboard/monitor/style.style";
import numeral from "numeral";

const generateRandomData = () => {
  const types = ['拒识', '超时', '按键错误', '超时&按键错误 >=4'];
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

const LineChartS = () => {
  const containerRef = useRef(null);
  const {styles} = useStyles();

  useEffect(() => {
    const data = generateRandomData();
    const totalDataPoints = data.length / 4; // 每种类型的时间点数量
    const visibleDataPoints = 11;
    const start = (totalDataPoints - visibleDataPoints) / totalDataPoints;
    const linePlot = new Line(containerRef.current, {
      data,
      xField: 'year',
      yField: 'value',
      seriesField: 'type',
      smooth: true,
      color: ({type}) => {
        // Define colors for each type
        const colors = {
          '拒识': '#FBE7C6',
          '超时': '#B4F8C8',
          '按键错误': '#A0E7E5',
          '超时&按键错误 >=4': '#FFAEBC'
        };
        return colors[type];
      },
      xAxis: {
        label: {
          autoRotate: false,
        },
      },
      yAxis: {
        label: {
          formatter: (v) => (typeof v === 'number' ? v.toFixed(1) : v),
        },
      },
      legend: {
        position: 'top',
      },
      animation: {
        appear: {
          animation: 'path-in',
          duration: 1000,
        },
      },
      slider: {
        start,
        end: 1,
      },
    });

    linePlot.render();
    return () => {
      linePlot.destroy();
    };
  }, []);

  return (
    <>
      <Row>
        <Col md={6} sm={12} xs={24}>
          <Statistic
            title="异常超时"
            suffix="次"
            value={numeral(12233).format('0,0')}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="异常按键错误" value={numeral(1233).format('0,0')} suffix="次"/>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="异常拒识" value={numeral(2233).format('0,0')} suffix="次"/>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="异常超时&拒识(>=7)" suffix="次" value={numeral(234).format('0,0')}/>
        </Col>
      </Row>
      <div className={styles.mapChart}>
        <div ref={containerRef} style={{width: '100%', height: '100%'}}/>
      </div>
    </>);
};

export default LineChartS;
