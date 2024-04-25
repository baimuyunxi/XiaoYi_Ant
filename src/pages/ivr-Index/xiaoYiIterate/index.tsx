import React, {useRef, useState} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Card, Col, DatePicker, Divider, Input, message, Row, Space, Table} from "antd";
import useStyles from "./style.style";
import {createFromIconfontCN, DownloadOutlined, SearchOutlined} from "@ant-design/icons";
import moment from "moment";
import Highlighter from 'react-highlight-words';
import {useRequest} from "@umijs/max";
import {queryIterate} from "./service";

const {RangePicker} = DatePicker;

const iterates: React.FC = () => {

  // 创建一个图标组件
  const MyIcon = createFromIconfontCN({
    scriptUrl: [
      '//at.alicdn.com/t/c/font_4507680_ufz2ssxabp.js',
    ] // 在 iconfont.cn 上生成
  });

  // 消息提醒
  const [messageApi, contextHolder] = message.useMessage();
  const satSuccess = () => {
    messageApi.open({
      type: 'warning',
      content: '详细数据开始下载！请耐心等待！',
      icon: <MyIcon type="icon-waiting"/>,
    });
  };

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

  const SatDetailCat = () => {
    messageApi.open({
      type: 'error',
      content: '详情数据下载失败！',
      icon: <MyIcon type="icon-error"/>,
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

  const UniversalTry = () => {
    messageApi.open({
      type: 'error',
      content: '异常！',
      icon: <MyIcon type="icon-shangchuancuowurizhi"/>,
    });
  }

  // 自定义样式引用
  const {styles} = useStyles();

  // 禁用今天之后的日期
  const disabledDate = (current: moment.Moment) => {
    return current && current.isAfter(moment().endOf('day'));
  };

  // 场景筛选
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
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

  // 动态表头
  const [dateRange1, setDateRange1] = useState([]);
  const [dateRange2, setDateRange2] = useState([]);

  const formatDateRange = (dates) => {
    if (dates.length === 2) {
      const start = dates[0].format('YYYY-MM-DD');
      const end = dates[1].format('YYYY-MM-DD');
      if (start === end) {
        return `${moment(start).format('M月D日')} `;
      } else {
        return `${moment(start).format('M月D日')} - ${moment(end).format('M月D日')} `;
      }
    }
    return '';
  };

  // 表头
  const iterateColumns = [
    {
      title: '场景名称',
      dataIndex: 'DetailSense',
      align: 'center',
      ...getColumnSearchProps(""),
      fixed: 'left',
      width: 200,
    },
    {
      title: formatDateRange(dateRange1)  +'命中量',
      dataIndex: 'theAmountOfHits',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange2)  +'命中量',
      dataIndex: 'theAmountOfHits1',
      align: 'center',
    },
    {
      title: '命中量环比',
      dataIndex: 'theAmountOfHitsRatio',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange1)  +'首解率（2小时）',
      dataIndex: 'numberOfEntries',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange2)  +'首解率（2小时）',
      dataIndex: 'numberOfEntries1',
      align: 'center',
    },
    {
      title: '首解率（2小时）环比',
      dataIndex: 'numberOfEntriesRatio',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange1)  +'满意度',
      dataIndex: 'satisfactionRate',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange2)  +'满意度',
      dataIndex: 'satisfactionRate1',
      align: 'center',
    },
    {
      title: '满意度环比',
      dataIndex: 'satisfactionRatio',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange1)  +'参评量',
      dataIndex: 'ofTheFirstSolution',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange2)  +'参评量',
      dataIndex: 'ofTheFirstSolution1',
      align: 'center',
    },
    {
      title: '参评量环比',
      dataIndex: 'ofTheFirstSolutionRatio',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange1)  +'转人工占比',
      dataIndex: 'versionOfLaborVolume',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange2)  +'转人工占比',
      dataIndex: 'versionOfLaborVolume1',
      align: 'center',
    },
    {
      title: '转人工占比环比',
      dataIndex: 'versionOfLaborVolumeRatio',
      align: 'center',
    },
    {
      title: '其他',
      dataIndex: 'effect',
      align: 'center',
      fixed: 'right',
      width: 300
    },
  ];

  // 进行查询
  const [iterateData,setIterateData] = useState([])
  const {loading: searchDataLoading,run:runSearch}=useRequest(
    async ()=>{
      try {
        console.log(dateRange1,dateRange2)
        // 从状态中获取时间范围
        const day_ids = dateRange1[0].format("YYYY-MM-DD");
        const day_ide = dateRange1[1].format("YYYY-MM-DD");
        const last_day_ids = dateRange2[0].format("YYYY-MM-DD");
        const last_day_ide = dateRange2[1].format("YYYY-MM-DD");

        // 调用API
        const iterateResponse = await queryIterate({day_ids, day_ide, last_day_ids, last_day_ide});

        // 响应体打印
        console.log("iterate Response:", iterateResponse);

        // 处理API响应
        if (iterateResponse.code === '200') {
          UniversalSuccess();
          setIterateData(iterateResponse.data);
        } else {
          console.error('获取数据失败:', iterateResponse.message);
          UniversalErr();
        }
      } catch (e) {
        UniversalTry();
        console.error("Error fetching data:", e);
      }
    },
    {
      manual: true, // 手动触发请求
    }
  )

  return (
    <PageContainer>
      {contextHolder}
      <Card title="时间选择">
        <Space direction="vertical" size={12}>
          <Row align={"middle"} gutter={16} wrap={false}>
            <Col className={styles.labelColWithPadding}>
              <span>时间：</span>
            </Col>
            <Col>
              <RangePicker
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
                value={dateRange1}
                onChange={(dates) => setDateRange1(dates)}
              />
            </Col>
            <Col className={styles.labelColWithPadding}>
              <span>环比时间：</span>
            </Col>
            <Col>
              <RangePicker
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
                value={dateRange2}
                onChange={(dates) => setDateRange2(dates)}
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
        <Space direction={"vertical"} size={12} style={{width: '100%'}}/>
        <Row justify="space-between" align="middle" gutter={16}>
          <Col>
            <h1 className={styles.noMarginH1}>全场景详情</h1>
          </Col>
          <Col>
            <Button type="primary" shape="round" icon={<DownloadOutlined/>}/>
          </Col>
        </Row>
        <Divider/>
        <Table columns={iterateColumns} bordered={true} size={"middle"}
               pagination={{defaultPageSize: 20}} scroll={{y: 1300, x: 2600}}
               loading={searchDataLoading} dataSource={iterateData}
        />
      </Card>
    </PageContainer>
  );
};

export default iterates;
