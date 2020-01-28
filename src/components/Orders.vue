<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
        <el-button @click="getOrders" slot="append" icon="el-icon-search"></el-button>
      </el-input>

      <el-table :data="orderList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay == 0" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_send == '否'" type="danger">未发货</el-tag>
            <el-tag v-else type="success">已发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{scope.row.created_time | dateForm}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="showEdit"></el-button>
            <el-button
              type="primary"
              icon="el-icon-s-promotion"
              circle
              @click="message(scope.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="editVisible" width="40%">
      <el-form :model="addressForm" label-width="90px">
        <el-form-item label="省市区/县">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 订单信息对话框 -->
    <el-dialog title="订单信息" :visible.sync="Visible" width="40%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Visible = false">取 消</el-button>
        <el-button type="primary" @click="Visible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "../assets/citydata.js";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 8
      },
      orderList: [],
      editVisible: false,
      cityData,
      addressForm: {
        address1: [],
        address2: ""
      },
      Visible: false,
      progressInfo: [],
      total:0
    };
  },
  created() {
    this.getOrders();
  },
  methods: {
    getOrders() {
      this.$http
        .get(`orders`, {
          params: this.queryInfo
        })
        .then(res => {
          this.orderList = res.data.data.goods;
          this.total=res.data.data.total;
        });
    },
    showEdit() {
      this.editVisible = true;
    },
    message(id) {
      this.$http.get(`/kuaidi/1106975712662`).then(res => {
        this.progressInfo = res.data.data;
      });
      this.Visible = true;
    },
    handleCurrentChange(newnum){
        this.queryInfo.pagenum=newnum;
        this.getOrders();
    }
  }
};
</script>\

<style lang="less" scoped>
.input-with-select {
  width: 300px;
}
</style>