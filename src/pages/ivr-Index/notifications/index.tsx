import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import React, {useEffect, useRef, useState} from 'react';
import {Card, Col, DatePicker, Row, Space, Button} from "antd";
import {PageContainer} from "@ant-design/pro-components";
import moment from "moment";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import useStyles from './style.style'
import {style} from "@umijs/bundler-esbuild/dist/plugins/style";



const {RangePicker} = DatePicker;

const App: React.FC = () => {
  // 自定义样式引用
  const {styles} = useStyles();

  // 禁用今天之后的日期
  const disabledDate = (current: moment.Moment) => {
    return current && current.isAfter(moment().endOf('day'));
  };

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
            {/*<Col><span>     </span></Col>*/}
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
              <Button type="primary" icon={<SearchOutlined/>}>
                查询
              </Button>
            </Col>
          </Row>
        </Space>
      </Card>
    </PageContainer>
  );
};


export default App;
