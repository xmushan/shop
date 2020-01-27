<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-check" v-if="scope.row.cat_deletede === false" style="color:lightgreen"></i>
          <i class="el-icon-close" v-else style="color:red"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.cat_level===0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.cat_level===1" type="success">二级</el-tag>
          <el-tag size="mini" else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="remove(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="querInfo.pagenum"
        :page-sizes="[3,5,10]"
        :page-size="querInfo.pagesize"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>

      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- opions 用来指定数据源 -->
            <el-cascader
              expand-trigger="hover"
              v-model="selectedOptions2"
              :options="parentCateList"
              @change="parentCateChanged"
              :props="cascaderProps"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑对话框 -->
      <el-dialog title="编辑" :visible.sync="editVisible" width="400px">
        <el-form :model="editForm" label-width="90px">
          <el-form-item label="分类名称">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { async } from "q";
export default {
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },

      //空数组，商品分类的数据列表 默认为空
      catelist: [],
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          //表示当前这一列模板的名称
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      addCateDialogVisible: false,
      //添加分类的表单数据对象
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      //添加分类的表单数据规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3-10个字符之间",
            trigger: "blur"
          }
        ]
      },
      selectedOptions2: [],
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      editVisible: false,
      editForm: {}
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }

      //把数据列表，赋值给 catelist
      this.catelist = res.data.result;

      //为总数据条数赋值
      this.total = res.data.total;
    },
    //监听 pagesize的改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听pagenum改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    //点击按钮，展示分类对话框
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });

      if (res.meta.status !== 200) {
        return this.$meesage.error("获取失败");
      }
      console.log(res.data);
      this.parentCateList = res.data;
    },
    //选择项发生变化触发这个函数
    parentCateChanged() {
      // console.log(this.selectedKeys);
      // //如果 selectedKeys.lenght >0 证明选中父级分类
      // //反之，说明没有选中任何父级分类
      // if (this.selectedKeys.length >0){
      //  this.addCateForm.cat_pid= this.selectedKeys[this.selectedKeys.length-1]
      // }
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );

        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.getCateList;
        this.addCateDialogVisible = false;
      });
    },
    showEditDialog(id) {
      this.editVisible = true;
      this.$http.get("categories/" + id).then(res => {
        this.editForm = res.data.data;
      });
    },
    editConfirm() {
      this.$http
        .put("categories/" + this.editForm.cat_id, {
          cat_name: this.editForm.cat_name
        })
        .then(res => {
          this.editVisible = false;
          this.getCateList();
        });
    },
    remove(id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete("categories/" + id).then(res => {
            this.getCateList();
            this.$message.success("删除成功");
          });
        })
        .catch(err => err);
    }
  }
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>