import {GridContent} from '@ant-design/pro-components';
import {Card, Col, Row} from 'antd';
import {FC, useState} from 'react';
import ActiveChart from './components/ActiveChart';
import Map from './components/Map';
import DemoPie from '../analysis/components/Artificial';
import Interaction from '../analysis/components/Interaction';
import ColumnChart from "./components/Error";
import {SyncOutlined} from '@ant-design/icons';
import {FloatButton} from 'antd';


const Monitor: FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <GridContent>
      <>
        <Row gutter={24}>
          <Col
            xl={24}
            lg={24}
            md={24}
            sm={24}
            xs={24}
            style={{
              marginBottom: 24,
            }}
          >
            <Card title="接口异常" bordered={false}>
              <Map key={refreshKey}/>
            </Card>
          </Col>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              title="流程异常"
              style={{
                marginBottom: 24,
              }}
              bordered={false}
            >
              <ActiveChart key={refreshKey}/>
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col
            xl={24}
            lg={24}
            md={24}
            sm={24}
            xs={24}
            style={{
              marginBottom: 24,
            }}
          >
            <Card title="错误异常" bordered={false}>
              <ColumnChart key={refreshKey}/>
            </Card>
          </Col>
        </Row>
        <FloatButton.Group shape="circle" style={{right: 24}}>
          <FloatButton icon={<SyncOutlined/>} onClick={handleRefresh}/>
          <FloatButton.BackTop visibilityHeight={0}/>
        </FloatButton.Group>
      </>
    </GridContent>
  );
};
export default Monitor;
