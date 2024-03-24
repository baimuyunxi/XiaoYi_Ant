import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Card, Col, DatePicker, Row, Space, Button, Table, Divider} from "antd";
import {PageContainer} from "@ant-design/pro-components";
import moment from "moment";
import useStyles from './style.style'
import {TableCallVolumeData, TableSatisfactionData} from './data'
import {queryCallVolume, querySatisfaction} from './service'
import {useRequest} from "@umijs/max";

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

  const mockHrData = [
    {
      key: '1',
      hrSpecialArea: '10000号整体',
      hrContactPoint: '总呼入量',
      hrDate: "342342",
      hrChains: '-0.74',
    },
    {
      key: '2',
      hrSpecialArea: '10000号整体',
      hrContactPoint: '人工呼入量',
      hrDate: "12342",
      hrChains: '-5.44',
    },
    {
      key: '3',
      hrSpecialArea: '10000号整体',
      hrContactPoint: '转人工占比',
      hrDate: "29.84",
      hrChains: '-1.7',
    },
    {
      key: '4',
      hrSpecialArea: '互联网卡专区',
      hrContactPoint: '总呼入量',
      hrDate: "342322",
      hrChains: '-0.74',
    },
    {
      key: '5',
      hrSpecialArea: '互联网卡专区',
      hrContactPoint: '人工呼入量',
      hrDate: "1232",
      hrChains: '-4.4',
    },
    {
      key: '6',
      hrSpecialArea: '互联网卡专区',
      hrContactPoint: '转人工占比',
      hrDate: "3",
      hrChains: '1.74',
    },
    {
      key: '7',
      hrSpecialArea: '涉诈专区',
      hrContactPoint: '总呼入量',
      hrDate: "342",
      hrChains: '-0.4',
    },
    {
      key: '8',
      hrSpecialArea: '涉诈专区',
      hrContactPoint: '人工呼入量',
      hrDate: "42",
      hrChains: '-5.44',
    },
    {
      key: '9',
      hrSpecialArea: '涉诈专区',
      hrContactPoint: '转人工占比',
      hrDate: "2",
      hrChains: '-0.74',
    },
  ];

  const mockMydData = [
    {
      key: '1',
      mydChannel: '短信满意度',
      mydContactPoint: '参评量',
      mydDate: '1',
      mydChains: '2',
    },
    {
      key: '2',
      mydChannel: '短信满意度',
      mydContactPoint: '参评量',
      mydDate: '1',
      mydChains: '4',
    },
    {
      key: '3',
      mydChannel: '短信满意度',
      mydContactPoint: '满意率',
      mydDate: '5',
      mydChains: '6',
    },
    {
      key: '4',
      mydChannel: '在线满意度',
      mydContactPoint: '参评量',
      mydDate: '7',
      mydChains: '8',
    },
    {
      key: '5',
      mydChannel: '在线满意度',
      mydContactPoint: '参评量',
      mydDate: '9',
      mydChains: '10',
    },
    {
      key: '6',
      mydChannel: '在线满意度',
      mydContactPoint: '满意率',
      mydDate: '11',
      mydChains: '12',
    },
    {
      key: '7',
      mydChannel: '微信满意度',
      mydContactPoint: '参评量',
      mydDate: '13',
      mydChains: '14',
    },
    {
      key: '8',
      mydChannel: '微信满意度',
      mydContactPoint: '参评量',
      mydDate: '15',
      mydChains: '16',
    },
    {
      key: '9',
      mydChannel: '微信满意度',
      mydContactPoint: '满意率',
      mydDate: '17',
      mydChains: '18',
    },
    {
      key: '10',
      mydChannel: '整体满意度',
      mydContactPoint: '参评量',
      mydDate: '18',
      mydChains: '19',
    },
    {
      key: '11',
      mydChannel: '整体满意度',
      mydContactPoint: '参评量',
      mydDate: '19',
      mydChains: '20',
    },
    {
      key: '12',
      mydChannel: '整体满意度',
      mydContactPoint: '满意率',
      mydDate: '21',
      mydChains: '22',
    },
  ];

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
      width: 130
    },
    {
      title: "环比",
      dataIndexL: "hrChains",
      align: "center",
      width: 120
    },
    {
      title: "备注",
      dataIndex: "hrRemarks",
      align: "center"
    }
  ]

  // 满意度数据表头
  // const processedDataCombined = createNewArr(mockMydData, "mydChannel");
  const processedDataCombined = createNewArr(mockMydData, ["mydChannel", "mydContactPoint","mydDate"]);
  console.log(processedDataCombined)

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
      dataIndexL: "mydChains",
      align: "center",
      width: 120
    },
    {
      title: "备注",
      dataIndex: "mydRemarks",
      align: "center"
    }
  ];

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
        <Space direction={"vertical"} size={12}/>
        <h3>呼叫量数据</h3>
        <Space direction={"vertical"} size={12}/>
        <Table columns={hrDataColumns} dataSource={processedData} bordered={true} pagination={false}/>
        <Divider/>
        <h3>满意度数据</h3>
        <Table columns={mydDataColumns} dataSource={processedDataCombined} bordered={true} pagination={false}/>
      </Card>
    </PageContainer>
  );
};


export default notifications;
