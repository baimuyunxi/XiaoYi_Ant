import { request } from '@umijs/max';

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
