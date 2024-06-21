import axios from 'axios';

// 定义基础API路径
const BASE_API = '/api/dashboard';

// 统一请求函数
async function fetchAPI(endpoint: string, options = {}) {
  const url = `${BASE_API}${endpoint}`;
  try {
    // 使用axios进行请求
    const response = await axios(url, options);
    return response.data; // axios直接返回的是{data, status, ...}对象
  } catch (error) {
    console.error(`请求${url}失败:`, error);
    throw error;
  }
}


export async function queryIterate(params) {
  return fetchAPI('/getProcessFlowHome', {
    method: 'get',
    data: params,
  });
}
