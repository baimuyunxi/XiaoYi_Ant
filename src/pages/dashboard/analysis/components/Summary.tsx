import React from "react";
import {Card} from "antd";
import useStyles from '../style.style';
import Trend from "@/pages/dashboard/analysis/components/SummaryTable/Trend";


const Summary = () => {

  const {styles} = useStyles();

  return (
    <>
      <Card title={'监控概览'}>
        <Card.Grid>
          <div>
            <h2>错误异常</h2>
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
            <h2>流程异常</h2>
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
            <h2>转人工异常</h2>
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
            <h2>接口异常</h2>
            <h3 style={{fontSize:'24px'}}>1234</h3>
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
