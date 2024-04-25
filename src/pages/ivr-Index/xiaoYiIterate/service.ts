import {request} from 'umi';

// 定义基础API路径
const BASE_API = '/api/ivrIndex';

// 统一请求函数
async function fetchAPI(endpoint: string, options = {}) {
  const url = `${BASE_API}${endpoint}`;
  try {
    const response = await request(url, options);
    // 可以在这里处理通用的响应逻辑，例如检查响应状态
    return response;
  } catch (error) {
    // 统一错误处理逻辑
    console.error(`请求${url}失败:`, error);
    throw error; // 可以根据需要重新抛出错误，或者返回一个错误标记
  }
}

export async function queryIterate(params: {
  last_day_ids: string;
  last_day_ide: string;
  day_ide: string;
  day_ids: string
}) {
  console.log("走到了这里", params)
  return fetchAPI('/queryAutoIteration', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
