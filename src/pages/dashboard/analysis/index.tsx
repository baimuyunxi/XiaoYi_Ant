import {GridContent} from '@ant-design/pro-components';
import {useState, Suspense, useEffect} from 'react';
import IntroduceRow from './components/IntroduceRow';
import PageLoading from './components/PageLoading';
import Summary from './components/Summary';
import {Card, Col, Row} from "antd";
import DemoPie from "./components/Artificial";
import Interaction from "./components/Interaction";
import BackgroundScene from "./components/BackgroundScene";
import Mistake from "./components/Mistake";


const Analysis = () => {


  return (
    <GridContent>
      <>
        <Suspense fallback={<PageLoading/>}>
          <IntroduceRow/>
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
            <div>
              <Summary/>
            </div>
            <Card
              title="兜底场景"
              style={{
                marginTop: 24,
              }}
              bordered={false}
            >
              <BackgroundScene/>
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
              <DemoPie/>
            </Card>
            <Card
              title="交互异常"
              style={{
                marginBottom: 24,
                marginTop: 4
              }}
              bordered={false}
            >
              <Interaction/>
            </Card>
            <Card
              title="错误异常"
              style={{
                marginBottom: 24,
                marginTop: 4
              }}
              bordered={false}
            >
              <Mistake/>
            </Card>
          </Col>
        </Row>
      </>
    </GridContent>
  );
};
export default Analysis;
