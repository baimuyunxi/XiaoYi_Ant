import {DownloadOutlined, PlusOutlined, RollbackOutlined, SearchOutlined} from '@ant-design/icons';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Card, Col, DatePicker, Row, Space, Button, Table, Divider, ConfigProviderProps, Flex} from "antd";
import {PageContainer} from "@ant-design/pro-components";
import moment from "moment";
import useStyles from './style.style'
import {queryCallVolume, querySatisfaction} from './service'
import {useRequest} from "@umijs/max";
import * as XLSX from 'xlsx';

const {RangePicker} = DatePicker;

// 表头只支持列合并，使用 column 里的 colSpan 进行设置。
// 表格支持行/列合并，使用 render 里的单元格属性 colSpan 或者 rowSpan 设值为 0 时，设置的表格不会渲染。
// 合并数组单元格
const createNewArr = (data, columnIndexes) => {
  let result = [...data]; // Clone the original data to maintain immutability

  columnIndexes.forEach((columnIndex) => {
    let lastValue = null;
    let count = 0;

    // Temporarily store rowSpan values for the current column
    const rowSpanMap = new Map();

    // Calculate rowSpan values
    result.forEach((item, index) => {
      if (item[columnIndex] !== lastValue) {
        if (count > 0) {
          rowSpanMap.set(index - count, count); // Store the rowSpan for the first item in a sequence
        }
        lastValue = item[columnIndex];
        count = 1; // Reset count for the new value
      } else {
        count += 1; // Increment count for identical sequential values
        rowSpanMap.set(index, 0); // Subsequent items in a sequence get a rowSpan of 0
      }

      // Handle the last sequence in the data
      if (index === result.length - 1 && count > 0) {
        rowSpanMap.set(index - count + 1, count);
      }
    });

    // Apply rowSpan values to the result
    result = result.map((item, index) => ({
      ...item,
      [`${columnIndex}RowSpan`]: rowSpanMap.get(index) || 0,
    }));
  });

  return result;
};

const notifications: React.FC = () => {
  // 自定义样式引用
  const {styles} = useStyles();

  // 禁用今天之后的日期
  const disabledDate = (current: moment.Moment) => {
    return current && current.isAfter(moment().endOf('day'));
  };

  // 时间初始化
  const [dates, setDates] = useState<[moment.Moment, moment.Moment]>(() => {
    const yesterdayStart = moment().subtract(1, 'days').startOf('day');
    const yesterdayEnd = moment().subtract(1, 'days').endOf('day');
    return [yesterdayStart, yesterdayEnd];
  });
  const [comparisonDates, setComparisonDates] = useState<[moment.Moment, moment.Moment]>();

  // 环比时间计算
  useEffect(() => {
    if (dates) {
      const startComparisonDate = dates[0].clone().subtract(1, 'month');
      const endComparisonDate = dates[1].clone().subtract(1, 'month');
      setComparisonDates([startComparisonDate, endComparisonDate]);
    }
  }, [dates]);

  // 动态表头
  const formatDateRange = (dates) => {
    if (!dates || dates.length !== 2) return "日期";
    const startDate = dates[0].format("YYYY-MM-DD");
    const endDate = dates[1].format("YYYY-MM-DD");
    return startDate === endDate ? startDate : `${startDate} -- ${endDate}`;
  };

  // 点击查询按钮时触发的函数
  const {loading: searchDataLoading, run: runSearch} = useRequest(
    async () => {
      try {
        // 从状态中获取时间范围
        const day_ids = dates[0].format("YYYY-MM-DD HH:mm:ss");
        const day_ide = dates[1].format("YYYY-MM-DD HH:mm:ss");
        const last_day_ids = comparisonDates[0].format("YYYY-MM-DD HH:mm:ss");
        const last_day_ide = comparisonDates[1].format("YYYY-MM-DD HH:mm:ss");

        // 调用API
        const callVolumeResponse = await queryCallVolume({day_ids, day_ide, last_day_ids, last_day_ide});
        const satisfactionResponse = await querySatisfaction({day_ids, day_ide, last_day_ids, last_day_ide});

        // 响应体打印
        console.log("Call Volume Response:", callVolumeResponse);
        console.log("Satisfaction Response:", satisfactionResponse);

        // 处理API响应
        // ...
      } catch (e) {
        console.error("Error fetching data:", e)
      }
    },
    {
      manual: true, // 手动触发请求
    }
  );

  const [dataLoaded, setDataLoaded] = useState(false);

  // 使用useEffect在组件加载时调用函数
  useEffect(() => {
    // 延迟
    setTimeout(() => {
      setDataLoaded(true);
    }, 1000);

    // 当数据加载完成后调用 runSearch
    if (dataLoaded) {
      runSearch();
    }
  }, [dataLoaded]);

  // 模拟数据信息
  const mockHrData = [{}];
  const mockMydData = [{}];

  // 呼叫量数据表头
  const processedData = createNewArr(mockHrData, ["hrSpecialArea"]);
  const hrDataColumns = [
    {
      title: '类型',
      children: [
        {
          title: '专区',
          dataIndex: "hrSpecialArea",
          align: "center",
          width: 120,
          onCell: (record) => ({
            rowSpan: record.hrSpecialAreaRowSpan,
          }),
        },
        {
          title: '触点',
          dataIndex: "hrContactPoint",
          align: "center",
          width: 110
        },
      ]
    },
    {
      title: formatDateRange(dates),
      dataIndex: "hrDate",
      align: "center",
      width: 130,
    },
    {
      title: "环比",
      dataIndex: "hrChains",
      align: "center",
      width: 120,
      render: (text, record, index) => {
        const rowIndex = index + 1;
        const value = parseFloat(text); // 将文本转换为浮点数
        const absValue = Math.abs(value);
        let displayText = text; // 默认显示文本
        // 根据数值的正负和绝对值大小改变颜色
        let style = {};
        // 仅对行号是3的倍数的行进行颜色处理
        if (rowIndex % 3 === 0) {
          if (value < 0 && absValue > 1) {
            // 负数且绝对值大于1，以红色显示
            style = {color: 'red', fontWeight: 'bold'};
          } else if (value > 0 && absValue > 1) {
            // 正数且绝对值大于1，以绿色显示
            style = {color: 'green', fontWeight: 'bold'};
          }
        }

        return <span style={style}>{displayText}</span>;
      }
    },
    {
      title: "备注",
      dataIndex: "hrRemarks",
      align: "center"
    }
  ]

  // 满意度数据表头
  const processedDataCombined = createNewArr(mockMydData, ["mydChannel", "mydContactPoint", "mydDate", "mydChains"]);
  // console.log(processedDataCombined)
  const mydDataColumns = [
    {
      title: '指标',
      children: [
        {
          title: '渠道',
          dataIndex: "mydChannel",
          align: "center",
          width: 110,
          onCell: (record) => ({
            rowSpan: record.mydChannelRowSpan,
          }),
        },
        {
          title: '触点',
          dataIndex: "mydContactPoint",
          align: "center",
          width: 80,
          onCell: (record) => ({
            rowSpan: record.mydContactPointRowSpan,
          }),
        },
      ]
    },
    {
      title: formatDateRange(dates),
      dataIndex: "mydDate",
      align: "center",
      width: 130,
      onCell: (record) => ({
        rowSpan: record.mydDateRowSpan,
      }),
    },
    {
      title: "环比",
      dataIndex: "mydChains",
      align: "center",
      width: 120,
      onCell: (record) => ({
        rowSpan: record.mydChainsRowSpan,
      }),
    },
    {
      title: "备注",
      dataIndex: "mydRemarks",
      align: "center"
    },
  ];

  // 合并呼叫量数据和满意度数据导出函数
  const exportToExcelMain = () => {
    // 创建一个新的工作簿
    const wb = XLSX.utils.book_new();

    // 处理第一个数据表（呼叫量数据）
    const ws1 = XLSX.utils.json_to_sheet(processedData.map(item => {
      return {
        "专区": item.hrSpecialArea, // 示例：假设你想将'hrSpecialArea'作为'专区'
        "触点": item.hrContactPoint, // 类似的，映射每个字段
        "日期": item.hrDate,
        "环比": item.hrChains,
        "备注": item.hrRemarks || "", // 使用 || "" 处理undefined或null
      }
    }), {header: ["专区", "触点", "日期", "环比", "备注"], skipHeader: false});
    XLSX.utils.book_append_sheet(wb, ws1, "呼叫量数据");

    // 处理第二个数据表（满意度数据）
    const ws2 = XLSX.utils.json_to_sheet(processedDataCombined.map(item => {
      return {
        "渠道": item.mydChannel,
        "触点": item.mydContactPoint,
        "日期": item.mydDate,
        "环比": item.mydChains,
        "备注": item.mydRemarks || "",
      }
    }), {header: ["渠道", "触点", "日期", "环比", "备注"], skipHeader: false});
    XLSX.utils.book_append_sheet(wb, ws2, "满意度数据");

    // 使用moment获取当前时间，并格式化为YYYYMMDDHHmmss
    const currentDateTime = moment().format('YYYYMMDD');
    // 构造文件名，格式为 dayNewXXX.xlsx，XXX是当前时间
    const fileName = `DayNew${formatDateRange(dates)}.xlsx`;

    // 导出Excel文件
    XLSX.writeFile(wb, fileName);
  };


  /**
   * 详情页面钻取等配置
   */
  const rgTabListNoTitle = [
    {
      key: 'rgSence',
      label: '场景'
    },
    {
      key: 'rgActive',
      label: '主动'
    },
    {
      key: 'rgRejection',
      label: '拒识'
    },
  ];

  const hydTabListNoTitle = [
    {
      key: 'hydOverall',
      label: '整体'
    },
    {
      key: 'mydSms',
      label: '短信'
    },
    {
      key: 'mydWechat',
      label: '微信'
    },
  ];

  /**
   * 动态卡片切换实现
   */
  const [currentCard, setCurrentCard] = useState('overview');
  const showCard = (cardName) => {
    setCurrentCard(cardName);
  };

  /**
   * 满意度相关详情处理
   */
  const mydDetailTableHead = [
    {
      title: '场景',
      dataIndex: "mydDetailSense",
      align: "center",
    },
    {
      title: '发送量',
      children: [
        {
          title: '本期',
          dataIndex: "mydDetailSendB",
          align: "center",
        },
        {
          title: '上期',
          dataIndex: "mydDetailSendS",
          align: "center",
        },
      ]
    },
    {
      title: '参评量',
      children: [
        {
          title: '本期',
          dataIndex: "mydDetailSendB",
          align: "center",
        },
        {
          title: '上期',
          dataIndex: "mydDetailSendS",
          align: "center",
        },
      ]
    },
    {
      title: '满意量',
      children: [
        {
          title: '本期',
          dataIndex: "mydDetailSendB",
          align: "center",
        },
        {
          title: '上期',
          dataIndex: "mydDetailSendS",
          align: "center",
        },
      ]
    },
    {
      title: '一般量',
      children: [
        {
          title: '本期',
          dataIndex: "mydDetailSendB",
          align: "center",
        },
        {
          title: '上期',
          dataIndex: "mydDetailSendS",
          align: "center",
        },
      ]
    },
    {
      title: '不满意量',
      children: [
        {
          title: '本期',
          dataIndex: "mydDetailDisRateB",
          align: "center",
        },
        {
          title: '上期',
          dataIndex: "mydDetailDisRateS",
          align: "center",
        },
      ]
    },
    {
      title: '满意率',
      children: [
        {
          title: '本期',
          dataIndex: "mydDetailSatRateB",
          align: "center",
        },
        {
          title: '上期',
          dataIndex: "mydDetailSatRateS",
          align: "center",
        },
      ]
    },
    {
      title: "影响整体满意度",
      dataIndex: "mydDetailEffect",
      align: "center",
    }
  ];


  /**
   * 呼入相关详情处理
   */


  return (
    <PageContainer>
      <Card title="时间选择">
        <Space direction='vertical' size={12}>
          <Row align={"middle"} gutter={16} wrap={false}>
            <Col className={styles.labelColWithPadding}>
              <span>时间：</span>
            </Col>
            <Col className={styles.pickerCol}>
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                defaultValue={dates}
                onCalendarChange={(vals) => setDates(vals as [moment.Moment, moment.Moment])}
                disabledDate={disabledDate}
              />
            </Col>
            <Col className={styles.labelColWithPadding}>
              <span>环比时间：</span>
            </Col>
            <Col className={styles.pickerCol}>
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={comparisonDates}
                onCalendarChange={(vals) => setComparisonDates(vals as [moment.Moment, moment.Moment])}
              />
            </Col>
            <Col className={styles.buttonCol}>
              <Button
                type="primary"
                icon={<SearchOutlined/>}
                onClick={runSearch}
                loading={searchDataLoading}
              >
                查询
              </Button>
            </Col>
          </Row>
        </Space>
      </Card>
      <div style={{marginTop: 12}}/>
      <Card>
        <Row justify="space-between" align="middle" gutter={16}>
          <Col>
            <Flex gap="small" wrap="wrap">
              <Button
                onClick={() => showCard('callVolume')}
                disabled={currentCard === 'callVolume'}
              >呼入
              </Button>
              <Button
                onClick={() => showCard('satisfaction')}
                disabled={currentCard === 'satisfaction'}
              >满意度
              </Button>
            </Flex>
          </Col>
          <Col>
            <Button
              className={styles.greenButton}
              type="dashed"
              icon={<RollbackOutlined/>}
              disabled={currentCard === 'overview'}
              onClick={() => showCard('overview')}
            >返回
            </Button>
          </Col>
        </Row>
      </Card>
      <div style={{marginTop: 12}}/>
      {currentCard === 'callVolume' && (
        <Card
          title={"呼入详情"}
          style={{width: '100%'}}
          tabList={rgTabListNoTitle}
          tabProps={{
            size: 'middle',
          }}
          tabBarExtraContent={
            <Button type="primary" shape="round" icon={<DownloadOutlined/>}/>
          }
        >
        </Card>
      )}
      {currentCard === 'satisfaction' && (
        <Card
          title={"满意度详情"}
          style={{width: '100%'}}
          tabList={hydTabListNoTitle}
          tabProps={{
            size: 'middle',
          }}
          tabBarExtraContent={
            <Button type="primary" shape="round" icon={<DownloadOutlined/>}/>
          }
        >
          <Table columns={mydDetailTableHead}/>
        </Card>
      )}
      {/*日报卡片*/}
      {currentCard === 'overview' && (
        <Card>
          <Space direction={"vertical"} size={12} style={{width: '100%'}}/>
          <Row justify="space-between" align="middle" gutter={16}>
            <Col>
              <h1 className={styles.noMarginH1}>概览</h1>
            </Col>
            <Col>
              <Button type="primary" shape="round" icon={<DownloadOutlined/>}
                      onClick={exportToExcelMain}/>
            </Col>
          </Row>
          <Divider/>
          <Table columns={hrDataColumns} dataSource={processedData} bordered={true} pagination={false}
                 size={"small"} title={() => <h3>呼叫量数据</h3>}
          />
          <Divider/>
          <Table columns={mydDataColumns} dataSource={processedDataCombined} bordered={true} pagination={false}
                 size={"small"} title={() => <h3>满意度数据</h3>}/>
        </Card>
      )}
    </PageContainer>
  );
};


export default notifications;
