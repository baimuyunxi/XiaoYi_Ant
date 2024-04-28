import axios from 'axios';

// 定义基础API路径
const BASE_API = '/api/ivrIndex';

// 统一请求函数
async function fetchAPI(endpoint: string, options = {}) {
  const url = `${BASE_API}${endpoint}`;
  try {
    // 使用axios进行请求
    const response = await axios(url, options);
    // 可以在这里处理通用的响应逻辑，例如检查响应状态
    return response.data; // 注意，axios直接返回的是{data, status, ...}对象
  } catch (error) {
    // 统一错误处理逻辑
    console.error(`请求${url}失败:`, error);
    // 在这里处理错误，可能是抛出一个自定义错误，或者错误对象
    throw error;
  }
}

export async function queryIterate(params: {
  last_day_ids: string;
  last_day_ide: string;
  day_ide: string;
  day_ids: string
}) {
  // console.log("走到了这里", params);
  // 调整axios的请求格式
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
