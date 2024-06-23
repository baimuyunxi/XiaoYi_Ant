import React, {useEffect, useState} from "react";
import {Card, Skeleton} from "antd";
import useStyles from '../style.style';
import Trend from "@/pages/dashboard/analysis/components/SummaryTable/Trend";
import {Area} from "@ant-design/plots";
import {
  getArtificialExceptions,
  getInteractionAnomalies,
  getTheInterfaceIsAbnormal,
  getErrorException,
  getAbnormalHangUp,
  getBottomUpScenes
} from '../service';
import numeral from "numeral";


const Summary: React.FC = () => {

  const [loading, setLoading] = useState(true);

  // 转人工异常数据   转人工异常数据小图
  const [artificialData, setArtificialData] = useState({
    totalAmount: "",
    rateOfIncrease: "",
    smallIconDetails: [],
    iconDetails: [],
  });

  // 交互异常 各触点合并
  const [interactionData, setInteractionData] = useState({
    totalAmount: "",
    rateOfIncrease: "",
    iconDetails: [],
  });

  // 接口异常全量&小图
  const [theInterfaceData, setTheInterfaceData] = useState({
    totalAmount: "",
    rateOfIncrease: "",
    iconDetails: [],
  });

  // 错误异常
  const [errorData, setErrorData] = useState({
    totalAmount: "",
    rateOfIncrease: "",
    iconDetails: [],
  });

  // 异常挂机总量&小图
  const [abnormalData, setAbnormalData] = useState({
    totalAmount: "",
    rateOfIncrease: "",
    iconDetails: [],
  });

  // 兜底场景
  const [bottomUpData, setBottomUpData] = useState({
    totalAmount: "",
    rateOfIncrease: "",
    iconDetails: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response1 = await getArtificialExceptions({});
        if (response1.code !== '200') {
          new Error(response1.message || 'Failed to fetch data');
        }
        const processedArtificialData1 = {
          ...response1.data,
          smallIconDetails: response1.data.smallIconDetails.map(item => ({
            ...item,
            value: parseInt(item.value, 10),
          })),
        };
        setArtificialData(processedArtificialData1);

        const response2 = await getInteractionAnomalies({});
        if (response2.code !== '200') {
          new Error(response2.message || 'Failed to fetch data');
        }
        setInteractionData(response2.data);

        const response3 = await getTheInterfaceIsAbnormal({});
        if (response3.code !== '200') {
          new Error(response3.message || 'Failed to fetch data');
        }
        const processedArtificialData3 = {
          ...response3.data,
          iconDetails: response3.data.iconDetails.map(item => ({
            ...item,
            value: parseInt(item.value, 10),
          })),
        };
        setTheInterfaceData(processedArtificialData3);

        const response4 = await getErrorException({});
        if (response4.code !== '200') {
          new Error(response4.message || 'Failed to fetch data');
        }
        setErrorData(response4.data);

        const response5 = await getAbnormalHangUp({});
        if (response5.code !== '200') {
          new Error(response5.message || 'Failed to fetch data');
        }
        const processedArtificialData5 = {
          ...response5.data,
          iconDetails: response5.data.iconDetails.map(item => ({
            ...item,
            value: parseInt(item.value, 10),
          })),
        };
        setAbnormalData(processedArtificialData5);

        const response6 = await getBottomUpScenes({});
        if (response6.code !== '200') {
          new Error(response6.message || 'Failed to fetch data');
        }
        setBottomUpData(response6.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  const {styles} = useStyles();

  return (
    <>
      <Card title={'监控概览'}>
        <Card.Grid>
          <div>
            <h2>转人工异常</h2>
            <h3 style={{fontSize: '24px'}}>{loading ?
              <Skeleton.Input style={{width: 100}} active/> : numeral(artificialData.totalAmount).format('0,0')}</h3>
            {loading ? (
              <Skeleton active/>
            ) : (
              <Area
                xField="type"
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
                data={artificialData.smallIconDetails}
              />
            )}
            {/*<Trend*/}
            {/*  flag={loading ? null : (parseFloat(artificialData.rateOfIncrease) > 0 ? "up" : "down")}*/}
            {/*  style={{*/}
            {/*    marginRight: 16,*/}
            {/*    marginTop: 12,*/}
            {/*  }}*/}
            {/*>*/}
            {/*  2小时涨幅*/}
            {/*  {loading ?*/}
            {/*    <Skeleton.Input style={{width: 100}} active/> :*/}
            {/*    <span className={styles.trendText}>{artificialData.rateOfIncrease}&nbsp;%</span>}*/}
            {/*</Trend>*/}
          </div>
        </Card.Grid>
        <Card.Grid>
          <div>
            <h2>异常挂机</h2>
            <h3 style={{fontSize: '24px'}}>{loading ?
              <Skeleton.Input style={{width: 100}} active/> : numeral(abnormalData.totalAmount).format('0,0')}</h3>
            {loading ? (
              <Skeleton active/>
            ) : (
              <Area
                xField="type"
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
                data={abnormalData.iconDetails}
              />
            )}
            <Trend
              flag={loading ? null : (parseFloat(abnormalData.rateOfIncrease) > 0 ? "up" : "down")}
              style={{
                marginRight: 16,
                marginTop: 12,
              }}
            >
              2小时涨幅
              {loading ?
                <Skeleton.Input style={{width: 100}} active/> :
                <span className={styles.trendText}>{Math.abs(Number(abnormalData.rateOfIncrease))}%&nbsp;</span>}
            </Trend>
          </div>
        </Card.Grid>
        <Card.Grid>
          <div>
            <h2>接口异常</h2>
            <h3 style={{fontSize: '24px'}}>{loading ?
              <Skeleton.Input style={{width: 100}} active/> : numeral(theInterfaceData.totalAmount).format('0,0')}</h3>
            {loading ? (
              <Skeleton active/>
            ) : (
              <Area
                xField="type"
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
                data={theInterfaceData.iconDetails}
              />
            )}
            <Trend
              flag={loading ? null : (parseFloat(theInterfaceData.rateOfIncrease) > 0 ? "up" : "down")}
              style={{
                marginRight: 16,
                marginTop: 12,
              }}
            >
              2小时涨幅
              {loading ?
                <Skeleton.Input style={{width: 100}} active/> :
                <span className={styles.trendText}>{Math.abs(Number(theInterfaceData.rateOfIncrease))}%&nbsp;</span>}
            </Trend>
          </div>
        </Card.Grid>
        <Card.Grid>
          <div>
            <h2>交互异常</h2>
            <h3 style={{fontSize: '24px'}}>{loading ?
              <Skeleton.Input style={{width: 100}} active/> : numeral(interactionData.totalAmount).format('0,0')}</h3>
            <Trend
              flag={loading ? null : (parseFloat(interactionData.rateOfIncrease) > 0 ? "up" : "down")}
              style={{
                marginRight: 16,
                marginTop: 12,
              }}
            >
              2小时涨幅
              {loading ?
                <Skeleton.Input style={{width: 100}} active/> :
                <span className={styles.trendText}>{Math.abs(Number(interactionData.rateOfIncrease))}%&nbsp;</span>}
            </Trend>
          </div>
        </Card.Grid>
        <Card.Grid>
          <div>
            <h2>错误异常</h2>
            <h3 style={{fontSize: '24px'}}>{loading ?
              <Skeleton.Input style={{width: 100}} active/> : numeral(errorData.totalAmount).format('0,0')}</h3>
            <Trend
              flag={loading ? null : (parseFloat(errorData.rateOfIncrease) > 0 ? "up" : "down")}
              style={{
                marginRight: 16,
                marginTop: 12,
              }}
            >
              2小时涨幅
              {loading ?
                <Skeleton.Input style={{width: 100}} active/> :
                <span className={styles.trendText}>{Math.abs(Number(errorData.rateOfIncrease))}%&nbsp;</span>}
            </Trend>
          </div>
        </Card.Grid>
        <Card.Grid>
          <div>
            <h2>异常兜底</h2>
            <h3 style={{fontSize: '24px'}}>{loading ?
              <Skeleton.Input style={{width: 100}} active/> : numeral(bottomUpData.totalAmount).format('0,0')}
              </h3>
          </div>
        </Card.Grid>
      </Card>
    </>
  );

};

export default Summary;
