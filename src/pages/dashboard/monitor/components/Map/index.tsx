import React, {useEffect, useRef, useState} from 'react';
import {Area, DualAxes} from '@antv/g2plot';
import {Radio, Col, Row, Statistic, Table, Divider, message} from "antd";
import numeral from "numeral";
import useStyles from "@/pages/dashboard/monitor/style.style";
import {getPortAbnormal} from "../../service";

const DemoArea = () => {
  const {styles} = useStyles();
  const containerRef = useRef(null);
  const containerRefBar = useRef(null);
  const [chart, setChart] = useState(null);
  const [position, setPosition] = useState('start');
  const [figure, setFigure] = useState('port');
  const [loading, setLoading] = useState(true);
  const [portData, setPortData] = useState({
    allNumber: "0",
    failedNumber: "0",
    nullNumber: "0",
    interfaceIcon: [],
    errNumber: "0",
    nodeIcon: [],
    portTableData: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getPortAbnormal({});
        if (response.code !== '200') {
          new Error(response.message || 'Failed to fetch data');
        }

        const processedArtificialData = {
          ...response.data,
          interfaceIcon: response.data.interfaceIcon.map(item => ({
            ...item,
            value: parseInt(item.value, 10),
          })),
          nodeIcon: response.data.nodeIcon.map(item => ({
            ...item,
            value: parseInt(item.value, 10),
          })),
        };
        setPortData(processedArtificialData);
        setLoading(false);
      } catch (error) {
        message.error(`Error: ${error.message}`);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const createChart = () => {
        if (chart) {
          try {
            chart.destroy();
          } catch (error) {
            console.error('Error destroying chart:', error);
          }
        }

        let newChart;
        if (figure === 'port') {
          const totalLength = portData.interfaceIcon.length;
          const visibleDataPoints = 11;
          const start = (totalLength - visibleDataPoints) / totalLength;
          newChart = new Area(containerRef.current, {
            data: portData.interfaceIcon,
            isStack: true,
            xField: 'line',
            yField: 'value',
            seriesField: 'type',
            slider: {
              start,
              end: 1,
            },
            color: ({type}) => {
              const colors = {
                '失败': '#FFCCCC',
                '为N': '#80a4c9',
              };
              return colors[type];
            },
          });
        } else if (figure === 'node') {
          const sortedNodeIcon = portData.nodeIcon
            .map(item => ({
              ...item,
              totalValue: item.valueN + item.valueC
            }))
            .sort((a, b) => a.totalValue - b.totalValue);

          const totalLength = sortedNodeIcon.length;
          const visibleDataPoints = 11;
          const start = (totalLength - visibleDataPoints) / totalLength;
          newChart = new DualAxes(containerRefBar.current, {
            data: [sortedNodeIcon, sortedNodeIcon],
            autoHide: true,
            xField: 'line',
            yField: ['valueC', 'valueN'],
            legend: {
              position: 'top',
            },
            geometryOptions: [
              {
                geometry: 'column',
              },
              {
                geometry: 'line',
                lineStyle: {
                  lineWidth: 2,
                },
              },
            ],
            slider: {
              start,
              end: 1,
            },
          });
        }

        newChart.render();
        setChart(newChart);
      };

      if ((figure === 'port' && containerRef.current) || (figure === 'node' && containerRefBar.current)) {
        createChart();
      }

      return () => {
        if (chart) {
          try {
            chart.destroy();
          } catch (error) {
            console.error('Error destroying new chart:', error);
          }
        }
      };
    }
  }, [figure, portData, loading]);

  const columns = [{
    title: '接口名称',
    dataIndex: 'interFaceName',
    width: 135,
    ellipsis: true,
  }, {
    title: '调用量',
    dataIndex: 'sumCount',
    sorter: (a, b) => a.sumCount - b.sumCount,
  }, {
    title: position === 'start' ? '失败量' : '失败量占比',
    dataIndex: position === 'start' ? 'error_count' : 'errorPercentage',
    sorter: position === 'start' ? (a, b) => a.error_count - b.error_count : (a, b) => a.errorPercentage - b.errorPercentage,
  }, {
    title: position === 'start' ? '为N量' : '为N量占比',
    dataIndex: position === 'start' ? 'null_count' : 'nullPercentage',
    sorter: position === 'start' ? (a, b) => a.null_count - b.null_count : (a, b) => a.nullPercentage - b.nullPercentage,
  }, {
    title: '异常总量',
    dataIndex: 'all_count',
    sorter: (a, b) => a.all_count - b.all_count,
  }];

  return (
    <>
      <Row gutter={24}>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="接口总调用量" suffix="次" value={numeral(portData.allNumber).format('0,0')}/>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic
            title="异常总量"
            suffix={
              <span>
                次 <span style={{
                fontSize: '0.8em',
                color: 'rgba(241,41,41,0.8)'
              }}>{`(${((parseFloat(portData.errNumber) / parseFloat(portData.allNumber)) * 100).toFixed(2)}%)`}</span>
              </span>
            }
            value={numeral(portData.errNumber).format('0,0')}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="调用失败量" suffix="次" value={numeral(portData.failedNumber).format('0,0')}/>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Statistic title="返回为N量" suffix="次" value={numeral(portData.nullNumber).format('0,0')}/>
        </Col>
        <Col
          xl={16}
          lg={16}
          md={24}
          sm={24}
          xs={24}
          style={{
            marginBottom: 24,
          }}
        >
          <div className={styles.mapChart}>
            <div ref={containerRef}
                 style={{width: '100%', height: '100%', display: figure === 'port' ? 'block' : 'none'}}/>
            <div ref={containerRefBar}
                 style={{width: '100%', height: '100%', display: figure === 'node' ? 'block' : 'none'}}/>
          </div>
        </Col>
        <Col
          xl={8}
          lg={16}
          md={24}
          sm={24}
          xs={24}
          style={{
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div className={styles.mapChart}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h3>异常接口</h3>
              <Radio.Group value={position} onChange={(e) => setPosition(e.target.value)}>
                <Radio.Button value="start">数值</Radio.Button>
                <Radio.Button value="end">占比</Radio.Button>
              </Radio.Group>
            </div>
            <div>
              <Table<any>
                rowKey={(record) => record.index}
                size="small"
                columns={columns}
                dataSource={portData.portTableData}
                loading={loading}
                pagination={{
                  style: {
                    marginBottom: 12,
                  },
                  pageSize: 5,
                }}
              />
            </div>
            <div style={{textAlign: 'left', position: 'absolute', bottom: 0, left: 0}}>
              <Divider/>
              <Radio.Group value={figure} onChange={(e) => setFigure(e.target.value)}>
                <Radio.Button value="port">接口</Radio.Button>
                <Radio.Button value="node">节点</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default DemoArea;
