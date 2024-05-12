import { baseUrl } from './api'


/**
 * 发送网络请求
 * @param {string} url 请求的 URL
 * @param {object} options 请求的配置选项，包括 method、body 等
 * @returns {Promise<any>} 返回 Promise 对象
 */
async function request(url, options) {
  // try {
  //   const response = await fetch(baseUrl + url, options);
  //   if (response.status == 200 || response.status == 204) {
  //     const data = await response.json();
  //     return data;
  //   }

  // } catch (error) {
  //   console.error('请求出错:', error);
  //   throw error;
  // }
  const response = await fetch(baseUrl + url, options);
  // if (response.status == 200 || response.status == 204) {
    const data = await response.json();
    // console.log(response);
    data.status= response.status
    return data;
    // return data
  // }else{

  // }

}

export default {
  get: async (url) => {
    return await request(url, {
      method: 'GET'
    });
  },
  post: async (url, body) => {
    return await request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  },
  put: async (url, body) => {
    return await request(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  },
  delete: async (url) => {
    return await request(url, {
      method: 'DELETE'
    });
  }
};
