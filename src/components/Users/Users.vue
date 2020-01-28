<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" class="Search" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
          <el-button class="btnAdd" type="primary" @click="addVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户表单区域 -->
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column prop="username" label="用户名" width="130"></el-table-column>
        <el-table-column prop="role_name" label="账户等级" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱地址"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="switchChange(scope.row.mg_state,scope.row.id)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row.id)" size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button
              @click="remove(scope.row.id)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
            <el-button @click="attribute(scope.row.id)" size="mini" type="warning" icon="el-icon-star-on"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        layout=" prev, pager, next"
        :total="50"
      ></el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addVisible" width="40%">
        <el-form :model="addForm" :rules="addrules" ref="addRuleForm" label-width="65px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑对话框 -->
      <el-dialog title="编辑信息" :visible.sync="editVisible" width="40%">
        <el-form :model="editForm" :rules="addrules" ref="editRuleForm" label-width="65px">
          <el-form-item label="用户名">
            <el-input disabled v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限 -->
      <el-dialog title="权限" :visible.sync="Visible" width="40%">
          <span>用户名：</span><el-input disabled v-model="name"></el-input>
        <el-select v-model="selectId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>

        <span slot="footer" class="dialog-footer">
          <el-button @click="Visible = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 8
      },
      userList: [],
      addVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addrules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 9, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        email: [{ required: false, message: "请输入邮箱", trigger: "blur" }],
        mobile: [{ required: false, message: "请输入电话", trigger: "blur" }]
      },
      editVisible: false,
      editForm: {},
      Visible: false,
      name:'',
      userId:"",
      roleList:[],
      selectId:[]
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.$http
        .get("users", {
          params: this.queryInfo
        })
        .then(res => {
          this.userList = res.data.data.users;
        });
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getUsers();
    },
    addConfirm() {
      this.$refs.addRuleForm.validate(res => {
        if (!res) return;
      });
      this.$http.post("/users", this.addForm).then(res => {
        this.addVisible = false;
        this.$message.success("创建成功");
      });
    },
    switchChange(s, id) {
      this.$http.put(`users/${id}/state/${s}`).then(res => {
        this.$message.success("修改状态成功");
      });
    },
    edit(id) {
      this.$http.get(`users/${id}`).then(res => {
        this.editForm = res.data.data;
      });
      this.editVisible = true;
    },
    editConfirm() {
      this.$http
        .put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        .then(res => {
          this.$message.success("编辑成功");
          this.editVisible = false;
          this.getUsers();
        });
    },
    remove(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.delete(`users/${id}`).then(res => {
          this.$message.success("删除成功");
          this.getUsers();
        });
      });
    },
    attribute(id) {
        this.userId=id;
        this.$http.get(`users/${id}`).then(res => {
            this.name=res.data.data.username;
            
        })
        this.$http.get(`roles`).then(res => {
            this.roleList=res.data.data;
        })
      this.Visible = true;

    },
    confirm(){
        this.$http.put(`users/${this.userId}/role`,{
            rid:this.selectId
        }).then(res => {
            this.$message.success('修改成功');
            this.validate=false;
        })
    }
  }
};
</script>

<style lang="less" scoped>
.Search {
  width: 300px;
}
.btnAdd {
  margin-left: 8px;
}
.el-select{
    margin-top: 30px;
}

</style>