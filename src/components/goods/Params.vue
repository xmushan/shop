<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-alert :closable="false" title="注意!!! 只允许为第三极分类设置相关参数" type="warning"></el-alert>
      <el-row>
        <el-col class="wordTip">
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectKeys"
            :options="paramsList"
            :props="cateListProps"
            @change="handleChange"
            clearable
          ></el-cascader>

          <!-- Tabs切换页 -->
          <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane label="动态参数" name="many">
              <el-button type="primary" :disabled="isavail" @click="add">添加参数</el-button>
              <el-table :data="manyList" stripe style="width: 100%">
                <el-table-column type="expand" label></el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="attr_name" label="分类名称"></el-table-column>
                <el-table-column prop="address" label="操作">
                  <template scope="scope">
                    <el-button type="primary" @click="edit(scope.row.attr_id)">编辑</el-button>
                    <el-button type="warning" @click="remove(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
              <el-button type="primary" :disabled="isavail" @click="add">添加属性</el-button>
              <el-table :data="onlyList" stripe style="width: 100%">
                <el-table-column type="expand" label></el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="attr_name" label="分类名称"></el-table-column>
                <el-table-column prop="address" label="操作">
                  <template scope="scope">
                    <el-button type="primary" @click="edit(scope.row.attr_id)">编辑</el-button>
                    <el-button type="warning">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑" :visible.sync="editdialogVisible" width="40%">
      <el-form :model="editForm" label-width="70px">
        <el-form-item label="参数名称">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加对话框 -->

    <el-dialog :title="'添加'+titleText" :visible.sync="addVisible" width="40%">
      <el-form :model="addForm" label-width="70px">
        <el-form-item label="参数名称">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paramsList: [],
      cateListProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectKeys: [],
      activeName: "many",
      manyList: [],
      onlyList: [],
      editdialogVisible: false,
      editForm: {},
      addForm: {
        attr_name: ""
      },
      addVisible: false
    };
  },
  created() {
    this.getParams();
  },
  methods: {
    getParams() {
      this.$http.get("categories/").then(res => {
        this.paramsList = res.data.data;
      });
    },
    handleChange() {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = [];
      }
      this.getcategories();
    },
    tabClick() {
      this.getcategories();
    },
    getcategories() {
      this.$http
        .get(`categories/${this.selectKeys[2]}/attributes`, {
          params: {
            sel: this.activeName
          }
        })
        .then(res => {
          if (this.activeName === "many") {
            this.manyList = res.data.data;
            console.log(this.manyList);
          } else {
            this.onlyList = res.data.data;
            console.log(this.onlyList);
          }
        });
    },
    edit(id) {
      this.editdialogVisible = true;
      this.$http.get(`categories/${this.cateId}/attributes/${id}`).then(res => {
        this.editForm = res.data.data;
      });
    },
    editConfirm() {
      this.$http
        .put(
          `categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        .then(res => {
          this.editdialogVisible = false;
          this.$message.success("修改成功");
        });
    },
    remove(id) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .delete(`categories/${this.cateId}/attributes/${id}`)
          .then(res => {
            this.getParams();
          });
      });
    },
    add() {
      this.addVisible = true;
      // this.$http
      //   .post(`categories/${this.cateId}/attributes`, {
      //     attr_name: this.addForm.attr_name,
      //     attr_sel: this.activeName
      //   })
      //   .then(res => {
      //     console.log(res);
      //   });
    },
    addConfirm() {
      this.$http
        .post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        .then(res => {
          this.getcategories();
          this.addVisible = false;
          this.$message.success("创建成功");
          this.addForm = {};
        });
    }
  },
  computed: {
    isavail() {
      if (this.selectKeys.length !== 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.selectKeys.length !== 3) {
        return null;
      } else return this.selectKeys[2];
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.wordTip {
  margin-top: 5px;
}
</style>