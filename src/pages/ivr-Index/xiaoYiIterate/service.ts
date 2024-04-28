import axios from 'axios';

// 定义基础API路径
const BASE_API = '/api/ivrIndex';

// 统一请求函数
async function fetchAPI(endpoint: string, options = {}) {
  const url = `${BASE_API}${endpoint}`;
  try {
    const response = await axios(url, options);

    return response.data; // 注意，axios直接返回的是{data, status, ...}对象
  } catch (error) {
    console.error(`请求${url}失败:`, error);
    throw error;
  }
}

export async function queryIterate(params: {
  last_day_ids: string;
  last_day_ide: string;
  day_ide: string;
  day_ids: string
}) {
  return fetchAPI('/queryAutoIteration', {
    method: 'post',
    data: params,
  });
}

export async function queryAiChat(params){
  return fetchAPI('/queryAiChat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 确保设置了正确的Content-Type头
    },
    data: params, // 传递参数
  })
}
