<script setup>
import {useUserStore} from "@/stores/user";
import {useRouter} from "vue-router";
import {ref, reactive} from "vue";
import {Message} from "@arco-design/web-vue";

// 定义路由
const emit = defineEmits(['changeShow']);
const router = useRouter()

//注册登录切换
const isRegister = ref(false)
const toggleRegister = () => {
  isRegister.value = !isRegister.value
}

const showLogin = ref(false)

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
  sms:'',
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
        if (value.length ===6) {
          return callback();
        } else {
          return callback('请输入6位验证码');
        }
      }
    }
  ],
  username: [
    {required: true, message: '用户名不能为空！', trigger: 'blur'},
    {max: 20, message: '用户名不能超过20个字符！', trigger: 'blur'}
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
  agree: [
    {
      validator: (value, callback) => {
        // 自定义校验逻辑
        if (value) {
          callback()
        } else {
          callback('请勾选协议')
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

function sendSms() {
  if (isSend.value) {
    Message.info({
      content: '请等待' + smsstr.value,
      duration: 1000,
    })
    return
  }
  //TODO:这里写验证码接口
  isSend.value = true
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
//注册
const doReg = () => {
  formRegisterRef.value.validate(async (valid) => {
    if (!valid) {
      Message.success({
        content: '注册成功',
        duration: 1500,
      })
    } else {
      Message.error({
        content: '注册失败',
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
      console.log(mobile, password, isagree)
      console.log(valid)
      Message.success({
        content: '登录成功',
        duration: 1500,
      })
    } else {
      Message.error({
        content: '登录失败',
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
    <div class="box">
      <div class="leftArea">

      </div>
      <!-- 登录 -->
      <div class="rightArea" v-if="showLogin">
        <a-form ref="formLoginRef" :model="formLogin" :rules="rulesLogin" @submit="doLogin">
          <a-form-item field="mobile" label="账号">
            <a-input v-model="formLogin.mobile" placeholder="请输入手机号..."/>
          </a-form-item>
          <a-form-item field="password" label="密码">
            <a-input-password v-model="formLogin.password" placeholder="请输入密码"/>
          </a-form-item>
          <a-form-item field="isagree">
            <a-checkbox style="font-size: 12px" v-model="formLogin.isagree">
              我已阅读并同意
              <a-link href="doc/agreement">《关键帧平台用户服务协议》</a-link>
              和
              <a-link href="doc/privacy">《关键帧隐私政策》</a-link>
              。
            </a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-button html-type="submit">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
      <!-- 注册 -->
      <div class="rightArea" v-if="!showLogin">
        <a-form ref="formRegisterRef" :model="formRegister" :rules="rulesRegister" @submit="doReg">
          <a-form-item field="mobile" label="账号">
            <a-input v-model="formRegister.mobile" placeholder="请输入手机号...">
              <template #append>
                <a-button type="primary" :loading="SmsLoad" long @click="sendSms">{{ smsstr }}</a-button>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item field="sms" label="验证码">
            <a-input v-model="formRegister.sms" placeholder="请输入6位验证码...">
            </a-input>
          </a-form-item>
          <a-form-item field="password" label="密码">
            <a-input-password v-model="formRegister.password" placeholder="请输入密码"/>
          </a-form-item>
          <a-form-item field="retryPwd" label="确认密码">
            <a-input-password v-model="formRegister.retryPwd" placeholder="请再次输入密码"/>
          </a-form-item>
          <a-form-item field="isagree">
            <a-checkbox style="font-size: 12px" v-model="formRegister.isagree">
              我已阅读并同意
              <a-link style="padding: 0;margin: 0" href="doc/agreement">关键帧平台用户服务协议</a-link>
              和
              <a-link style="padding: 0;margin: 0" href="doc/privacy">关键帧隐私政策</a-link>
              。
            </a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-button html-type="submit">注册</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style scoped>

.login {
  background-color: white;
  border-radius: 4rem;
  position: absolute;
  left: calc(50vw - 31vw);
  top: calc(50vh - 18vh);
}

.box {
  box-shadow: 32px 18px 21px -3px rgba(0, 0, 0, 0.1);
  width: 62vw;
  height: 36vh;
  border-radius: 4rem;
  background-color: transparent;
  border-color: #f3f4f6;
}

.leftArea {
  position: absolute;
  left: 0;
  width: 3vw;
  height: 36vh;
  border-radius: 4rem;
  background-color: transparent;
}

.rightArea {
  position: absolute;
  right: 0;
  width: 40vw;
  height: 36vh;
  border-radius: 4rem;
  background-color: transparent;
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