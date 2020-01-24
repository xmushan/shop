<template>
  <div class="container">
    <el-container>
      <el-header>
        <img src="../assets/01.png" alt />
        <el-button type="info" @click="loginOut">退出</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu background-color="#333744" text-color="#fff" unique-opened router>
              <!-- 一级菜单 -->
            <el-submenu :index="item.id +' '" v-for="item in list" :key="item.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{item2.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
            <router-view>
            </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
        list:[]
    }
  },
  created(){
      this.getList();
  },
  methods: {
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    getList(){
        this.$http.get('menus').then(res => {
            this.list=res.data.data;
            
        })
    }
  }
};
</script>


<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
}
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #373d41;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
}
.el-aside {
  background-color: #333744;
}
img {
  width: 60px;
  height: 60px;
  margin: 0;
}
p {
  text-align: center;
  margin-top: 0;
}
.el-menu{
    background-color:grey;
    border: 0px;
}
</style>