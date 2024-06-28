import { Icon } from '@iconify/react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import {Button, Space, Tag, Modal, Timeline} from 'antd';
import { useRef, useState } from 'react';
import request from 'umi-request';
import {ClockCircleOutlined} from "@ant-design/icons";

// 模拟等待时间的函数
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// 等待指定时间的函数
export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

// 定义GithubIssueItem的类型
type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  call_day_yd: string;
  time_difference: string;
  dl_label: number;
  rg_label: number;
  first_level_label: string;
  second_level_label: string;
  third_level_label: string;
  fourth_level_label: string;
};

// 定义NoFoundPage组件
const NoFoundPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);

  // 定义表格的列
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '时间',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: 'callID',
      dataIndex: 'title',
      copyable: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '来话时间',
      search: false,
      dataIndex: 'call_day_yd',
    },
    {
      title: '通话时长',
      search: false,
      dataIndex: 'time_difference',
    },
    {
      title: '队列',
      dataIndex: 'dl_label',
      valueEnum: {
        0: { text: '否' },
        1: { text: '是' },
      },
      fieldProps: {
        options: [
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
      },
    },
    {
      title: '人工',
      dataIndex: 'rg_label',
      valueEnum: {
        0: { text: '否' },
        1: { text: '是' },
      },
      fieldProps: {
        options: [
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
      },
    },
    {
      disable: true,
      title: '一级标签',
      dataIndex: 'first_level_label',
      valueEnum: {
        '10000': { text: '10000' },
        '10001': { text: '10001' },
        '1000111': { text: '1000111' },
        '其他': { text: '其他' },
        '异常': { text: '异常' },
      },
      fieldProps: {
        options: [
          { label: '10000', value: '10000' },
          { label: '10001', value: '10001' },
          { label: '1000111', value: '1000111' },
          { label: '其他', value: '其他' },
          { label: '异常', value: '异常' },
        ],
      },
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record) => (
        <Space>
          {record.labels.map(({ name, color }) => (
            <Tag color={color} key={name}>
              {name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '二级标签',
      dataIndex: 'second_level_label',
      valueEnum: {
        '纯自助': { text: '纯自助' },
        '排队': { text: '排队' },
        '人工': { text: '人工' },
      },
      fieldProps: {
        options: [
          { label: '纯自助', value: '纯自助' },
          { label: '排队', value: '排队' },
          { label: '人工', value: '人工' },
        ],
      },
    },
    {
      title: '三级标签',
      dataIndex: 'third_level_label',
      valueEnum: {
        '超短话务': { text: '超短话务' },
        '场景类': { text: '场景类' },
        '人工转自助': { text: '人工转自助' },
        '首层': { text: '首层' },
        '欢迎语': { text: '欢迎语' },
        '接通': { text: '接通' },
        '呼损': { text: '呼损' },
        '其他': { text: '其他' },
      },
      fieldProps: {
        options: [
          { label: '超短话务', value: '超短话务' },
          { label: '场景类', value: '场景类' },
          { label: '人工转自助', value: '人工转自助' },
          { label: '首层', value: '首层' },
          { label: '欢迎语', value: '欢迎语' },
          { label: '接通', value: '接通' },
          { label: '呼损', value: '呼损' },
          { label: '其他', value: '其他' },
        ],
      },
    },
    {
      title: '四级标签',
      dataIndex: 'fourth_level_label',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: () => [
        <a
          key="view"
          onClick={() => {
            setModalVisible(true);
          }}
        >
          <Tag color="#87d068" bordered={false}>查看</Tag>
        </a>,
      ],
    },
  ];

  return (
    <>
      <ProTable<GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(sort, filter);
          await waitTime(2000);
          return request<{
            data: GithubIssueItem[];
          }>('https://proapi.azurewebsites.net/github/issues', {
            params,
          });
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 12,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="详情数据"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<Icon icon="hugeicons-file-download" />}
            onClick={() => {}}
            type="primary"
          >
            导出
          </Button>,
        ]}
      />

      <Modal
        visible={modalVisible}
        title="聊天记录"
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <Timeline
          mode="alternate"
          items={[
            {
              children: 'Create a services site 2015-09-01',
            },
            {
              children: 'Solve initial network problems 2015-09-01',
              color: 'green',
            },
            {
              dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
              children: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
            },
            {
              color: 'red',
              children: 'Network problems being solved 2015-09-01',
            },
            {
              children: 'Create a services site 2015-09-01',
            },
            {
              dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
              children: 'Technical testing 2015-09-01',
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default NoFoundPage;
