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
          <el-button type="primary" @click="addVisible=true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 表单区域 -->
      <el-table :data="roleList" stripe style="width: 100%" border>
        <el-table-column label="#" type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i===0 ? 'bdtop' :'','vcenter']"
              v-for="(item,i) in scope.row.children"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  @close="removeThird(scope.row,item.id)"
                  closable
                  type="primary"
                >{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === '0' ? '' : 'bdtop','vcenter']"
                  v-for="(item2,i2) in item.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      @close="removeThird(scope.row,item2.id)"
                      closable
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      @close="removeThird(scope.row,item3.id)"
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180px"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="500px"></el-table-column>
        <el-table-column label="操作">
          <template class="btn" slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="remove(scope.row.id)">删除</el-button>
            <el-button size="mini" type="info" @click="att(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog title="添加对话框" :visible.sync="addVisible" width="40%">
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑对话框" :visible.sync="editVisible" width="40%">
      <el-form :model="editForm" :rules="addRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->

    <el-dialog title="提示" :visible.sync="attVisible" width="40%">
      <el-tree
        :default-checked-keys="defKeys"
        default-expand-all
        show-checkbox
        :data="attList"
        :props="defaultProps"
        node-key="id"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="attVisible = false">取 消</el-button>
        <el-button type="primary" @click="attConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      addVisible: false,
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      addRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ]
      },
      editForm: {},
      editVisible: false,
      attVisible: false,
      attList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      defKeys: [],
      roleId: ''
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    getRoles() {
      this.$http.get("roles").then(res => {
        this.roleList = res.data.data;
        console.log(this.roleList);
      });
    },
    addConfirm() {
      this.$refs.addFormRef.validate(res => {
        if (!res) return;
        this.$http.post("roles", this.addForm).then(res => {
          this.addVisible = false;
          this.getRoles();
          this.$message.success("创建成功");
        });
      });
    },
    edit(id) {
      this.$http.get(`roles/${id}`).then(res => {
        this.editForm = res.data.data;
      });
      this.editVisible = true;
    },
    editConfirm() {
      this.$refs.editFormRef.validate(res => {
        if (!res) return;
        this.$http
          .put(`roles/${this.editForm.roleId}`, {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          })
          .then(res => {
            this.editVisible = false;
            this.$message.success("修改成功");
            this.getRoles();
          });
      });
    },
    remove(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete(`roles/${id}`).then(res => {
            this.$message.success("删除成功");
            this.getRoles();
          });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    removeThird(role, rightsId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete(`roles/${role.id}/rights/${rightsId}`).then(res => {
            console.log(role.children, res.data);
            this.$message.success("删除权限成功");
            this.getRoles();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    att(role) {
      this.defKeys = [];
      this.getDefultKeys(role, this.defKeys);
      this.roleId=role.id
      this.attVisible = true;
      this.$http.get(`rights/tree`).then(res => {
        this.attList = res.data.data;
      });
    },
    //递归获取选中角色的权限
    getDefultKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getDefultKeys(item, arr);
      });
    },

    //点击为角色分配权限
    attConfirm() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      console.log(keys);
      const idStr = keys.join(",");
      this.$http
        .post(`roles/${this.roleId}/rights`, { rids: idStr })
        .then(res => {
          console.log(res);
          this.attVisible = false;
          this.getRoles();
        });
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>