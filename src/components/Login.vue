<template>
  <div class="container">
    <div class="loginBox">
      <el-form :model="users" :rules="loginRules" ref="loginForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="users.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="users.password"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="getLogin">登录</el-button>
      <el-button type="primary" @click="resert">重置</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: {
        username: "admin",
        password: "123456"
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 9, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    getLogin() {
      this.$refs.loginForm.validate( res => {
        if (!res) return 
      })
      this.$http.post("login", this.users).then(res => {
        window.sessionStorage.setItem("token", res.data.data.token);
        this.$router.push("/home");
        this.$message.success('登录成功');
      });
    },
    resert() {

      this.$refs.loginForm.resetFields()

    }
  }
};
</script>


<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
}
.loginBox {
  width: 450px;
  height: 450px;
  background-color: aliceblue;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.el-form {
  margin-top: 110px;
}
.el-button {
  float: right;
  margin-right: 10px;
}
</style>