import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  // 设置标题的 title
  "title": '小翼智能分析系统',
  "navTheme": "light",
  "colorPrimary": "#1890ff",
  "layout": "side",
  "contentWidth": "Fluid",
  "fixedHeader": false,
  "fixSiderbar": true,
  "pwa": true,
  "logo": "https://s3.bmp.ovh/imgs/2024/03/23/036ec1148cf7320a.png",
  "token": {},
  "siderMenuType": "group",
  "splitMenus": false,
  pageTitleRender: false
};

export default Settings;
