import React, {useRef, useState} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {
  Button,
  Card,
  Checkbox,
  Col, ConfigProvider,
  DatePicker,
  Divider,
  Form,
  Input, Menu,
  message,
  Modal,
  notification,
  Row,
  Space,
  Table
} from "antd";
import useStyles from "./style.style";
import {createFromIconfontCN, DownloadOutlined, SearchOutlined} from "@ant-design/icons";
import moment from "moment";
import Highlighter from 'react-highlight-words';
import {useRequest} from "@umijs/max";
import {queryIterate, queryAiChat} from "./service";
import * as XLSX from "xlsx";
import {TinyColor} from '@ctrl/tinycolor';

const {RangePicker} = DatePicker;

const iterates: React.FC = () => {

  // 创建一个图标组件
  const MyIcon = createFromIconfontCN({
    scriptUrl: [
      '//at.alicdn.com/t/c/font_4507680_6v6ettm44d.js',
    ] // 在 iconfont.cn 上生成
  });

  // 消息提醒
  const [messageApi, contextHolder] = message.useMessage();


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

  const WaitingAll = () => {
    notificatApi.open({
      type: 'warning',
      message: '查询中...',
      description: '非默认时间首次查询&&查询日期区间较大时，效率比较慢！请耐心等待！',
      icon: <MyIcon type="icon-waiting"/>,
      placement: 'bottomRight',
      duration: 2
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

  // 进行查询
  const [notificatApi, contextHolder1] = notification.useNotification();
  const [iterateData, setIterateData] = useState([])
  const {loading: searchDataLoading, run: runSearch} = useRequest(
    async () => {
      try {
        console.log(dateRange1, dateRange2)
        // 从状态中获取时间范围
        const day_ids = dateRange1[0].format("YYYY-MM-DD");
        const day_ide = dateRange1[1].format("YYYY-MM-DD");
        const last_day_ids = dateRange2[0].format("YYYY-MM-DD");
        const last_day_ide = dateRange2[1].format("YYYY-MM-DD");

        WaitingAll();

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
        // UniversalTry();
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

  // AI 分析弹窗
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [form] = Form.useForm();

  const showModal = (item) => {
    form.setFieldsValue(item);
    setIsModalVisible(true);
    setCanSubmit(false);
  };

  const {loading: aiDataLoading,run:handleOk}=useRequest(
    async () => {
      try {
        // 触发表单验证
        const values = await form.validateFields();
        console.log('提交的表单数据:', values);

        const response = await queryAiChat(values);

        // 处理接口响应
        if (response.code === '200') {
          UniversalSuccess();
          // @ts-ignore
          setIterateData(iterateData.map(item => {
            if (item.id === currentItem.id) {
              return {...item, remark: response.data};
            }
            return item;
          }));
        } else {
          console.error('查询失败:', response.message);
          UniversalErr();
          // 处理失败后的逻辑
        }
        setIsModalVisible(false);
      } catch (errorInfo) {
        notificatApi.open({
          type: 'error',
          message: errorInfo.name,
          description: errorInfo.message,
          icon: <MyIcon type="icon-shangchuancuowurizhi"/>,
        });
        console.log('Failed:', errorInfo);
      }
    },
    {
      manual: true, // 手动触发请求
    }
  );


  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 表单字段变化时的处理函数
  const onFieldsChange = (_, allFields) => {
    // 检查所有字段是否都已填写
    setCanSubmit(allFields.every(field => field.value));
  };


  // 定义表单的底部按钮
  const colors1 = ['#40e495', '#30dd8a', '#2bb673'];
  const colors2 = ['#85FFBD', '#FFFB7D', '#ef9d43'];

  const getHoverColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
  const getActiveColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());

  const modalFooter = (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
              colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(', ')})`,
              colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(', ')})`,
              lineWidth: 0,
            },
          },
        }}
      >
        <Button type="primary" onClick={handleCancel}>
          取消
        </Button>
      </ConfigProvider>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: `linear-gradient(45deg,  ${colors2.join(', ')})`,
              colorPrimaryHover: `linear-gradient(45deg, ${getHoverColors(colors2).join(', ')})`,
              colorPrimaryActive: `linear-gradient(45deg, ${getActiveColors(colors2).join(', ')})`,
              lineWidth: 0,
            },
          },
        }}
      >
        <Button type="primary" onClick={handleOk} disabled={!canSubmit} style={{marginLeft: '8px'}} loading={aiDataLoading}>
          <MyIcon type="icon-rengongzhineng"/>确定
        </Button>
      </ConfigProvider>
    </div>
  );

  // 表头
  const iterateColumns = [
    {
      title: '场景名称',
      dataIndex: 'DetailSense',
      align: 'center',
      ...getColumnSearchProps("DetailSense"),
      fixed: 'left',
      width: 160,
    },
    {
      title: formatDateRange(dateRange1) + '命中量',
      dataIndex: 'theAmountOfHits',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange2) + '命中量',
      dataIndex: 'theAmountOfHits1',
      align: 'center',
    },
    {
      title: '命中量环比',
      dataIndex: 'theAmountOfHitsRatio',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange1) + '首解率（2小时）',
      dataIndex: 'ofTheFirstSolution',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange2) + '首解率（2小时）',
      dataIndex: 'ofTheFirstSolution1',
      align: 'center',
    },
    {
      title: '首解率（2小时）环比',
      dataIndex: 'ofTheFirstSolutionRatio',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange1) + '满意度',
      dataIndex: 'satisfactionRate',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange2) + '满意度',
      dataIndex: 'satisfactionRate1',
      align: 'center',
    },
    {
      title: '满意度环比',
      dataIndex: 'satisfactionRatio',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange1) + '参评量',
      dataIndex: 'numberOfEntries',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange2) + '参评量',
      dataIndex: 'numberOfEntries1',
      align: 'center',
    },
    {
      title: '参评量环比',
      dataIndex: 'numberOfEntriesRatio',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange1) + '转人工占比',
      dataIndex: 'versionOfLaborVolume',
      align: 'center',
    },
    {
      title: formatDateRange(dateRange2) + '转人工占比',
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
      width: 260,
      render: (text, record) => (
        <a onClick={() => showModal(record)}>{text}</a>
      )
    },
    {
      title: 'AI分析',
      dataIndex: 'remark',
      align: 'center',
      fixed: 'right',
      width: 300,
      filters: [
        {
          text: '非空值',
          value: 'notEmpty',
        },
      ],
      // filterMode: 'tree',
      // filterSearch: true,
      onFilter: (value, record) => {
        if (value === 'notEmpty') {
          return !!record.remark; // 如果筛选值为非空值，则返回 remark 列不为空的行
        }
        return true;
      },
    }
  ];

  // 数据导出
  const {loading: setExportToLoading, run: exportToExcelMain} = useRequest(
    async () => {
      const wb = XLSX.utils.book_new();

      // 处理可能的嵌套表头
      const flatColumns = iterateColumns.reduce((acc, item) => {
        if (item.children) {
          return [...acc, ...item.children.map(child => ({...child, title: `${item.title} ${child.title}`}))];
        }
        return [...acc, item];
      }, []);

      const ws = XLSX.utils.json_to_sheet(iterateData.map(item => {
        const row = {};
        flatColumns.forEach(col => {
          row[col.title] = item[col.dataIndex];
        });
        return row;
      }), {header: flatColumns.map(col => col.title), skipHeader: false});

      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      const currentDateTime = moment().format('YYYYMMDD');
      const fileName = `automaticIteration${currentDateTime}.xlsx`;

      XLSX.writeFile(wb, fileName);
    },
    {
      manual: true, // 表示手动触发异步操作
    }
  );

  return (
    <PageContainer>
      {contextHolder}
      {contextHolder1}
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
            <Button type="primary" shape="round" icon={<DownloadOutlined/>}
                    loading={setExportToLoading} onClick={exportToExcelMain}/>
          </Col>
        </Row>
        <Divider/>
        <Table columns={iterateColumns} bordered={true} size={"middle"}
               pagination={{defaultPageSize: 20}} scroll={{y: 460, x: 2600}}
               loading={searchDataLoading} dataSource={iterateData}
        />
      </Card>
      <Modal title="AI分析" open={isModalVisible} onCancel={handleCancel} footer={modalFooter}>
        <Divider/>
        <Form labelCol={{span: 5}} wrapperCol={{span: 16}} initialValues={currentItem} onFieldsChange={onFieldsChange}
              form={form}>
          <Form.Item
            label="场景名称"
            name="DetailSense">
            <Input disabled={true}/>
          </Form.Item>
          <Form.Item
            label="初步效果"
            name="effect"
            rules={[{required: true, message: 'Please input!'}]}>
            <Input/>
          </Form.Item>
          <Form.Item
            label={"优化内容"}
            name="optimization"
            rules={[{required: true, message: 'Please input!'}]}>
            <Input.TextArea/>
          </Form.Item>
        </Form>
      </Modal>

    </PageContainer>
  );
};

export default iterates;
