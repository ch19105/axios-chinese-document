/**
 * 封装 axios
 */
import axios from 'axios'
import qs from 'qs'
import store from '@/store/index';
import router from '@/router';
import { Loading } from 'element-ui';


const ajax = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_HOST_PROD : process.env.VUE_APP_HOST_DEV,
    method: 'post',
    timeout: 3000000,
    // headers: {
    //   'Content-Type': 'multipart/form-data' //请求头
    // },
    // headers: { 'token': localStorage.getItem('token') },
    // 跨域请求，携带凭证。
    withCredentials: true,
    // 服务器相应数据类型
    responseType: 'json',
    //发送前修改数据
    transformRequest: [function(data) {
        //qs模块对data数据转换
        return qs.stringify(data)
    }]
})

// 请求拦截
const that = this
let abc = ''
ajax.interceptors.request.use(
        config => {
            console.log(Loading)
           // abc = Loading.service({
           //      lock: true,
           //      text: '数据加载中',
           //      spinner: 'el-icon-loading',
           //      background: 'rgba(255,255,255,0.2)'
           //  })
            //请求接口时展现正在加载中false 为不显示  true为显示
            // console.group('%c发起请求',"color: #666;font-size:13px;")
            return config
        },
        err => {
            return Promise.reject(err)
        }
    )
    // 返回拦截

ajax.interceptors.response.use(response => {
    // console.log(Loading)
      // abc.close()
    if (response.data.code == 210) {
        localStorage.clear();
        store.commit("changeLogin", false);
        router.replace({
            path: '/'
        })
        alert('账号过期请重新登录！')
    }
    return response
}, error => {
    return Promise.reject(error)
})

ajax.install = (Vue) => {
    Vue.prototype.$ajax = ajax
}

export default ajax
