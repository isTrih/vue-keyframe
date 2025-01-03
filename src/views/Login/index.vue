<script setup>
import {useUserStore} from "@/stores/user";
import {useRouter} from "vue-router";
import {ref} from "vue";
import {Message} from "@arco-design/web-vue";
import {Verifycode} from "@/apis/main.js";

// 定义路由
const emit = defineEmits(['changeShow']);
// const router = useRouter()

//注册登录切换
const loginToRegister = () => {
  showLogin.value = false;
}
const registerToLogin = () => {
  showLogin.value = true;
}
const showLogin = ref(true)

//关闭登录页面
function closeLogin() {
  emit('changeShow')
}

//验证码发送
const SmsLoad = ref(false);


// 账户加密码校验
// 准备表单对象
const formLogin = ref({
  mobile: '',
  password: '',
  isagree: true
})

const formRegister = ref({
  mobile: '',
  sms: '',
  username: '',
  password: '',
  retryPwd: '',
  isagree: false
})

// 准备规则对象
const rulesRegister = {
  mobile: [
    {required: true, message: '手机号不能为空', trigger: 'blur'},
    {
      validator: (value, callback) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if (regMobile.test(value)) {
          return callback();
        }
        callback("请输入正确的手机号");
      }
    }
  ],
  sms: [
    {required: true, message: '验证码不能为空', trigger: 'blur'},
    {
      validator: (value, callback) => {
        // 自定义校验逻辑
        if (value.length === 6) {
          return callback();
        } else {
          return callback('请输入6位验证码');
        }
      }
    }
  ],
  username: [
    {required: true, message: '用户名不能为空！', trigger: 'blur'},
    {
      validator: (value, callback) => {
        // 自定义校验逻辑
        if (value.length >= 2 && value.length <= 14) {
          return callback();
        } else {
          return callback('用户名长度为2-14');
        }
      }
    }
  ],
  password: [
    {required: true, message: '密码不能为空', trigger: 'blur'},
    {
      validator: (value, callback) => {
        // 自定义校验逻辑
        if (value.length >= 6 && value.length <= 14) {
          return callback();
        } else {
          return callback('密码长度为6-14');
        }
      }
    }
  ],
  retryPwd: [
    {required: true, message: '密码不能为空', trigger: 'blur'},
    {
      validator: (value, callback) => {
        if (value.length >= 6 && value.length <= 14) {
          if (value !== formRegister.value.password) {
            callback('两次密码不一致！');
          } else {
            callback();
          }
        } else {
          return callback('密码长度为6-14');
        }
      }
    }
  ],
  isagree: [
    {
      validator: (value, callback) => {
        // 自定义校验逻辑
        if (value) {
          return callback()
        } else {
          return callback('请阅读并同意协议')
        }
      }
    }
  ]
}
const rulesLogin = {
  mobile: [
    {required: true, message: '手机号不能为空', trigger: 'blur'},
    {
      validator: (value, callback) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if (regMobile.test(value)) {
          return callback();
        }
        callback("请输入正确的手机号");
      }
    }
  ],
  password: [
    {required: true, message: '密码不能为空', trigger: 'blur'},
    {
      validator: (value, callback) => {
        // 自定义校验逻辑
        if (value.length >= 6 && value.length <= 14) {
          return callback();
        } else {
          return callback('密码长度为6-14');
        }
      }
    }
  ],
  isagree: [
    {
      validator: (value, callback) => {
        // 自定义校验逻辑
        if (value) {
          return callback()
        } else {
          return callback('请阅读并同意协议')
        }
      }
    }
  ]
}

const isSend = ref(false)
const totalTime = ref(60)
const timer = ref(0);
const smsstr = ref('发送验证码')

//发送验证码
async function sendSms(mobile) {
  if (isSend.value) {
    Message.info({
      content: '请等待' + smsstr.value,
      duration: 1000,
    })
    return
  }
  //TODO:这里写验证码接口
  const res = await Verifycode(mobile)
  console.log(res)
  console.log(mobile)
  if (res.code === -1) {
    Message.error({
      content: '验证码发送失败',
      duration: 1000,
    })
    return
  }
  isSend.value = true
  Message.success({
    content: '验证码发送成功',
    duration: 1000,
  })
  smsstr.value = totalTime.value + 's后重新发送'
  timer.value = setInterval(() => {
    totalTime.value--
    smsstr.value = totalTime.value + 's后重新发送'
    if (totalTime.value < 0) {
      clearInterval(timer.value)
      isSend.value = false
      smsstr.value = '发送验证码'
      totalTime.value = 60
    }
  }, 1000)
}

// 获取form实例校验
const formLoginRef = ref(null)
const formRegisterRef = ref(null)

// 准备用户
const userStore = useUserStore();
//注册
const doReg = () => {
  const {mobile, password, username,sms} = formRegister.value;
  const verifyCode = sms
  formRegisterRef.value.validate(async (valid) => {
    if (!valid) {
      console.log(valid)
      const [code, msg] = await userStore.userRegister({mobile, username, password, verifyCode});
      if (code === 0) {
        // 登录成功
        Message.success({
          content: '注册成功',
          duration: 1500,
        })
        closeLogin()
      } else {
        Message.error({
          content: msg,
          duration: 1500,
        })
      }
    } else {
      Message.error({
        content: '请检查填写数据是否正确。',
        duration: 1500,
      })
      console.log(valid)
    }

  })
}
//登录
const doLogin = () => {
  const {mobile, password, isagree} = formLogin.value

  formLoginRef.value.validate(async (valid) => {
    if (!valid) {

      const [code, msg] = await userStore.getUserInfo({mobile, password})
      if (code === 0) {
        // 登录成功
        Message.success({
          content: '登录成功',
          duration: 1500,
        })
        closeLogin()
      } else {
        Message.error({
          content: msg,
          duration: 1500,
        })
      }
    } else {
      Message.error({
        content: '请检查填写数据是否正确。',
        duration: 1500,
      })
      console.log(mobile, password, isagree)

      console.log(valid)
    }

  })
}
</script>

<template>
  <div class="overlay" @click="closeLogin">
  </div>
  <div class="login" style="z-index: 9999">
    <div class="box" :style="{height: showLogin===true?'17rem':'27rem'}">
      <!--      <div class="leftArea"></div>-->
      <div class="topArea">
        <p style="font-size: 1.2rem;">
          <span :class="[showLogin===false?'topNormal':'topClick']" @click="registerToLogin">
            账号登录
          </span>
          ｜
          <span :class="[showLogin===true?'topNormal':'topClick']" @click="loginToRegister">
            注册账号
          </span>
        </p>
      </div>
      <!-- 登录 -->
      <div class="rightArea" v-if="showLogin">
        <a-form ref="formLoginRef" :model="formLogin" :rules="rulesLogin" @submit="doLogin">
          <a-form-item style="padding-left: 88px" hide-label hide-asterisk field="mobile" label="">
            <a-input v-model="formLogin.mobile" placeholder="请输入手机号..."/>
          </a-form-item>
          <a-form-item style="padding-left: 88px" hide-label hide-asterisk field="password" label="">
            <a-input-password v-model="formLogin.password" placeholder="请输入密码"/>
          </a-form-item>
          <a-form-item style="padding-left: 88px" hide-label hide-asterisk field="isagree">
            <a-checkbox style="font-size: 12px" v-model="formLogin.isagree">
              我已阅读并同意
              <a-link style="padding: 0;margin: 0" href="doc/agreement">关键帧平台用户服务协议</a-link>
              和
              <a-link style="padding: 0;margin: 0" href="doc/privacy">关键帧隐私政策</a-link>
              。
            </a-checkbox>
          </a-form-item>
          <a-form-item style="margin-top: 4px">
            <a-button shape="round" html-type="submit" long type="primary">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
      <!-- 注册 -->
      <div class="rightArea" v-if="!showLogin">
        <a-form ref="formRegisterRef" :model="formRegister" :rules="rulesRegister" @submit="doReg">
          <a-form-item style="padding-left: 88px" hide-label hide-asterisk field="username" label="">
            <a-input v-model="formRegister.username" placeholder="请输入用户名...">
            </a-input>
          </a-form-item>
          <a-form-item style="padding-left: 88px" hide-label hide-asterisk field="mobile" label="">
            <a-input v-model="formRegister.mobile" placeholder="请输入手机号...">
              <template #append>
                <a-button type="primary" :loading="SmsLoad" long @click="sendSms(formRegister.mobile)">
                  {{ smsstr }}
                </a-button>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item style="padding-left: 88px" hide-label hide-asterisk field="sms" label="">
            <a-input v-model="formRegister.sms" placeholder="请输入6位验证码...">
            </a-input>
          </a-form-item>
          <a-form-item style="padding-left: 88px" hide-label hide-asterisk field="password" label="">
            <a-input-password v-model="formRegister.password" placeholder="请输入密码"/>
          </a-form-item>
          <a-form-item style="padding-left: 88px" hide-label hide-asterisk field="retryPwd" label="">
            <a-input-password v-model="formRegister.retryPwd" placeholder="请再次输入密码"/>
          </a-form-item>
          <a-form-item style="padding-left: 88px" hide-label hide-asterisk field="isagree">
            <a-checkbox style="font-size: 12px; width: 100%" v-model="formRegister.isagree">
              我已阅读并同意
              <a-link style="padding: 0;margin: 0" href="doc/agreement">关键帧平台用户服务协议</a-link>
              和
              <a-link style="padding: 0;margin: 0" href="doc/privacy">关键帧隐私政策</a-link>
              。
            </a-checkbox>
          </a-form-item>
          <a-form-item style="margin-top: 4px">
            <a-button shape="round" html-type="submit" type="primary" long>注册</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped>

.login {
  background-color: white;
  border-radius: 2rem;
  position: absolute;
  left: calc(50vw - 14rem);
  top: calc(38vh - 12rem);
}

.box {
  box-shadow: 32px 18px 21px -3px rgba(0, 0, 0, 0.1);
  width: 28rem;
  border-radius: 2rem;
  background-color: transparent;
  border-color: #f3f4f6;
}

.leftArea {
  position: absolute;
  left: 0;
  width: 50%;
  height: 50%;
  border-radius: 4rem;
  background-color: transparent;
}

.topArea {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #194D95;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  cursor: default;
}

.topNormal:hover {
  color: #457FBD;
  cursor: pointer;
}

.topNormal {
  color: #81AACB;
}

.topClick {
  color: #194D95;
}

.rightArea {
  position: absolute;
  left: 0;
  top: 4rem;
  width: 100%;
  height: 100%;
  border-radius: 4rem;
  background-color: transparent;
  padding-right: 88px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 设置透明度的背景色 */
  z-index: 8; /* 设置一个较大的z-index值，确保图层位于其他内容之上 */
}
</style>