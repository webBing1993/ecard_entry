<template>
  <div>
    <div class="entry">
      <div :class="flagPc ? 'body ' : 'body flagBody'">
        <p class="title">微前台登录</p>
        <div class="phone">
          <i><img src="../assets/index/shoujihao.png" alt=""></i>
          <input type="tel"  value="" v-model="phone" min="1" id="input_id" placeholder="请输入11位手机号"  ref="keyboard" @focus="onFocus($event)" v-if="isDevice"/>
          <input name="phone" type="tel" placeholder="请输入11位手机号" v-model="phone" ref="keyboard" v-else/>

          <el-button :plain="true" v-if="btntxt != '获取验证码' && btntxt != '重新获取'" class="btns btning">{{btntxt}}</el-button>
          <el-button :plain="true" @click="sendcode" :class="btntxt == '获取验证码' || btntxt == '重新获取' ? 'btns' : 'btns btning'" v-else>{{btntxt}}</el-button>
        </div>
        <div class="code">
          <i><img src="../assets/index/mima.png" alt=""></i>
          <input type="text"  value="" v-model="code" placeholder="请输入6位验证码"  ref="keyboard_" @focus="onFocus_($event)" v-if="isDevice"/>
          <input type="text" placeholder="请输入6位验证码" v-model="code" v-else/>
        </div>
        <!--<p class="login" v-if="entryAll" @click="login">登录</p>-->
        <p class="login"  @click="login">登录</p>
      </div>
      <p class="footer">上海复创科技提供技术支持</p>

      <keyboard :option="option" @keyVal="getInputValue" @close="option.show=false"></keyboard>
      <keyboard :option="option_" @keyVal="getInputValue_" @close="option_.show=false"></keyboard>

    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  import Keyboard from './keyboard.vue'
export default {
  name: 'HelloWorld',
  data () {
    return {
      disabled:false,
      time:0,
      btntxt: "获取验证码",
      code: '',
      phone: '',
      flagPc: false,    // 判断是否为pc端
      isDevice: false,    // 判断是否为双屏设备
      option: {
        show: false,
        sourceDom: ''
      },
      option_: {
        show: false,
        sourceDom: ''
      },
      entryAll: false,  // 判断是否可以点击确定按钮
    }
  },
  components: {
    Keyboard
  },
  mounted () {
    let flag = this.IsPC();
    if (flag) {
      this.flagPc = true;
    }else {
      this.flagPc = false;
    }
    this.IsDevice();
  },
  methods:{

    ...mapActions([
      'goto',
      'getCode',
      'loginEntry'
    ]),
    //获取键盘值
    getInputValue(val){
      console.log(val)
      if(val==='del'){
        this.phone=this.phone.toString().substr(0,this.phone.toString().length-1);
        console.log(this.phone)
      }else{
        if(this.phone==null){
          this.phone=''
        }
        this.phone+=val
      }
    },
    onFocus(ev){
//      document.activeElement.blur();//禁止默认键盘
      this.$set(this.option,'show',true)
      this.$set(this.option,'sourceDom',this.$refs['keyboard'])
    },
    onFocus_(ev){
//      document.activeElement.blur();//禁止默认键盘
      this.$set(this.option_,'show',true)
      this.$set(this.option_,'sourceDom',this.$refs['keyboard_'])
    },
    //获取键盘值
    getInputValue_(val){
      console.log(val)
      if(val==='del'){
        this.code=this.code.toString().substr(0,this.code.toString().length-1);
        console.log(this.phone)
      }else{
        if(this.code==null){
          this.code=''
        }
        this.code+=val
      }
    },

    // 判断是否为PC端
    IsPC () {
      let userAgentInfo = navigator.userAgent;
      let Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
      let flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },

    // 判断是否是双屏设备
    IsDevice() {
      let userAgentInfo = navigator.userAgent;  //navigator.userAgent
      console.log('userAgentInfo:',userAgentInfo);
      let Agents = ["FortrunRZT"];
      let this_ = this;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) != -1) {
          this_.isDevice = true;
          break;
        }
      }
    },
    //验证手机号码部分
    sendcode(){
      let reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/;
      if(this.phone == ''){
        this.$message('请输入手机号码');
      }else if(!reg.test(this.phone)){
        this.$message.error('手机格式不正确');
      }else{
        this.time = 180;
        this.disabled = true;

        this.getCode({
          data: {
            phone: this.phone
          },
          onsuccess: body => {
            this.entryAll = true;
            if (body.data.code == 0) {
              if (body.data.data == '' || body.data.data == null) {
                this.timer();
              }
              if (body.data.data.code != 0) {
                this.$message.error(body.data.data.msg);
              }
            }else {
              this.$message.error(body.data.data.msg);
            }
          }
        })
      }
    },

    timer() {
      if (this.time > 0) {
        this.time--;
        this.btntxt = this.time+"s后重新获取";
        setTimeout(this.timer, 1000);
      } else{
        this.time = 0;
        this.btntxt = "重新获取";
        this.disabled = false;
      }
    },

    // 登录
    login(){
      let reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/;
      if(this.phone == ''){
        this.$message('请输入手机号码');
      }else if(!reg.test(this.phone)){
        this.$message.error('手机格式不正确');
        if (this.code == '') {
          this.$message('请输入验证码');
        }else if (this.code.length > 6) {
          this.$message('请输入６位数验证码');
        }
      }else {
        if (this.code == '') {
          this.$message('请输入验证码');
        }else if (this.code.length != 6) {
          this.$message('请输入６位数验证码');
        }else {
          this.loginEntry({
            data: {
              phone: this.phone,
              code: this.code
            },
            onsuccess: body => {
              console.log('body:',body);
              if (body.data.code == 0) {
                window.location.href = body.data.data;
//            this.goto(body.data.data);
              }else {
                this.$message.error(body.data.msg);
              }
            },
            onfail: body => {
              this.$message.error(body.data.msg);
            }
          })
        }
      }
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  * {
    padding: 0;
    margin: 0;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }

  .entry {
    .flagBody {
      width: 80vw;
    }
    .body {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding-bottom: 80px;
      .title {
        color: #4A4A4A;
        font-size: 24px;
        text-align: center;
        margin-bottom: 80px;
        font-weight: bold;
        letter-spacing: 3px;
      }
      div {
        border-bottom: 1px solid #979797;
        padding: 8px 0;
        text-align: left;
        margin-bottom: 30px;
        align-items: center;
        display: flex;
        i {
          width: 24px;
          height: 24px;
          display: inline-table;
          margin-right: 8px;
          img {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }
        input {
          border: none;
          font-size: 16px;
          line-height: 30px;
          background-color: transparent;
        }
        input:-moz-placeholder {
          color: #999;
        }
        input:-ms-input-placeholder {
          color: #999;
        }
        input::-moz-placeholder {
          color: #999;
        }
        input::-webkit-input-placeholder {
          color: #999;
        }
        .btns {
          background-color: transparent;
          border: none;
          box-shadow: none;
          color: #4378BA;
          font-size: 14px;
          cursor: pointer;
        }
        .btning {
          color: #999;
        }
      }
      .login {
        margin-top: 56px;
        text-align: center;
        padding: 12px 0;
        font-size: 14px;
        color: #fff;
        border-radius: 10px;
        background-color: #4378BA;
        cursor: pointer;
      }
    }

    .footer {
      position: fixed;
      bottom: 40px;
      left: 50%;
      color: #9B9B9B;
      font-size: 14px;
      transform: translateX(-50%);
    }
  }

  input:focus, input:active:focus, button:focus {
    outline: none;
    border-color: transparent;
    box-shadow:none;
  }

</style>
