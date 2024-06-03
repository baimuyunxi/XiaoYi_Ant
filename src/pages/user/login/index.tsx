import React, {useEffect, useState} from 'react';
import {
  AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  UserOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import {Tabs, message, theme, Alert} from 'antd';
import Particles, {initParticlesEngine} from "@tsparticles/react";
import {loadSlim} from "@tsparticles/slim";
import {useIntl, useModel} from "@umijs/max";
import {flushSync} from 'react-dom';

import CryptoJS from 'crypto-js';
import {login} from "@/services/ant-design-pro/api";

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const {token} = theme.useToken();
  const {initialState, setInitialState} = useModel('@@initialState');
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});

  const [init, setInit] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // AES加密密码，使用CBC模式和随机IV
      const key = CryptoJS.enc.Utf8.parse('13140BaiMuYunXi+2000080620000714');
      const iv = CryptoJS.lib.WordArray.random(16);
      const encrypted = CryptoJS.AES.encrypt(values.password, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const encryptedPassword = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
      const encryptedValues = {...values, password: encryptedPassword};

      // 登录
      const msg = await login({...encryptedValues, type});
      if (msg.status === 'ok') {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        // 存储 token
        localStorage.setItem('token', msg.token);
        const urlParams = new URL(window.location.href).searchParams;
        window.location.href = urlParams.get('redirect') || '/';
        return;
      }
      console.log('登录界面信息打印', msg);
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  const {status, type: loginType} = userLoginState;

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
        position: 'relative',
      }}
    >
      {init && <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#00000F",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 6,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: {min: 1, max: 5},
            },
          },
          detectRetina: true,
        }}
      />
      }
      <LoginFormPage
        logo={<img alt="logo" src="/icons/kitty.png"/>}
        title="小翼"
        containerStyle={{
          backgroundColor: 'rgba(250,250,250,0.41)', // 雅灰色
          backdropFilter: 'blur(10px)', // 毛玻璃效果
          borderRadius: '14px', // 增加圆角效果
          position: 'relative',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 增加阴影效果
          zIndex: 1,
        }}
        actions={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
          </div>
        }
        onFinish={async (values) => {
          await handleSubmit(values as API.LoginParams);
        }}
      >
        <Tabs
          activeKey={type}
          onChange={setType}
          centered
        >
          <Tabs.TabPane key={'account'} tab={'账号密码登录'}/>
          <Tabs.TabPane key={'phone'} tab={'手机号登录'}/>
        </Tabs>
        {status === 'error' && loginType === 'account' && (
          <LoginMessage
            content={intl.formatMessage({
              id: 'pages.login.accountLogin.errorMessage',
              defaultMessage: '账户或密码错误',
            })}
          />
        )}
        {type === 'account' && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                style: {
                  backgroundColor: '#8e8d8d', // 背景颜色
                  color: '#000', // 文字颜色
                  borderRadius: '5px', // 圆角
                },
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'用户名'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                style: {
                  backgroundColor: '#8e8d8d', // 背景颜色
                  color: '#000', // 文字颜色
                  borderRadius: '5px', // 圆角
                },
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </>
        )}
        {type === 'phone' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                style: {
                  backgroundColor: '#8e8d8d', // 背景颜色
                  color: '#000', // 文字颜色
                  borderRadius: '5px', // 圆角
                },
                prefix: (
                  <MobileOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              name="mobile"
              placeholder={'手机号'}
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                style: {
                  backgroundColor: '#8e8d8d', // 输入框背景颜色
                  color: '#000', // 输入框文字颜色
                  borderRadius: '5px', // 输入框圆角
                },
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              captchaProps={{
                size: 'large',
                style: ({timing}) => ({
                  backgroundColor: timing ? '#d9d9d9' : '#1890ff', // 倒计时期间为灰色, 否则为蓝色
                  color: '#fff', // 白色文字颜色
                  borderRadius: '5px', // 圆角
                  cursor: timing ? 'not-allowed' : 'pointer', // 倒计时期间不可点, 否则可点
                }),
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'秒后重试'}`; // 倒计时期间的文本
                }
                return '获取验证码'; // 未点击状态下的文本
              }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
              onGetCaptcha={async () => {
                message.success('验证码已发送！');
              }}
            />
          </>
        )}
      </LoginFormPage>
    </div>
  );
};

export default Login;
