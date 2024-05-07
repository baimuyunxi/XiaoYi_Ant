import {request} from 'umi';
import axios from "axios";

// 定义基础API路径
const BASE_API = '/api/ivrIndex';

// 统一请求函数
async function fetchAPI(endpoint: string, options = {}) {
  const url = `${BASE_API}${endpoint}`;
  try {
    // 使用axios进行请求
    const response = await axios({url, ...options});
    // 可以在这里处理通用的响应逻辑，例如检查响应状态
    return response.data; // 注意，axios直接返回的是{data, status, ...}对象
  } catch (error) {
    // 统一错误处理逻辑
    console.error(`请求${url}失败:`, error);
    // 在这里处理错误，可能是抛出一个自定义错误，或者错误对象
    throw error;
  }
}

// 呼叫量数据
export async function queryCallVolume(params: {
  last_day_ids: string;
  last_day_ide: string;
  day_ide: string;
  day_ids: string
}) {
  return fetchAPI('/callVolume', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 场景转人工
export async function queryCallSense(): Promise<{
  data: {}
}> {
  return request('/api/ivrIndex/callSense')
}

// 场景转人工详情
export async function queryCallSenseDetail(): Promise<{
  data: {}
}> {
  return request('/api/ivrIndex/callSenseDetail')
}

// 主动转人工
export async function queryCallInitiative(): Promise<{
  data: {}
}> {
  return request('/api/ivrIndex/callInitiative')
}

// 主动转人工详情
export async function queryCallInitiativeDetail(): Promise<{
  data: {}
}> {
  return request('/api/ivrIndex/callInitiativeDetail')
}

// 拒识转人工
export async function queryCallRejection(): Promise<{
  data: {}
}> {
  return request('/api/ivrIndex/callRejection')
}

// 拒识转人工详情
export async function queryCallRejectionDetail(): Promise<{
  data: {}
}> {
  return request('/api/ivrIndex/callRejectionDetail')
}

// 满意度数据
export async function querySatisfaction(params) {
  return fetchAPI('/Satisfaction', { // 确保使用的是正确的API路径
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 确保设置了正确的Content-Type头
    },
    data: params, // 传递参数
  });
}


// 整体满意度
export async function querySatOverall(params) {
  return fetchAPI('/callSatOverall', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 确保设置了正确的Content-Type头
    },
    data: params, // 传递参数
  });
}

// 短信满意度
export async function querySatMes(params) {
  return fetchAPI('/callSatMes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 确保设置了正确的Content-Type头
    },
    data: params, // 传递参数
  });
}

// 微信满意度
export async function querySatChat(params) {
  return fetchAPI('/querySatChat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 确保设置了正确的Content-Type头
    },
    data: params, // 传递参数
  });
}

// 满意度详情
export async function querySatDetail(params) {
  const url = '/api/ivrIndex/querySatDetailNew';
  try {
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob', // 请求返回类型为 blob 以处理文件下载
    });

    // 处理文件下载逻辑
    const filename = response.headers['content-disposition']?.split('filename=')[1] || 'satDetail.csv';
    return {
      data: response.data,
      filename: decodeURIComponent(filename), // 处理文件名的编码
    };

  } catch (error) {
    console.error(`请求${url}失败:`, error);
    throw error;
  }
}
