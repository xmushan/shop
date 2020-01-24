<template>
  <div class="container">
    <div class="loginBox">
      <el-form :model="users">
        <el-form-item label="用户名">
          <el-input v-model="users.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
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
      }
    };
  },
  methods: {
    getLogin() {
      this.$http.post("login", this.users).then(res => {
        console.log(res);
        window.sessionStorage.setItem("token", res.data.data.token);
        this.$router.push('/home');
      });
    },
    resert(){
        this.users.username='';
        this.users.password="";
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
    transform: translate(-50%,-50%);
}
.el-form{
    margin-top: 110px;
}
.el-button{
    float: right;
    margin-right: 10px;
   
}
</style>