import {
  createFromIconfontCN,
  DownloadOutlined,
  FileSearchOutlined,
  RollbackOutlined,
  SearchOutlined
} from '@ant-design/icons';
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
  Flex,
  message,
  Input, notification
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

const createNewArr = (data, columnIndexes) => {
  let result = [...data];

  columnIndexes.forEach((columnIndex) => {
    let lastValue = null;
    let count = 0;

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
  // 创建一个图标组件
  const MyIcon = createFromIconfontCN({
    scriptUrl: [
      '//at.alicdn.com/t/c/font_4507680_6v6ettm44d.js',
    ]
  });

  const [messageApi, contextHolder] = message.useMessage();
  const [notificatApi, contextHolder1] = notification.useNotification();

  const WaitingAll = ()=>{
    notificatApi.open({
      type: 'warning',
      message: '查询中...',
      description: '非默认时间首次查询&&查询日期区间较大时，效率比较慢！请耐心等待！',
      icon: <MyIcon type="icon-waiting"/>,
      placement: 'bottomRight',
      duration: 2
    });
  }

  const SatDetailSucces = () => {
    messageApi.open({
      type: 'success',
      content: '详细数据下载完成！',
      icon: <MyIcon type="icon-success"/>,
    });
  }

  const SatDetailErr = () => {
    messageApi.open({
      type: 'error',
      content: '下载失败，返回数据不是有效的 Blob 对象！',
      icon: <MyIcon type="icon-problem-solving"/>,
    });
  }

  const UniversalSuccess = () => {
    messageApi.open({
      type: 'success',
      content: '成功！',
      icon: <MyIcon type="icon-email"/>,
    });
  }

  const UniversalErr = () => {
    messageApi.open({
      type: 'error',
      content: '失败！',
      icon: <MyIcon type="icon-failed-fill"/>,
    });
  }

  const {styles} = useStyles();

  const [processedData, setProcessedData] = useState([]);

  const [processedDataCombined, setProcessedDataCombined] = useState([]);

  const [hrdOverallData, setHrdOverallData] = useState([]);
  const [hrdMessageData, setHrdMessageData] = useState([]);
  const [hrdChatData, setHrdChatData] = useState([]);

  const [mydChatData, setMydChatData] = useState([]);
  const [mydMessageData, setMydMessageData] = useState([]);
  const [mydOverallData, setMydOverallData] = useState([]);

  const [loadingChat, setLoadingChat] = useState(false);

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


  const disabledDate = (current: moment.Moment) => {
    return current && current.isAfter(moment().endOf('day'));
  };


  const [dates, setDates] = useState<[moment.Moment, moment.Moment]>(() => {
    const yesterdayStart = moment().subtract(1, 'days').startOf('day');
    const yesterdayEnd = moment().subtract(1, 'days').endOf('day');
    return [yesterdayStart, yesterdayEnd];
  });
  const [comparisonDates, setComparisonDates] = useState<[moment.Moment, moment.Moment]>();


  useEffect(() => {
    if (dates) {
      const startComparisonDate = dates[0].clone().subtract(1, 'month');
      const endComparisonDate = dates[1].clone().subtract(1, 'month');
      setComparisonDates([startComparisonDate, endComparisonDate]);
    }
  }, [dates]);


  const formatDateRange = (dates) => {
    if (!dates || dates.length !== 2) return "日期";
    const startDate = dates[0].format("YYYY-MM-DD");
    const endDate = dates[1].format("YYYY-MM-DD");
    return startDate === endDate ? startDate : `${startDate} -- ${endDate}`;
  };


  /**
   * API 调用处理
   */
  const {loading: searchDataLoading, run: runSearch} = useRequest(
      async () => {
        try {

          const day_ids = dates[0].format("YYYY-MM-DD HH:mm:ss");
          const day_ide = dates[1].format("YYYY-MM-DD HH:mm:ss");
          const last_day_ids = comparisonDates[0].format("YYYY-MM-DD HH:mm:ss");
          const last_day_ide = comparisonDates[1].format("YYYY-MM-DD HH:mm:ss");

          // const callVolumeResponse = await queryCallVolume({day_ids, day_ide, last_day_ids, last_day_ide});
          const satisfactionResponse = await querySatisfaction({day_ids, day_ide, last_day_ids, last_day_ide});

          // console.log("Call Volume Response:", callVolumeResponse);
          console.log("Satisfaction Response:", satisfactionResponse);

          if (satisfactionResponse.code === '200') {
            UniversalSuccess();
            const newData = createNewArr(satisfactionResponse.data, ["mydChannel", "mydContactPoint", "mydRemarks"]);
            setProcessedDataCombined(newData);
          } else {
            console.error('获取数据失败:', satisfactionResponse.message);
            UniversalErr();
          }
        } catch (e) {
          notificatApi.open({
            type: 'error',
            message: e.name,
            description: e.message,
            icon: <MyIcon type="icon-shangchuancuowurizhi"/>,
          });
          console.error("Error fetching data:", e);
        }
      },
      {
        manual: true, // 手动触发请求
      }
    );

  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // 延迟
    setTimeout(() => {
      setDataLoaded(true);
    }, 1000);


    if (dataLoaded) {
      runSearch();
    }
  }, [dataLoaded]);

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
        const value = parseFloat(text);
        const absValue = Math.abs(value);
        let displayText = text;
        let style = {};

        if (rowIndex % 3 === 0) {
          if (value < 0 && absValue > 1) {
            style = {color: 'red', fontWeight: 'bold'};
          } else if (value > 0 && absValue > 1) {
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
        const value = parseFloat(text);
        const absValue = Math.abs(value);
        let displayText = text;

        let style = {};

        if (rowIndex % 2 === 0) {
          if (value < 0 && absValue > 1) {

            style = {color: 'red', fontWeight: 'bold'};
          } else if (value > 0 && absValue > 1) {

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
  const {loading: setExportToLoading, run: exportToExcelMain} = useRequest(
      async () => {
        const wb = XLSX.utils.book_new();

        const ws1 = XLSX.utils.json_to_sheet(processedData.map(item => {
          return {
            "专区": item.hrSpecialArea,
            "触点": item.hrContactPoint,
            "日期": item.hrDate,
            "环比": item.hrChains,
            "备注": item.hrRemarks || "",
          }
        }), {header: ["专区", "触点", formatDateRange(dates), "环比", "备注"], skipHeader: false});
        XLSX.utils.book_append_sheet(wb, ws1, "呼叫量数据");

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
        const fileName = `DayNew${formatDateRange(dates)}.xlsx`;

        XLSX.writeFile(wb, fileName);

      },
      {
        manual: true, // 表示手动触发异步操作
      }
    )


  const {loading: setExportToExcelSat, run: exportToExcelSatisfaction} = useRequest(
    async () => {
      const wb = XLSX.utils.book_new();

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


  const exportToExcelCallVolume = () => {
    const wb = XLSX.utils.book_new();

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

  const mydDetailTableHead = [
    {
      title: '场景',
      dataIndex: "mydDetailSense",
      align: "center",
      ...getColumnSearchProps('mydDetailSense'),
    },
    selectedTabKey === 'mydOverall' && {
      title: "命中量",
      dataIndex: "mydHitQuantity",
      align: "center",
      width: 80,
      sorter: (a, b) => {
        const aValue = parseFloat(a.mydHitQuantity);
        const bValue = parseFloat(b.mydHitQuantity);
        return aValue - bValue;
      },
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
        const aValue = parseFloat(a.mydDetailEffect.replace('%', ''));
        const bValue = parseFloat(b.mydDetailEffect.replace('%', ''));

        return aValue - bValue;
      },
    }
  ].filter(Boolean);


  /**
   * 呼入相关详情处理
   */
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

  useEffect(() => {
    const fetchData = async () => {
      setLoadingChat(true);

      const params = {
        day_ids: dates[0].format("YYYY-MM-DD HH:mm:ss"),
        day_ide: dates[1].format("YYYY-MM-DD HH:mm:ss"),
        last_day_ids: comparisonDates?.[0].format("YYYY-MM-DD HH:mm:ss"),
        last_day_ide: comparisonDates?.[1].format("YYYY-MM-DD HH:mm:ss"),
      };

      if (currentCard === 'callVolume') {
        WaitingAll();
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
        WaitingAll();
        switch (selectedTabKey) {
          case 'mydOverall':
            const overallResponse = await querySatOverall(params);
            // TODO: 处理响应数据
            if (overallResponse.code === '200') {
              UniversalSuccess();
              setMydOverallData(overallResponse.data);
            } else {
              console.error('获取数据失败:', overallResponse.message);
              UniversalErr();
            }
            break;
          case 'mydSms':
            const mesResponse = await querySatMes(params);
            // TODO: 处理响应数据
            if (mesResponse.code === '200') {
              UniversalSuccess();
              setMydMessageData(mesResponse.data);
            } else {
              console.error('获取数据失败:', mesResponse.message);
              UniversalErr();
            }
            break;
          case 'mydWechat':
            const chatResponse = await querySatChat(params);
            // TODO: 处理响应数据
            // 处理API响应
            if (chatResponse.code === '200') {
              UniversalSuccess();
              setMydChatData(chatResponse.data);
            } else {
              console.error('获取数据失败:', chatResponse.message);
              UniversalErr();
            }
            break;
        }
      }
      setLoadingChat(false);
    };

    fetchData();
  }, [currentCard, hrselectedTabKey, selectedTabKey, dates, comparisonDates]);


  const {loading: handleDetailClickLoading, run: handleDetailClick,} = useRequest(async () => {
    console.log("Request started, current loading state:", handleDetailClickLoading);
    const params = {
      day_ids: dates[0].format("YYYY-MM-DD HH:mm:ss"),
      day_ide: dates[1].format("YYYY-MM-DD HH:mm:ss"),
      last_day_ids: comparisonDates?.[0]?.format("YYYY-MM-DD HH:mm:ss"),
      last_day_ide: comparisonDates?.[1]?.format("YYYY-MM-DD HH:mm:ss"),
    };
    WaitingAll();

    try {
      let response;
      if (currentCard === 'callVolume') {
        switch (selectedTabKey) {
          case 'rgSense':
            response = await queryCallSenseDetail(params);
            break;
          case 'rgActive':
            response = await queryCallInitiativeDetail(params);
            break;
          case 'rgRejection':
            response = await queryCallRejectionDetail(params);
            break;
        }
      } else if (currentCard === 'satisfaction') {
        response = await querySatDetail(params);
        if (response.data instanceof Blob) {
          const url = window.URL.createObjectURL(response.data);
          const a = document.createElement('a');
          a.href = url;
          a.download = response.filename; // Use the filename from the backend
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          SatDetailSucces();
        } else {
          SatDetailErr();
          console.error('返回的数据类型不是 Blob:', response.data);
          throw new Error('Data is not a Blob');
        }
      }
    } catch (error) {
      console.error('Error during API call:', error);
      notificatApi.open({
        type: 'error',
        message: error.name,
        description: error.message,
        icon: <MyIcon type="icon-shangchuancuowurizhi"/>,
      });
    }
  });


  const handleButtonClick = async () => {
    await handleDetailClick();
  };


  return (
    <PageContainer>
      {contextHolder}
      {contextHolder1}
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
              <>
                <Button
                  type="primary"
                  shape="round"
                  icon={<FileSearchOutlined/>}
                  onClick={handleButtonClick}
                >
                  详情
                </Button>
              </>
            </Space>
          }
        >
          <Table bordered={true} size={"middle"} columns={hrDetailTableHead} dataSource={hrTableData}
                 pagination={{defaultPageSize: 20}} scroll={{y: 300}}/>
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
              <>
                {contextHolder}
                <Button
                  type="primary"
                  shape="round"
                  icon={<FileSearchOutlined/>}
                  onClick={handleButtonClick}
                  loading={handleDetailClickLoading}
                >
                  详情
                </Button>
              </>
            </Space>
          }
        >
          <Table bordered={true} size={"middle"} columns={mydDetailTableHead} dataSource={mydTableData}
                 loading={loadingChat} pagination={{defaultPageSize: 20}} scroll={{y: 300}}/>
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
                 size={"middle"} title={() => <h3>呼叫量数据</h3>} loading={searchDataLoading}/>
          <Divider/>
          <Table columns={mydDataColumns} dataSource={processedDataCombined} bordered={true} pagination={false}
                 size={"middle"} title={() => <h3>满意度数据</h3>} loading={searchDataLoading}/>
        </Card>
      )}
    </PageContainer>
  );
};


export default notifications;
