import axios from 'axios';

// 定义基础API路径
const BASE_API = '/api/monitor';

// 统一请求函数
async function fetchAPI(endpoint: string, options = {}) {
  const url = `${BASE_API}${endpoint}`;
  try {
    // 使用axios进行请求
    const response = await axios(url, options);
    return response.data;
  } catch (error) {
    console.error(`请求${url}失败:`, error);
    throw error;
  }
}

// dcm接口异常
export async function getPortAbnormal(params: any) {
  return fetchAPI('/getPort', {
    method: 'get',
    data: params,
  });
}

// 流程异常
export async function getProcessAbnormal(params: any) {
  return fetchAPI('/getProcess', {
    method: 'get',
    data: params,
  });
}

// 错误异常
export async function getMistakeAbnormal(params: any) {
  return fetchAPI('/getMistake', {
    method: 'get',
    data: params,
  });
}
