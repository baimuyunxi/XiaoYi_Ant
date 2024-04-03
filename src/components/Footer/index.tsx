import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  // @ts-ignore
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="省客户服务中心"
    />
  );
};

export default Footer;
