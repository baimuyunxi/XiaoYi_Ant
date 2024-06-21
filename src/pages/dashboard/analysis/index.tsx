import {GridContent} from '@ant-design/pro-components';
import {useState, Suspense} from 'react';
import IntroduceRow from './components/IntroduceRow';
import PageLoading from './components/PageLoading';
import Summary from './components/Summary';
import {Card, Col, FloatButton, Row} from "antd";
import {SyncOutlined} from "@ant-design/icons";
import DemoPie from "./components/Artificial";
import Interaction from "./components/Interaction";
import BackgroundScene from "./components/BackgroundScene";
import Mistake from "./components/Mistake";


const Analysis = () => {

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <GridContent>
      <>
        <Suspense fallback={<PageLoading/>}>
          <IntroduceRow key={refreshKey}/>
        </Suspense>
        <Row gutter={24}>
          <Col
            xl={16}
            lg={24}
            md={24}
            sm={24}
            xs={24}
            style={{
              marginBottom: 24,
            }}
          >
            <Summary key={refreshKey}/>
            <Card
              title="兜底场景"
              style={{
                marginTop: 24,
              }}
              bordered={false}
            >
              <BackgroundScene key={refreshKey}/>
            </Card>
          </Col>
          <Col
            xl={8}
            lg={12}
            sm={24}
            xs={24}
            style={{
              marginBottom: 24,
            }}
          >
            <Card
              title="人工异常"
              style={{
                marginBottom: 24,
              }}
              bordered={false}
            >
              <DemoPie key={refreshKey}/>
            </Card>
            <Card
              title="交互异常"
              style={{
                marginBottom: 24,
                marginTop: 4
              }}
              bordered={false}
            >
              <Interaction key={refreshKey}/>
            </Card>
            <Card
              title="错误异常"
              style={{
                marginBottom: 24,
                marginTop: 4
              }}
              bordered={false}
            >
              <Mistake key={refreshKey}/>
            </Card>
          </Col>
        </Row>
        {/*悬浮按钮*/}
        <FloatButton.Group shape="circle" style={{right: 24}}>
          <FloatButton icon={<SyncOutlined/>} onClick={handleRefresh}/>
        </FloatButton.Group>
      </>
    </GridContent>
  );
};
export default Analysis;
