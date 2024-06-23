import {InfoCircleOutlined, NotificationOutlined} from '@ant-design/icons';
import {Area, Column, Line} from '@ant-design/plots';
import {Alert, Col, Row, Tooltip, Skeleton} from 'antd';
import numeral from 'numeral';
import {ChartCard, Field} from './Charts';
import Marquee from "react-fast-marquee";
import {queryIterate} from '../service';
import React, {useEffect, useState} from "react";

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const IntroduceRow: React.FC = () => {
  const [aggregateData, setAggregateData] = useState({
    firstTime: '',
    secondTime: '',
    totalQueue: 0,
    detailTotalQueue: [],
    totalArtificial: 0,
    detailTotalArtificial: [],
    mangoVolume: 0,
    detailMangoVolume: [],
    allVolume: 0,
    detailAllVolume: [],
    volumeProportion: 0,
    transferRate: 0,
    connectionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await queryIterate({});

      if (response.code !== '200') {
        throw new Error(response.message || 'Failed to fetch data');
      }

      const processedArtificialData = {
        ...response.data,
        detailTotalQueue: response.data.detailTotalQueue.map(item => ({
          ...item,
          value: parseInt(item.value, 10),
        })),
        detailTotalArtificial: response.data.detailTotalArtificial.map(item => ({
          ...item,
          value: parseInt(item.value, 10),
        })),
        detailMangoVolume: response.data.detailMangoVolume.map(item => ({
          ...item,
          value: parseInt(item.value, 10),
        })),
        detailAllVolume: response.data.detailAllVolume.map(item => ({
          ...item,
          value: parseInt(item.value, 10),
        })),
      };
      setAggregateData(processedArtificialData);
      setLoading(false);
    }

    fetchData();
  }, []);

  const {
    firstTime,
    secondTime,
    totalQueue,
    detailTotalQueue,
    totalArtificial,
    detailTotalArtificial,
    mangoVolume,
    detailMangoVolume,
    allVolume,
    detailAllVolume,
    volumeProportion,
    transferRate,
    connectionRate,
  } = aggregateData;

  return (
    <Row gutter={24}>
      <Col
        xl={24}
        lg={24}
        md={24}
        sm={24}
        style={{
          marginBottom: 12,
        }}
      >
        <Alert
          banner={true}
          icon={<NotificationOutlined/>}
          closable
          style={{borderRadius: '23px', backgroundColor: '#bff18f'}}
          message={
            <Marquee pauseOnHover gradient={false}>
              当前整体数据截止时间为&nbsp;<span
              style={{color: 'red', fontWeight: 'bold'}}>{firstTime}</span>&nbsp;，人工相关数据统计截止时间为&nbsp;<span
              style={{
                color: 'red',
                fontWeight: 'bold'
              }}>{secondTime}</span>&nbsp;（话务数据存在2小时延迟）。&nbsp;&nbsp;&nbsp;&nbsp;
            </Marquee>
          }
        />
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="总呼入量"
          action={
            <Tooltip title="10000/10001当前呼入量">
              <InfoCircleOutlined/>
            </Tooltip>
          }
          total={loading ? <Skeleton.Input style={{width: 100}} active/> : numeral(allVolume).format('0,0')}
          footer={<Field label="" value={''}/>}
          contentHeight={46}
        >
          {loading ? (
            <Skeleton active/>
          ) : (
            <Line
              xField="type"
              yField="value"
              shapeField="smooth"
              height={46}
              axis={false}
              padding={[10, 20, 20, -20]}
              data={detailAllVolume}
            />
          )}
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="10000号呼入量"
          action={
            <Tooltip title="呼入率=10000号呼入量/总呼入量">
              <InfoCircleOutlined/>
            </Tooltip>
          }
          total={loading ? <Skeleton.Input style={{width: 100}} active/> : numeral(mangoVolume).format('0,0')}
          footer={<Field label="占比"
                         value={loading ? <Skeleton.Input style={{width: 50}} active/> : `${volumeProportion}%`}/>}
          contentHeight={46}
        >
          {loading ? (
            <Skeleton active/>
          ) : (
            <Area
              xField="type"
              yField="value"
              shapeField="smooth"
              height={46}
              axis={false}
              style={{
                fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
                fillOpacity: 0.6,
                width: '100%',
              }}
              padding={-20}
              data={detailMangoVolume}
            />
          )}
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="人工呼入量"
          action={
            <Tooltip title={"进入队列，队列数据有1~2小时延迟。转人工率=人工呼入量/总呼入量"}>
              <InfoCircleOutlined/>
            </Tooltip>
          }
          total={loading ? <Skeleton.Input style={{width: 100}} active/> : numeral(totalQueue).format('0,0')}
          footer={<Field label="转人工率"
                         value={loading ? <Skeleton.Input style={{width: 50}} active/> : `${transferRate}%`}/>}
          contentHeight={46}
        >
          {loading ? (
            <Skeleton active/>
          ) : (
            <Column
              xField="type"
              yField="value"
              padding={-20}
              axis={false}
              height={46}
              data={detailTotalQueue}
              scale={{x: {paddingInner: 0.4}}}
            />
          )}
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="人工接通量"
          action={
            <Tooltip title="人工话务接通量，接通数据有1~2小时延迟。接通率=人工接通量/人工呼入量">
              <InfoCircleOutlined/>
            </Tooltip>
          }
          total={loading ? <Skeleton.Input style={{width: 100}} active/> : numeral(totalArtificial).format('0,0')}
          footer={<Field label="接通率"
                         value={loading ? <Skeleton.Input style={{width: 50}} active/> : `${connectionRate}%`}/>}
          contentHeight={46}
        >
          {loading ? (
            <Skeleton active/>
          ) : (
            <Area
              xField="type"
              yField="value"
              shapeField="smooth"
              height={46}
              axis={false}
              style={{
                fill: 'linear-gradient(-90deg, #FBAB7E 0%, #F7CE68 100%)',
                fillOpacity: 0.6,
                width: '100%',
              }}
              padding={-20}
              data={detailTotalArtificial}
            />
          )}
        </ChartCard>
      </Col>
    </Row>
  );
};

export default IntroduceRow;
