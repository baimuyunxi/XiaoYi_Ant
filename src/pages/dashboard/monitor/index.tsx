import {Gauge, Liquid, WordCloud} from '@ant-design/plots';
import {GridContent} from '@ant-design/pro-components';
import {useRequest} from '@umijs/max';
import {Card, Col, Progress, Row, Statistic} from 'antd';
import numeral from 'numeral';
import type {FC} from 'react';
import ActiveChart from './components/ActiveChart';
import Map from './components/Map';
import DemoPie from './components/Artificial';
import Interaction from './components/Interaction';
import {queryTags} from './service';
import useStyles from './style.style';
import ColumnChart from "./components/Error";


const Monitor: FC = () => {
  const {styles} = useStyles();
  const {loading, data} = useRequest(queryTags);
  const wordCloudData = (data?.list || []).map((item) => {
    return {
      id: +Date.now(),
      word: item.name,
      weight: item.value,
    };
  });
  return (
    <GridContent>
      <>
        <Row gutter={24}>
          <Col
            xl={18}
            lg={24}
            md={24}
            sm={24}
            xs={24}
            style={{
              marginBottom: 24,
            }}
          >
            <Card title="接口异常" bordered={false}>
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
                <Map/>
              </div>
            </Card>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Card
              title="流程异常"
              style={{
                marginBottom: 24,
              }}
              bordered={false}
            >
              <ActiveChart/>
            </Card>
            <Card
              title="人工异常"
              style={{
                marginBottom: 24,
              }}
              bordered={false}
            >
              <DemoPie/>
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col
            xl={18}
            lg={36}
            sm={48}
            xs={48}
            style={{
              marginBottom: 24,
            }}
          >
            <Card title="错误异常" bordered={false}>
              <ColumnChart/>
            </Card>
          </Col>
          <Col
            xl={6}
            lg={12}
            sm={24}
            xs={24}
            style={{
              marginBottom: 24,
            }}
          >
            <Card
              title="异常交互"
              bodyStyle={{
                textAlign: 'center',
                fontSize: 0,
              }}
              bordered={false}
            >
              <Interaction/>
            </Card>
          </Col>
        </Row>
      </>
    </GridContent>
  );
};
export default Monitor;
