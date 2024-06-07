import {InfoCircleOutlined} from '@ant-design/icons';
import {Area, Column, Line} from '@ant-design/plots';
import {Col, Progress, Row, Tooltip} from 'antd';
import numeral from 'numeral';
import {ChartCard, Field} from './Charts';

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

  return (
    <Row gutter={24}>
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
          footer={<Field label="当前数据统计截止时间:" value={<span style={{color: 'red'}}><b>12:00</b></span>}/>}
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
          <Progress percent={78} strokeColor={{from: '#108ee9', to: '#87d068'}} status="active"/>
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
