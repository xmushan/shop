<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-input clearable placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
        <el-button @click="getGoods" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button class="btnAdd" type="primary" @click="add">添加商品</el-button>

      <el-table :data="goodsList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="品名" width="480"></el-table-column>
        <el-table-column prop="goods_price" label="价格"></el-table-column>
        <el-table-column prop="goods_weight" label="重量"></el-table-column>
        <el-table-column prop="add_time" label="添加时间">
          <template slot-scope="scope">{{scope.row.add_time | dateForm}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="remove(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import ParamsVue from "./Params.vue";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 8
      },
      total: 0,
      goodsList: []
    };
  },
  created() {
    this.getGoods();
  },
  methods: {
    getGoods() {
      this.$http
        .get("goods", {
          params: this.queryInfo
        })
        .then(res => {
          console.log(res);
          this.goodsList = res.data.data.goods;
          this.total = res.data.total;
        });
    },
    remove(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete(`goods/${id}`).then(res => {
            this.$message.success("删除成功");
            this.getGoods();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    add(){
        this.$router.push('/add');
    }
  }
};
</script>

<style lang="less" scoped>
.input-with-select {
  width: 300px;
}
.btnAdd {
  margin-left: 10px;
}
</style>