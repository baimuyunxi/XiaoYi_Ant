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
// export async function querySatDetail(params) {
//   try {
//     const response = await fetch('/querySatDetail', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json', // 确保设置了正确的Content-Type头
//       },
//       body: params, // 传递参数
//       responseType: 'blob',
//     });
//
//     if (!response.ok) {
//       throw new Error('Network response was not ok.');
//     }
//
//     const blob = await response.blob();
//     const disposition = response.headers.get('Content-Disposition');
//     console.log('Response Headers:', Array.from(response.headers.entries()));
//     let filename = 'satDetail.csv'; // 默认文件名
//     if (disposition) {
//       const matches = disposition.match(/filename="([^"]+)"/);
//       if (matches) {
//         filename = matches[1];
//       }
//     }
//     return { blob, filename }; // 返回包含blob和文件名的对象
//   } catch (error) {
//     console.error('Failed to fetch details:', error);
//     throw error; // 向上抛出错误，以便调用者可以处理
//   }
// }

// export async function querySatDetail(params) {
//   return fetchAPI('/querySatDetail', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json', // 确保设置了正确的Content-Type头
//     },
//     data: params, // 传递参数
//     responseType: 'blob',
//   }).then((response) => {
//
//     if (response.ok) {
//       throw new Error('Network response was not ok.');
//     }
//     console.log(response.ok)
//     console.log("response.headers",response.headers); // 查看所有响应头
//     // 提取文件名
//     const disposition = response.headers && response.headers['content-disposition'];
//     let filename = 'satDetail.csv'; // 默认文件名
//     console.log("disposition",disposition)
//     if (disposition) {
//       const matches = disposition.match(/filename="?([^"]+)"?/);
//       console.error('Matches:', matches);
//       filename = matches && matches[1] ? matches[1] : filename;
//     }
//     return {
//       data: response,
//       filename: filename
//     };
//   });
// }


export async function querySatDetail(params) {
  // 使用 fetch 发送 POST 请求
  return fetch('/api/ivrIndex/querySatDetail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)  // 将参数序列化为 JSON 字符串
  }).then(response => {
    console.log(response.ok)
    // 检查响应是否成功
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.blob().then(blob => {
      console.log(response.headers)
      // 解析 content-disposition 头部以获取文件名
      const disposition = response.headers.get('content-disposition');
      let filename = 'satDetail.csv'; // 如果无法解析文件名，则使用默认值
      if (disposition) {
        const matches = disposition.match(/filename="?([^"]+)"?/);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }
      return {
        data: blob,  // 返回 blob 数据
        filename: filename  // 返回解析得到的或默认的文件名
      };
    });
  });
}
