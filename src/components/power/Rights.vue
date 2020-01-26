<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList" stripe style="width: 100%">
          <el-table-column label="#" type="index" width="180px"></el-table-column>
        <el-table-column prop="authName" label="权限名称" ></el-table-column>
        <el-table-column prop="path" label="路径" ></el-table-column>
        <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level==0" type="primary">一级</el-tag>
                <el-tag v-else-if="scope.row.level==1" type="warning">二级</el-tag>
                <el-tag v-else type="danger">三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
        rightsList:[]
    }
  },
  created(){
      this.getRights();
  },
  methods:{
      getRights(){
          this.$http.get(`rights/list`).then(res => {
              console.log(res);
              this.rightsList=res.data.data;
          })
      }
  }
};
</script>

<style lang="less" scoped>
</style>