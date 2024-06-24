import React, {useEffect, useRef, useState} from 'react';
import {Line} from '@antv/g2plot';
import {Col, message, Row, Statistic, Tooltip} from "antd";
import useStyles from "@/pages/dashboard/monitor/style.style";
import numeral from "numeral";
import {getMistakeAbnormal, getPortAbnormal, getProcessAbnormal} from "@/pages/dashboard/monitor/service";

const LineChartS = () => {
  const containerRef = useRef(null);
  const {styles} = useStyles();
  const [loading, setLoading] = useState(true);
  const [mistake, setMistake] = useState({
    overNumber: "0",
    keyNumber: "0",
    rejectionNumber: "0",
    MergerNumber: "0",
    allIcon: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getMistakeAbnormal({});
        if (response.code !== '200') {
          throw new Error(response.message || 'Failed to fetch data');
        }

        const processedArtificialData = {
          ...response.data,
          allIcon: response.data.allIcon.map(item => ({
            ...item,
            value: parseInt(item.value, 10),
          })),
        };
        setMistake(processedArtificialData);
        setLoading(false);
      } catch (error) {
        message.error(`Error: ${error.message}`);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const totalDataPoints = mistake.allIcon.length / 4; // 每种类型的时间点数量
    const visibleDataPoints = 12;
    const start = (totalDataPoints - visibleDataPoints) / totalDataPoints;
    const linePlot = new Line(containerRef.current, {
      data: mistake.allIcon,
      xField: 'line',
      yField: 'value',
      seriesField: 'type',
      smooth: true,
      color: ({type}) => {
        // Define colors for each type
        const colors = {
          '拒识': '#FBE7C6',
          '超时': '#B4F8C8',
          '按键错误': '#A0E7E5',
          '超时与按键错误 >=4': '#FFAEBC'
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
  }, [loading]);

  return (
    <>
      <Row>
        <Col md={6} sm={12} xs={24}>
          <Statistic
            title="异常超时"
            suffix="次"
            value={numeral(mistake.overNumber).format('0,0')}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="异常按键错误" value={numeral(mistake.keyNumber).format('0,0')} suffix="次"/>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="异常拒识" value={numeral(mistake.rejectionNumber).format('0,0')} suffix="次"/>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="异常超时&按键错误(>=7)" suffix="次" value={numeral(mistake.MergerNumber).format('0,0')}/>
        </Col>
      </Row>
      <div className={styles.mapChart}>
        <div ref={containerRef} style={{width: '100%', height: '100%'}}/>
      </div>
    </>);
};

export default LineChartS;
