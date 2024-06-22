import axios from 'axios';
// import axiosInstance from '@/utils/axiosInstance';

// 定义基础API路径
const BASE_API = '/api/dashboard';

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

// 总呼入量&10000号呼入量  人工队列数据&人工话务接通数据
export async function queryIterate(params: any) {
  return fetchAPI('/getProcessFlowHome', {
    method: 'get',
    data: params,
  });
}

// 转人工异常数据   转人工异常数据小图
export async function getArtificialExceptions(params: any) {
  return fetchAPI('/getManualLaborHome', {
    method: 'get',
    data: params,
  });
}

// 交互异常 各触点合并
export async function getInteractionAnomalies(params: any) {
  return fetchAPI('/getInteractiveExceptionHome', {
    method: 'get',
    data: params,
  });
}

// 接口异常全量&小图
export async function getTheInterfaceIsAbnormal(params: any) {
  return fetchAPI('/getInterfaceExceptionHome', {
    method: 'get',
    data: params,
  });
}

// 错误异常
export async function getErrorException(params: any) {
  return fetchAPI('/getErrorExceptionHome', {
    method: 'get',
    data: params,
  });
}

// 异常挂机总量&小图
export async function getAbnormalHangUp(params: any) {
  return fetchAPI('/getAbnormalHangUpHome', {
    method: 'get',
    data: params,
  });
}

// 兜底场景
export async function getBottomUpScenes(params: any) {
  return fetchAPI('/getBottomUpScenesHome', {
    method: 'get',
    data: params,
  });
}
