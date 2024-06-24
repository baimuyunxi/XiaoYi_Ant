import React, {useEffect, useRef, useState} from 'react';
import {Area} from '@antv/g2plot';
import {Col, message, Row, Statistic} from "antd";
import numeral from "numeral";
import useStyles from "@/pages/dashboard/monitor/style.style";
import {getProcessAbnormal} from "@/pages/dashboard/monitor/service";

const ActiveChart = () => {
  const {styles} = useStyles();
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [process, setProcess] = useState({
    allNumber: "0",
    hangUpNumber: "0",
    mutualNumber: "0",
    ProcessIcon: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProcessAbnormal({});

        if (response.code !== '200') {
          new Error(response.message || 'Failed to fetch data');
        }

        const processedArtificialData = {
          ...response.data,
          ProcessIcon: response.data.ProcessIcon.map(item => ({
            ...item,
            value: parseInt(item.value, 10),
          })),
        };
        setProcess(processedArtificialData);
        setLoading(false);
      } catch (error) {
        message.error(`Error: ${error.message}`);
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  useEffect(() => {
    const totalDataPoints = process.ProcessIcon.length / 2; // 每种类型的时间点数量
    const visibleDataPoints = 12;
    const start = (totalDataPoints - visibleDataPoints) / totalDataPoints;

    const areaPlot = new Area(containerRef.current, {
      data: process.ProcessIcon,
      isStack: true,
      smooth: true,
      xField: 'line',
      yField: 'value',
      seriesField: 'type',
      // interactions: [{type: 'active-region', enable: false}],
      slider: {
        start,
        end: 1,
      },
      color: ({type}) => {
        // Define colors for each type
        const colors = {
          '异常挂机': '#FFCCCC',
          '无交互': '#80a4c9',
        };
        return colors[type];
      },
    });

    areaPlot.render();

    return () => {
      areaPlot.destroy();
    };
  }, [loading]);


  return (
    <>
      <Row>
        <Col md={6} sm={12} xs={24}>
          <Statistic
            title="异常总量"
            suffix="次"
            value={numeral(process.allNumber).format('0,0')}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="异常挂机" value={numeral(process.hangUpNumber).format('0,0')} suffix="次"/>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="交互异常" value={numeral(process.mutualNumber).format('0,0')} suffix="次"/>
        </Col>
      </Row>
      <div className={styles.mapChart}>
        <div ref={containerRef} style={{width: '100%', height: '100%'}}/>
      </div>
    </>
  );
};

export default ActiveChart;
