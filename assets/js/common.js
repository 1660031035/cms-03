// 设置基地址
axios.defaults.baseURL = 'http://www.itcbc.com:8000'

// 全局配置请求头 注册和登录不需要token认证
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 判断路径 是否包含/api 不包含 就配置请求头
  if (config.url.indexOf('/api') == -1) {
    config.headers['Authorization'] = localStorage.getItem('token')
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  // 登录拦截
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (response.data.code == 1) {
    toastr.warning(response.data.message)
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  // 处理报错信息
  // console.dir(error)
  if (error.response.data.message == '身份认证失败') {
    // 强行跳转到登录页
    location.href = 'login.html'
    // 删除无效token
    localStorage.removeItem('token') 
  }
  return Promise.reject(error);
});