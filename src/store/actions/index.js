import axios from 'axios'
import router from '../../router/index.js'
import httpTool from '../../tool/httpTool.js'

const actions = {

  goto: (ctx, param) => {
    if (typeof param === 'number') {
       router.go(param)
    } else {
      router.push(param)
    }
  },
  replaceto: (ctx, param) => {
    router.replace(param)
    // console.log('router:',router)
  },


  request: (ctx, param) => {
    axios({
      url: httpTool.httpUrlEnv() + 'ecard-wechat' + param.url,
      method: param.method || 'GET',
      baseURL: '',
      // baseURL: ':9201',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: param.params || null,
      data: param.body || null,
      timeout: param.timeout || 60000,
    }).then(response => {
      console.log("response",response);
      if (response.data.code == 0) {
        param.onSuccess && param.onSuccess(response)
      }
      else if (response.data.errcode !== 0) {
        param.onFail && param.onFail(response)
      }
      else {
        param.onFail && param.onFail(response)
      }
    }).catch(
      error => {
        // ctx.dispatch ('showLoading', false);
        if(error){
          console.log("error",error)
        }

      }
    )
  },

  // 获取验证码
  getCode (ctx,param){
    ctx.dispatch('request',{
      url: '/ecard/workWechat/sendCode',
      method: 'POST',
      params: param.data,
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      },
      onFail: body => {
      }
    })
  },

  // 登录
  loginEntry (ctx,param){
    ctx.dispatch('request',{
      url: '/ecard/workWechat/login',
      method: 'POST',
      params: param.data,
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      },
      onFail: body => {
        param.onfail ? param.onfail(body) : null
      }
    })
  },

};
export default {
  actions: actions
}
