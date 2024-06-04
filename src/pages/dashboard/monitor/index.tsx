import {GridContent} from '@ant-design/pro-components';
import {Card, Col, Row} from 'antd';
import type {FC} from 'react';
import ActiveChart from './components/ActiveChart';
import Map from './components/Map';
import DemoPie from './components/Artificial';
import Interaction from './components/Interaction';
import ColumnChart from "./components/Error";


const Monitor: FC = () => {

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
              <Map/>
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
            lg={24}
            md={24}
            sm={24}
            xs={24}
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
