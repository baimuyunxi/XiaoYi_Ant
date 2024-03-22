import {PlusOutlined} from '@ant-design/icons';
import React, {useRef, useState} from 'react';
import {Button, DatePicker, Space} from 'antd';
import type {DatePickerProps, GetProps} from 'antd';
import {ActionType, PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import type {TableListItem, TableListPagination} from "./data";
import {rule} from "@/pages/list/table-list/service";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const {RangePicker} = DatePicker;

const onChangeInitial = (
  value: DatePickerProps['value'] | RangePickerProps['value'],
  dateString: [string, string] | string
) => {
  console.log('Selected Time', value);
  console.log('Formatted Selected Time: ', dateString)
}

const onOkInitial = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
  console.log('onOk: ', value);
};

const TableList: () => void = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const columns: ProColumns<TableListItem>[] = [
      {
        title: '选择时间',
        dataIndex: 'selectTime',
        valueType: 'dateRange',
        render: () => {
          return (
            <Space size={12}>
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                onChange={onChangeInitial}
                onOk={onOkInitial}
              />
            </Space>
          );
        },
      }
    ]
  ;

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle='呼叫量数据'
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
