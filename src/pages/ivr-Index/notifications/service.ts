import { request } from 'umi';

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

// 呼叫量数据
export async function queryCallVolume(params: {
  last_day_ids: string;
  last_day_ide: string;
  day_ide: string;
  day_ids: string
}) {
  console.log("走到了这里", params)
  return fetchAPI('/callVolume', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 场景转人工
export async function queryCallSense():Promise<{
  data:{}
}>{
  return request('/api/ivrIndex/callSense')
}

// 场景转人工详情
export async function queryCallSenseDetail():Promise<{
  data:{}
}>{
  return request('/api/ivrIndex/callSenseDetail')
}

// 主动转人工
export async function queryCallInitiative():Promise<{
  data:{}
}>{
  return request('/api/ivrIndex/callInitiative')
}

// 主动转人工详情
export async function queryCallInitiativeDetail():Promise<{
  data:{}
}>{
  return request('/api/ivrIndex/callInitiativeDetail')
}

// 拒识转人工
export async function queryCallRejection():Promise<{
  data:{}
}>{
  return request('/api/ivrIndex/callRejection')
}

// 拒识转人工详情
export async function queryCallRejectionDetail():Promise<{
  data:{}
}>{
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
export async function querySatOverall(params: {
  last_day_ids: string;
  last_day_ide: string;
  day_ide: string;
  day_ids: string
}) {return fetchAPI('/callSatOverall', {
  method: 'POST',
  data: {
    ...params,
  },
});}

// 短信满意度
export async function querySatMes():Promise<{
  data:{}
}>{
  return request('/api/ivrIndex/callSatMes')
}

// 微信满意度
export async function querySatChat(params){
  return fetchAPI('/querySatChat',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // 确保设置了正确的Content-Type头
    },
    data: params, // 传递参数
  });
}

// 满意度详情
export async function querySatDetail():Promise<{
  data:{}
}>{
  return request('/api/ivrIndex/querySatDetail')
}

