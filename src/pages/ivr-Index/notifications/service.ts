import {request} from 'umi';
import axios from "axios";

const BASE_API = '/api/ivrIndex';


async function fetchAPI(endpoint: string, options = {}) {
  const url = `${BASE_API}${endpoint}`;
  try {
    const response = await axios({url, ...options});

    return response.data;
  } catch (error) {
    // 统一错误处理逻辑
    console.error(`请求${url}失败:`, error);

    throw error;
  }
}

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

export async function queryCallSense(): Promise<{
  data: {}
}> {
  return request('/api/ivrIndex/callSense')
}

export async function queryCallSenseDetail(): Promise<{
  data: {}
}> {
  return request('/api/ivrIndex/callSenseDetail')
}

export async function queryCallInitiative(): Promise<{
  data: {}
}> {
  return request('/api/ivrIndex/callInitiative')
}

export async function queryCallInitiativeDetail(): Promise<{
  data: {}
}> {
  return request('/api/ivrIndex/callInitiativeDetail')
}

export async function queryCallRejection(): Promise<{
  data: {}
}> {
  return request('/api/ivrIndex/callRejection')
}

export async function queryCallRejectionDetail(): Promise<{
  data: {}
}> {
  return request('/api/ivrIndex/callRejectionDetail')
}

export async function querySatisfaction(params) {
  return fetchAPI('/Satisfaction', { // 确保使用的是正确的API路径
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 确保设置了正确的Content-Type头
    },
    data: params, // 传递参数
  });
}

export async function querySatOverall(params) {
  return fetchAPI('/callSatOverall', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 确保设置了正确的Content-Type头
    },
    data: params, // 传递参数
  });
}

export async function querySatMes(params) {
  return fetchAPI('/callSatMes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 确保设置了正确的Content-Type头
    },
    data: params, // 传递参数
  });
}

export async function querySatChat(params) {
  return fetchAPI('/querySatChat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 确保设置了正确的Content-Type头
    },
    data: params, // 传递参数
  });
}

export async function querySatDetail(params) {
  const url = '/api/ivrIndex/querySatDetail';
  try {
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    });

    const filename = response.headers['content-disposition']?.split('filename=')[1] || 'satDetail.csv';
    return {
      data: response.data,
      filename: decodeURIComponent(filename),
    };

  } catch (error) {
    console.error(`请求${url}失败:`, error);
    throw error;
  }
}
