import {request} from "@umijs/max";
import type {TableCallVolumeData, TableSatisfactionData} from './data.d';

export async function queryCallVolume(p: {
  last_day_ids: string;
  last_day_ide: string;
  day_ide: string;
  day_ids: string
}): Promise<{ data: { TableCallVolumeData: TableCallVolumeData[] } }> {
  return request('/api/ivrIndex/callVolume', {
    method: 'POST',
    data: p,
  });
}

export async function querySatisfaction(p: {
  last_day_ids: string;
  last_day_ide: string;
  day_ide: string;
  day_ids: string
}): Promise<{ data: { TableSatisfactionData: TableSatisfactionData[] } }> {
  return request('/api/ivrIndex/Satisfaction', {
    method: 'POST',
    data: p,
  });
}

