import React from "react";
import {Card} from "antd";
import useStyles from '../style.style';
import Trend from "@/pages/dashboard/analysis/components/SummaryTable/Trend";
import {Area, Column} from "@ant-design/plots";

// 模拟数据
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


const Summary = () => {

  const data = generateRandomData().slice(-24); // 选择最后36条数据

  const {styles} = useStyles();

  return (
    <>
      <Card title={'监控概览'}>
        <Card.Grid>
          <div>
            <h2>转人工异常</h2>
            <h3 style={{fontSize: '24px'}}>1234</h3>
            <Area
              xField="time"
              yField="value"
              shapeField="smooth"
              height={46}
              axis={false}
              style={{
                fill: 'linear-gradient(-90deg, #FFDEE9 100%, #B5FFFC 0%)',
                fillOpacity: 0.6,
                width: '100%',
              }}
              padding={-20}
              data={data}
            />
            <Trend
              flag="down"
              style={{
                marginRight: 16,
                marginTop: 12,
              }}
            >
              2小时涨幅
              <span className={styles.trendText}>12%</span>
            </Trend>
          </div>
        </Card.Grid>
        <Card.Grid>
          <div>
            <h2>异常挂机</h2>
            <h3 style={{fontSize: '24px'}}>1234</h3>
            <Area
              xField="time"
              yField="value"
              shapeField="smooth"
              height={46}
              axis={false}
              style={{
                fill: 'linear-gradient(-90deg, #FFDEE9 100%, #B5FFFC 0%)',
                fillOpacity: 0.6,
                width: '100%',
              }}
              padding={-20}
              data={data}
            />
            <Trend
              flag="down"
              style={{
                marginRight: 16,
                marginTop: 12,
              }}
            >
              2小时涨幅
              <span className={styles.trendText}>12%</span>
            </Trend>
          </div>
        </Card.Grid>
        <Card.Grid>
          <div>
            <h2>接口异常</h2>
            <h3 style={{fontSize: '24px'}}>1234</h3>
            <Area
              xField="time"
              yField="value"
              shapeField="smooth"
              height={46}
              axis={false}
              style={{
                fill: 'linear-gradient(-90deg, #FFDEE9 100%, #B5FFFC 0%)',
                fillOpacity: 0.6,
                width: '100%',
              }}
              padding={-20}
              data={data}
            />
            <Trend
              flag="down"
              style={{
                marginRight: 16,
                marginTop: 12,
              }}
            >
              2小时涨幅
              <span className={styles.trendText}>12%</span>
            </Trend>
          </div>
        </Card.Grid>
        <Card.Grid>
          <div>
            <h2>交互异常</h2>
            <h3 style={{fontSize: '24px'}}>1234</h3>
            <Trend
              flag="down"
              style={{
                marginRight: 16,
              }}
            >
              2小时涨幅
              <span className={styles.trendText}>12%</span>
            </Trend>
          </div>
        </Card.Grid>
        <Card.Grid>
          <div>
            <h2>错误异常</h2>
            <h3 style={{fontSize: '24px'}}>1234</h3>
            <Trend
              flag="up"
              style={{
                marginRight: 16,
              }}
            >
              2小时涨幅
              <span className={styles.trendText}>12%</span>
            </Trend>
          </div>
        </Card.Grid>
        <Card.Grid>
          <div>
            <h2>异常兜底</h2>
            <h3 style={{fontSize: '24px'}}>1234</h3>
            <Trend
              flag="up"
              style={{
                marginRight: 16,
              }}
            >
              2小时涨幅
              <span className={styles.trendText}>12%</span>
            </Trend>
          </div>
        </Card.Grid>
      </Card>
    </>
  );

};

export default Summary;
