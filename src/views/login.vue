<template>
  <div class="login">
    
    
    <!-- <el-image
      style="width: 100%;"
      :src="url"
      class="image"></el-image> -->

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">欢迎登陆
        
      </h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号" class="username">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:50%;margin-left:25%;margin-top:5%;height:60px;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading"><b>登 录</b></span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
   
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2019 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      // url:require('@/assets/image/123.png'),
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: rgb(9, 10, 72);
  background-image: url("../assets/image/123.png");
   background-repeat:no-repeat;
                background-size:cover;
                -moz-background-size:100% 100%;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #ffffff;
  font-size: 30px;
  width: 30%;
  padding-bottom: 3%;
  border-bottom: 2px solid aqua;
}

.login-form {
  position: relative;
  z-index: 1;
  left: 25%;
  border-radius: 10px;
  border: 2px solid rgb(0, 174, 255);
  box-shadow:0px 0px 20px rgb(5, 158, 245);
  background: #003cff48;
  
  width: 500px;
  height: 500px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 10%;
    input {
      height: 10%;
    }
  }
  .input-icon {
    height: 39px;
    width: 20px;
    margin-left: 1px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  // width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
   
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
}

 .login-form /deep/.el-input  input {
    height: 42px;
    font-size: 20px;
   border: 1px solid #0e108d00 !important;
   border-bottom: 2px solid rgba(255, 255, 255, 0.651) !important;
   background-color: rgba(255, 255, 255, 0) !important;
color: white;

}
/deep/.el-input--prefix .el-input__inner {
    padding-left: 40px;
}
// .login-form /deep/.el-input input:-webkit-autofill {
//     transition: background-color 5000s ease-in-out 0s;
    
// }

.el-button--primary {
    color: #fff;
    background-color: #0e108d00;
    border-radius: 50px;
    border: 3px solid #00ffea;
    font-size: 18px;
}


</style>