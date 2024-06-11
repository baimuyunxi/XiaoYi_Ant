import {GridContent} from '@ant-design/pro-components';
import {Card, Col, Row, Tooltip} from 'antd';
import React, {FC, useState} from 'react';
import ActiveChart from './components/ActiveChart';
import Map from './components/Map';
import {InfoCircleOutlined, SyncOutlined} from '@ant-design/icons';
import ColumnChart from "./components/Error";
import {FloatButton} from 'antd';

const InterfaceComment = () => (
  <div>
    <p>异常场景统计口径：<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;失败量占比 = 场景的总调用量 / 场景的调用失败量<br/>
      &nbsp;&nbsp;&nbsp;&nbsp;为N量占比 = 场景的总调用量 / 场景的调用为N量</p>
  </div>
);

const ProcessException = () => ('');

const ButtonException = () => (
  <div>
    <p>异常超时：同一通通话中识别超时4次以上</p>
    <p>异常按键错误：同一通通话中别结果为按键错误4次以上</p>
    <p>异常拒识：同一通通话中命中拒识意图4次以上</p>
    <p>异常超时&拒识：同一通通话中识别结果为超时或拒识7次以上</p>
  </div>
);

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
            <Card title="接口异常" bordered={false}
                  extra={
                    <Tooltip title={InterfaceComment}>
                      <InfoCircleOutlined/>
                    </Tooltip>}
            >
              <Map key={refreshKey}/>
            </Card>
          </Col>
          <Col
            xl={24}
            lg={24}
            md={24}
            sm={24}
            xs={24}
            style={{
              marginBottom: 24,
            }}>
            <Card
              title="流程异常"
              bordered={false}
              extra={
                <Tooltip title={ProcessException}>
                  <InfoCircleOutlined/>
                </Tooltip>}
            >
              <ActiveChart key={refreshKey}/>
            </Card>
          </Col>
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
            <Card title="错误异常" bordered={false} extra={
              <Tooltip title={ButtonException}>
                <InfoCircleOutlined/>
              </Tooltip>}>
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
