import {InfoCircleOutlined, NotificationOutlined} from '@ant-design/icons';
import {Area, Column, Line} from '@ant-design/plots';
import {Alert, Col, Progress, Row, Tooltip} from 'antd';
import numeral from 'numeral';
import {ChartCard, Field} from './Charts';
import Marquee from "react-fast-marquee";

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

const generateRandomData = () => {
  const types = ['异常挂机'];
  const startTime = new Date();
  startTime.setHours(0, 0, 0, 0);
  const endTime = new Date();
  const interval = 10 * 60 * 1000; // 10 minutes in milliseconds

  const data: {
    time: string; value: number; // Generates random value between 3 and 13
    type: string;
  }[] = [];

  for (let time = startTime.getTime(); time <= endTime.getTime(); time += interval) {
    const current = new Date(time);
    const timeString = current.toTimeString().slice(0, 8); // Format time as HH:MM:SS
    types.forEach(type => {
      data.push({
        time: timeString,
        value: parseFloat((Math.random() * 10 + 3).toFixed(1)), // Generates random value between 3 and 13
        type,
      });
    });
  }

  return data;
};

const IntroduceRow = () => {

  const data = generateRandomData().slice(-36); // 选择最后36条数据
  const starttime = '12:00';
  const rgendtime = '10:00';

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
          icon={<NotificationOutlined />}
          closable
          style={{borderRadius: '23px', backgroundColor: '#bff18f'}}
          message={
            <Marquee pauseOnHover gradient={false}>
              当前整体数据截止时间&nbsp;<span
              style={{color: 'red', fontWeight: 'bold'}}>{starttime}</span>&nbsp;，人工相关数据截止时间&nbsp;<span
              style={{color: 'red', fontWeight: 'bold'}}>{rgendtime}</span>&nbsp;。
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
          total={() => 126560}
          footer={<Field label="" value={''}/>}
          contentHeight={46}
        >
          <Line
            xField="time"
            yField="value"
            shapeField="smooth"
            height={46}
            axis={false}
            // style={{
            //   fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
            //   fillOpacity: 0.6,
            //   width: '100%',
            // }}
            padding={-20}
            data={data}
          />
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
          total={numeral(8846).format('0,0')}
          footer={<Field label="呼入率" value={'78%'}/>}
          contentHeight={46}
        >
          <Area
            xField="time"
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
            data={data}
          />
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
          total={numeral(6560).format('0,0')}
          footer={<Field label="转人工率" value="60%"/>}
          contentHeight={46}
        >
          <Column
            xField="time"
            yField="value"
            padding={-20}
            axis={false}
            height={46}
            data={data}
            scale={{x: {paddingInner: 0.4}}}
          />
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
          total="1234"
          footer={<Field label="接通率" value={'78%'}/>}
          contentHeight={46}
        >
          <Area
            xField="time"
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
            data={data}
          />
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
