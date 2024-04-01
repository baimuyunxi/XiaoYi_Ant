import {DownloadOutlined, FileSearchOutlined, PlusOutlined, RollbackOutlined, SearchOutlined} from '@ant-design/icons';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Highlighter from 'react-highlight-words';
import {
  Card,
  Col,
  DatePicker,
  Row,
  Space,
  Button,
  Table,
  Divider,
  ConfigProviderProps,
  Flex,
  message,
  Input
} from "antd";
import {PageContainer} from "@ant-design/pro-components";
import moment from "moment";
import useStyles from './style.style'
import {
  queryCallVolume,
  queryCallSense,
  querySatisfaction,
  queryCallSenseDetail,
  queryCallInitiative,
  queryCallInitiativeDetail,
  queryCallRejection,
  queryCallRejectionDetail,
  querySatOverall,
  querySatMes,
  querySatChat,
  querySatDetail
} from './service'
import {useRequest} from "@umijs/max";
import * as XLSX from 'xlsx';

const {RangePicker} = DatePicker;

// 表头只支持列合并，使用 column 里的 colSpan 进行设置。
// 表格支持行/列合并，使用 render 里的单元格属性 colSpan 或者 rowSpan 设值为 0 时，设置的表格不会渲染。
// 合并数组单元格
const createNewArr = (data, columnIndexes) => {
  let result = [...data]; // 克隆原始数据以保持不变性

  columnIndexes.forEach((columnIndex) => {
    let lastValue = null;
    let count = 0;

    // 临时存储当前列的 rowSpan 值
    const rowSpanMap = new Map();

    // 计算 rowSpan 值
    result.forEach((item, index) => {
      if (item[columnIndex] !== lastValue) {
        if (count > 0) {
          rowSpanMap.set(index - count, count); // 按顺序存储第一项的 rowSpan
        }
        lastValue = item[columnIndex];
        count = 1; // 重置新值的计数
      } else {
        count += 1; // 相同顺序值的增量计数
        rowSpanMap.set(index, 0); // 序列中的后续项的 rowSpan 为 0
      }

      // 处理数据中的最后一个序列
      if (index === result.length - 1 && count > 0) {
        rowSpanMap.set(index - count + 1, count);
      }
    });

    // 将 rowSpan 值应用于结果
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

  // 主表
  const [processedData, setProcessedData] = useState([]); // 呼叫量数据

  const [processedDataCombined, setProcessedDataCombined] = useState([]); // 满意度数据
  // 人工呼入详情
  const [hrdOverallData, setHrdOverallData] = useState([]);  // 场景
  const [hrdMessageData, setHrdMessageData] = useState([]);  // 主动
  const [hrdChatData, setHrdChatData] = useState([]);  // 拒识
  // 满意度详情
  const [mydChatData, setMydChatData] = useState([]); // 微信
  const [mydMessageData, setMydMessageData] = useState([]); // 短信
  const [mydOverallData, setMydOverallData] = useState([]); // 整体

  const [loadingChat, setLoadingChat] = useState(false); // 表格加载状态定义

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

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

  // 模拟数据信息
  const mockHrData = [{}];

  /**
   * API 调用处理
   */

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
          // const callVolumeResponse = await queryCallVolume({day_ids, day_ide, last_day_ids, last_day_ide});
          const satisfactionResponse = await querySatisfaction({day_ids, day_ide, last_day_ids, last_day_ide});

          // 响应体打印
          // console.log("Call Volume Response:", callVolumeResponse);
          console.log("Satisfaction Response:", satisfactionResponse);

          // 处理API响应
          if (satisfactionResponse.code === '200') {
            const newData = createNewArr(satisfactionResponse.data, ["mydChannel", "mydContactPoint", "mydRemarks"]);
            setProcessedDataCombined(newData);
            // const processedData = createNewArr(mockHrData, ["hrSpecialArea", "hrRemarks"]);

          } else {
            console.error('获取数据失败:', satisfactionResponse.message);
            message.error('获取满意度数据失败');
          }
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

  // 呼叫量数据表头
  // const processedData = createNewArr(mockHrData, ["hrSpecialArea"]);
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
  // const processedDataCombined = createNewArr(mockMydData, ["mydChannel", "mydContactPoint", "mydDate", "mydChains"]);
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
    },
    {
      title: "环比",
      dataIndex: "mydChains",
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
        if (rowIndex % 2 === 0) {
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
      dataIndex: "mydRemarks",
      align: "center",
      onCell: (record) => ({
        rowSpan: record.mydRemarksRowSpan,
      }),
    },
  ];

  /**
   * 文件功能导出区
   */
    // 合并呼叫量数据和满意度数据导出函数
  const {loading: setExportToLoading, run: exportToExcelMain} = useRequest(
      async () => {
        const wb = XLSX.utils.book_new();

        // 处理第一个数据表（呼叫量数据）
        const ws1 = XLSX.utils.json_to_sheet(processedData.map(item => {
          return {
            "专区": item.hrSpecialArea,
            "触点": item.hrContactPoint, // 映射每个字段
            "日期": item.hrDate,
            "环比": item.hrChains,
            "备注": item.hrRemarks || "", // 使用 || "" 处理undefined或null
          }
        }), {header: ["专区", "触点", formatDateRange(dates), "环比", "备注"], skipHeader: false});
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

        // 使用moment获取当前时间，并格式化为YYYYMMDD
        // const currentDateTime = moment().format('YYYYMMDD');
        const fileName = `DayNew${formatDateRange(dates)}.xlsx`;

        XLSX.writeFile(wb, fileName);

      },
      {
        manual: true, // 表示手动触发异步操作
      }
    )


  // 满意度详情维度展示导出
  const {loading: setExportToExcelSat, run: exportToExcelSatisfaction} = useRequest(
    async () => {
      const wb = XLSX.utils.book_new();

      // 将嵌套的表头转换为一维数组
      const flatColumns = mydDetailTableHead.reduce((acc, item) => {
        if (item.children) {
          return [...acc, ...item.children.map(child => ({...child, title: `${item.title} ${child.title}`}))];
        }
        return [...acc, item];
      }, []);

      const ws = XLSX.utils.json_to_sheet(mydTableData.map(item => {
        const row = {};
        flatColumns.forEach(col => {
          row[col.title] = item[col.dataIndex];
        });
        return row;
      }), {header: flatColumns.map(col => col.title), skipHeader: false});

      XLSX.utils.book_append_sheet(wb, ws, "满意度数据");

      const currentDateTime = moment().format('YYYYMMDD');
      const fileName = `detail${currentDateTime}.xlsx`;

      XLSX.writeFile(wb, fileName);
    },
    {
      manual: true, // 表示手动触发异步操作
    }
  )


  // 呼入详情维度展示导出
  const exportToExcelCallVolume = () => {
    const wb = XLSX.utils.book_new();

    // 处理可能的嵌套表头
    const flatColumns = hrDetailTableHead.reduce((acc, item) => {
      if (item.children) {
        return [...acc, ...item.children.map(child => ({...child, title: `${item.title} ${child.title}`}))];
      }
      return [...acc, item];
    }, []);

    const ws = XLSX.utils.json_to_sheet(hrTableData.map(item => {
      const row = {};
      flatColumns.forEach(col => {
        row[col.title] = item[col.dataIndex];
      });
      return row;
    }), {header: flatColumns.map(col => col.title), skipHeader: false});

    XLSX.utils.book_append_sheet(wb, ws, "呼入详情数据");

    const currentDateTime = moment().format('YYYYMMDD');
    const fileName = `CallVolumeDetails${currentDateTime}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };


  /**
   * 详情页面钻取等配置
   */
  const rgTabListNoTitle = [
    {
      key: 'rgSense',
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
      key: 'mydOverall',
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

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
      <div style={{padding: 8}}>
        <Input
          ref={searchInput}
          placeholder={`Search `}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{marginBottom: 8, display: 'block'}}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined/>}
          size="small"
          style={{width: 90, marginRight: 8}}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{width: 90}}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>
    ),
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : false,
    render: text => searchedColumn === dataIndex && text ? (
      <Highlighter
        highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ) : (
      text
    ),
  });


  /**
   * 满意度相关详情处理
   */
    // 表头
  const mydDetailTableHead = [
      {
        title: '场景',
        dataIndex: "mydDetailSense",
        align: "center",
        ...getColumnSearchProps('mydDetailSense'),
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
        title: '参评率',
        children: [
          {
            title: '本期',
            dataIndex: "mydDetailParB",
            align: "center",
          },
          {
            title: '上期',
            dataIndex: "mydDetailParS",
            align: "center",
          },
        ]
      },
      {
        title: '十分满意量',
        dataIndex: "mydDetailVerySatQuan",
        align: "center",
      },
      {
        title: '满意量',
        dataIndex: "mydDetailSatQuan",
        align: "center",
      },
      {
        title: '一般量',
        dataIndex: "mydDetailGenQuan",
        align: "center",
      },
      {
        title: '不满意量',
        dataIndex: "mydDetailDisQuan",
        align: "center",
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
        sorter: (a, b) => {
          // 移除字符串中的百分号，并将其转换为浮点数
          const aValue = parseFloat(a.mydDetailEffect.replace('%', ''));
          const bValue = parseFloat(b.mydDetailEffect.replace('%', ''));

          // 比较转换后的数值
          return aValue - bValue;
        },
      }
    ];

  // 动态 Tab 切换 Table 数据
  const [selectedTabKey, mydSetSelectedTabKey] = useState('mydOverall');
  let mydTableData;
  switch (selectedTabKey) {
    case 'mydOverall':
      mydTableData = mydOverallData;
      break;
    case 'mydSms':
      mydTableData = mydMessageData;
      break;
    case 'mydWechat':
      mydTableData = mydChatData;
      break;
    default:
      mydTableData = [];
  }

  /**
   * 呼入相关详情处理
   */
    // 表头
  const hrDetailTableHead = [
      {
        title: '场景',
        dataIndex: "hrDetailSense",
        align: "center",
        ...getColumnSearchProps('hrDetailSense'),
      },
      {
        title: '命中量',
        children: [
          {
            title: '本期',
            dataIndex: "hrTheAmountOfHitsB",
            align: "center",
          },
          {
            title: '上期',
            dataIndex: "hrTheAmountOfHitsS",
            align: "center",
          },
        ]
      },
      {
        title: '进人工量',
        children: [
          {
            title: '本期',
            dataIndex: "hrLaborIntakeB",
            align: "center",
          },
          {
            title: '上期',
            dataIndex: "hrLaborIntakeS",
            align: "center",
          },
        ]
      },
      {
        title: '进人工占比',
        children: [
          {
            title: '本期',
            dataIndex: "hrProOfLaborInputB",
            align: "center",
          },
          {
            title: '上期',
            dataIndex: "hrProOfLaborInputS",
            align: "center",
          },
        ]
      },
      {
        title: "影响整体转人工值",
        dataIndex: "hrValueIsHuman",
        align: "center",
      }
    ];

  // 动态 Tab 切换 Table 数据
  const [hrselectedTabKey, hrSetSelectedTabKey] = useState('rgSense');
  let hrTableData;
  switch (hrselectedTabKey) {
    case 'rgSense':
      hrTableData = hrdOverallData;
      break;
    case 'rgActive':
      hrTableData = hrdMessageData;
      break;
    case 'rgRejection':
      hrTableData = hrdChatData;
      break;
    default:
      hrTableData = [];
  }
  ;

  // 详情展示处理
  useEffect(() => {
    const fetchData = async () => {
      setLoadingChat(true);

      // 准备 API 调用的参数
      const params = {
        day_ids: dates[0].format("YYYY-MM-DD HH:mm:ss"),
        day_ide: dates[1].format("YYYY-MM-DD HH:mm:ss"),
        last_day_ids: comparisonDates?.[0].format("YYYY-MM-DD HH:mm:ss"),
        last_day_ide: comparisonDates?.[1].format("YYYY-MM-DD HH:mm:ss"),
      };

      // 根据当前展示的模块和 Tab 调用相应的 API
      if (currentCard === 'callVolume') {
        switch (hrselectedTabKey) {
          case 'rgSense':
            const senseResponse = await queryCallSense(params);
            // TODO: 处理响应数据
            break;
          case 'rgActive':
            const initiativeResponse = await queryCallInitiative(params);
            // TODO: 处理响应数据
            break;
          case 'rgRejection':
            const rejectionResponse = await queryCallRejection(params);
            // TODO: 处理响应数据
            break;
        }
      } else if (currentCard === 'satisfaction') {
        switch (selectedTabKey) {
          case 'mydOverall':
            const overallResponse = await querySatOverall(params);
            // TODO: 处理响应数据
            if (overallResponse.code === '200') {
              setMydOverallData(overallResponse.data);
            } else {
              console.error('获取数据失败:', overallResponse.message);
              message.error('获取满意度数据失败');
            }
            break;
          case 'mydSms':
            const mesResponse = await querySatMes(params);
            // TODO: 处理响应数据
            if (mesResponse.code === '200') {
              setMydMessageData(mesResponse.data);
            } else {
              console.error('获取数据失败:', mesResponse.message);
              message.error('获取满意度数据失败');
            }
            break;
          case 'mydWechat':
            const chatResponse = await querySatChat(params);
            // TODO: 处理响应数据
            // 处理API响应
            if (chatResponse.code === '200') {
              setMydChatData(chatResponse.data);
            } else {
              console.error('获取数据失败:', chatResponse.message);
              message.error('获取满意度数据失败');
            }
            break;
        }
      }
      setLoadingChat(false);
    };

    fetchData();
  }, [currentCard, hrselectedTabKey, selectedTabKey, dates, comparisonDates]);


  // 下载处理
  const handleDetailClick = async () => {
    const params = {
      day_ids: dates[0].format("YYYY-MM-DD HH:mm:ss"),
      day_ide: dates[1].format("YYYY-MM-DD HH:mm:ss"),
      last_day_ids: comparisonDates?.[0].format("YYYY-MM-DD HH:mm:ss"),
      last_day_ide: comparisonDates?.[1].format("YYYY-MM-DD HH:mm:ss"),
    };


    if (currentCard === 'callVolume' && hrselectedTabKey === 'rgSense') {
      const detailResponse = await queryCallSenseDetail(params);
      // TODO: 处理响应数据
    } else if (currentCard === 'callVolume' && hrselectedTabKey === 'rgActive') {
      const detailResponse = await queryCallInitiativeDetail(params);
      // TODO: 处理响应数据
    } else if (currentCard === 'callVolume' && hrselectedTabKey === 'rgRejection') {
      const detailResponse = await queryCallRejectionDetail(params);
      // TODO: 处理响应数据
    }
    // 对于满意度详情，不区分当前是整体/短信/微信
    else if (currentCard === 'satisfaction') {
      const satDetailResponse = await querySatDetail(params);
      // TODO: 处理响应数据
    }
  };

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
          activeTabKey={hrselectedTabKey}
          onTabChange={key => hrSetSelectedTabKey(key)}
          tabBarExtraContent={
            <Space>
              <Button
                type="primary"
                shape="round"
                icon={<DownloadOutlined/>}
                onClick={exportToExcelCallVolume}
              />
              <Button
                type="primary"
                shape="round"
                icon={<FileSearchOutlined/>}
                onClick={handleDetailClick}
              >
                详情
              </Button>
            </Space>
          }
        >
          <Table bordered={true} size={"small"} columns={hrDetailTableHead} dataSource={hrTableData}/>
        </Card>
      )}

      {currentCard === 'satisfaction' && (
        <Card
          title={"满意度详情"}
          style={{width: '100%'}}
          tabList={hydTabListNoTitle}
          activeTabKey={selectedTabKey}
          onTabChange={key => mydSetSelectedTabKey(key)}
          tabProps={{
            size: 'middle',
          }}
          tabBarExtraContent={
            <Space>
              <Button
                type="primary"
                shape="round"
                icon={<DownloadOutlined/>}
                onClick={exportToExcelSatisfaction}
                loading={setExportToExcelSat}
              />
              <Button
                type="primary"
                shape="round"
                icon={<FileSearchOutlined/>}
                onClick={handleDetailClick}
              >
                详情
              </Button>
            </Space>
          }
        >
          <Table bordered={true} size={"small"} columns={mydDetailTableHead} dataSource={mydTableData}
                 loading={loadingChat}/>
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
                      onClick={exportToExcelMain} loading={setExportToLoading}/>
            </Col>
          </Row>
          <Divider/>
          <Table columns={hrDataColumns} dataSource={processedData} bordered={true} pagination={false}
                 size={"small"} title={() => <h3>呼叫量数据</h3>} loading={searchDataLoading}/>
          <Divider/>
          <Table columns={mydDataColumns} dataSource={processedDataCombined} bordered={true} pagination={false}
                 size={"small"} title={() => <h3>满意度数据</h3>} loading={searchDataLoading}/>
        </Card>
      )}
    </PageContainer>
  );
};


export default notifications;
