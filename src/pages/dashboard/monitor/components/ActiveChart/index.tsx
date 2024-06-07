import React, {useEffect, useRef, useState} from 'react';
import {Area} from '@antv/g2plot';
import {Col, Divider, Row, Statistic, Table} from "antd";
import numeral from "numeral";
import useStyles from "@/pages/dashboard/monitor/style.style";

const generateRandomData = () => {
  const types = ['异常挂机'];
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

const ActiveChart = () => {
  const {styles} = useStyles();
  const containerRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const data = generateRandomData();
    const totalDataPoints = data.length; // 每种类型的时间点数量
    const visibleDataPoints = 11;
    const start = (totalDataPoints - visibleDataPoints) / totalDataPoints;
    calculateMaxTotalValue(data);

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
      // color: ({type}) => {
      //   // Define colors for each type
      //   const colors = {
      //     '失败': '#FFCCCC',
      //     '为N': '#80a4c9',
      //   };
      //   return colors[type];
      // },
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

  const columns = [{
    title: '名称',
    dataIndex: 'name',
  }, {
    title: '数量',
    dataIndex: 'name',
  },
  ]

  return (
    <>
      <Row gutter={24}>
        <Col
          xl={16}
          lg={16}
          md={24}
          sm={24}
          xs={24}
          style={{
            marginBottom: 24,
          }}
        >
          <div className={styles.mapChart}>
            <div ref={containerRef} style={{width: '100%', height: '100%'}}/>
          </div>
        </Col>
        <Col
          xl={8}
          lg={16}
          md={24}
          sm={24}
          xs={24}
          style={{
            marginBottom: 24,
          }}
        >
          <div className={styles.mapChart}>
            <Statistic title={'异常总量'} value={numeral(6662177).format('0,0')} suffix={'通'}/>
            <Divider/>
            <h4>场景兜底</h4>
            <Table columns={columns} dataSource={''} scroll={{y: 440}} bordered={true}/>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ActiveChart;
