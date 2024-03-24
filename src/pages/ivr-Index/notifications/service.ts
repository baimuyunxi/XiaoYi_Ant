import { request } from '@umijs/max';

// 呼叫量数据
export async function queryCallVolume(params: {
  last_day_ids: string;
  last_day_ide: string;
  day_ide: string;
  day_ids: string
}) {
  console.log("走到了这里", params)
  return request('/api/ivrIndex/callVolume', {
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
export async function querySatisfaction(params: {
  last_day_ids: string;
  last_day_ide: string;
  day_ide: string;
  day_ids: string
}) {
  return request('/api/ivrIndex/Satisfaction', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 整体满意度
export async function querySatOverall(params: {
  last_day_ids: string | undefined;
  last_day_ide: string | undefined;
  day_ide: string;
  day_ids: string
}):Promise<{ data: {} }>{
  return request('/api/ivrIndex/callSatOverall')
}

// 短信满意度
export async function querySatMes():Promise<{
  data:{}
}>{
  return request('/api/ivrIndex/callSatMes')
}

// 微信满意度
export async function querySatChat():Promise<{
  data:{}
}>{
  return request('/api/ivrIndex/querySatChat')
}

// 满意度详情
export async function querySatDetail():Promise<{
  data:{}
}>{
  return request('/api/ivrIndex/querySatDetail')
}

