import axios from 'axios';

// 函数返回唯一的请求key
function getRequestKey(config) {
  let {method, url, params, data} = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
}

// 存储请求信息
let pendingRequest = new Map();
let cancelTokens: any[] = [];

// 添加请求信息
function addPendingRequest(config) {
  let requestKey = getRequestKey(config);
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (!pendingRequest.has(requestKey)) {
      pendingRequest.set(requestKey, cancel);
    }
  });
}

// 取消重复请求，移除请求信息
function removePendingRequest(config) {
  let requestKey = getRequestKey(config);
  if (pendingRequest.has(requestKey)) {
    // 如果是重复的请求，则执行对应的cancel函数
    let cancel = pendingRequest.get(requestKey);
    cancel(requestKey);
    // 将前一次重复的请求移除
    pendingRequest.delete(requestKey);
  }
}

// 清理所有请求
function clearPendingRequests() {
  cancelTokens.forEach(cancel => cancel());
  cancelTokens = [];
}

// 创建 axios 实例
const instance = axios.create({
  baseURL: '/api'
});

// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 检查是否存在重复请求，若存在则取消已发的请求
    removePendingRequest(config);
    // 把当前请求信息添加到pendingRequest对象中
    addPendingRequest(config);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 从pendingRequest对象中移除请求
    removePendingRequest(response.config);
    return response;
  },
  function (error) {
    // 从pendingRequest对象中移除请求
    removePendingRequest(error.config || {});
    if (axios.isCancel(error)) {
      console.log("已取消的重复请求：" + error.message);
    } else {
      // 添加异常处理
      console.error('请求失败：', error);
    }
    return Promise.reject(error);
  }
);

// 在路由变化时清理未完成的请求
const setupCancelOnRouteChange = (history) => {
  history.listen(() => {
    clearPendingRequests();
  });
};

export {setupCancelOnRouteChange};
export default instance;
