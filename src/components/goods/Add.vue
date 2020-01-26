<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-alert title="添加商品信息" type="info" :closable="false" center></el-alert>
        </el-col>
      </el-row>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="parseInt(activeIndex)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 切换面板 -->
      <el-form :rules="Rules" :model="addForm" label-width="100px" label-position="top">
        <el-tabs
          tab-position="left"
          style="height: 100%;"
          v-model="activeIndex"
          @tab-click="tabClick"
          :before-leave="beforeTab"
          
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProp"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane :disabled="Flag" label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyList" :key="item.attr_id">
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="name"
                  v-for="(name,index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane :disabled="Flag" label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane :disabled="Flag" label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="url"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane :disabled="Flag" label="商品内容" name="4">
            <!-- 文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce" class="editor"></quill-editor>
            <el-button type="primary" class="addBtn" @click="add">添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img :src="previewPath" alt class="prvImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: 0,
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",

        //商品分类的数组
        goods_cat: [],
        //图片的数组
        pics: [],
        //商品内容
        goods_introduce: "",
        attrs: []
      },
      cateList: [],
      cateProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      manyList: [],
      onlyList: [],
      url: "https://www.liulongbin.top:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPath: "",
      dialogVisible: false,
      Rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { min: 1, max: 5, message: "价格不合理", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          { min: 1, max: 5, message: "重量不合理", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          { min: 0, max: 5, message: "数量不合理", trigger: "blur" }
        ]
      },
      Flag:false
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    getCategories() {
      this.$http.get("categories").then(res => {
        this.cateList = res.data.data;
      });
    },
    handleChange() {
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    tabClick() {
      //获取动态参数列表
      if (this.activeIndex == 1) {
        this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: "many"
            }
          })
          .then(res => {
            //循环数组 以空格拆分 并重新覆盖
            res.data.data.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            });
            this.manyList = res.data.data;
          });
      }

      //获取静态属性列表
      if (this.activeIndex == 2) {
        this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: "only"
            }
          })
          .then(res => {
            this.onlyList = res.data.data;
          });
      }
    },
    handlePreview(file) {
      this.previewPath = file.response.data.url;

      this.dialogVisible = true;
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex(x => {
        x.pic === filePath;
      });
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },

    //监听图片上传成功的事件
    handleSuccess(response) {
      console.log(response);
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
      console.log(this.addForm.pics);
    },

    //添加商品
    add() {
      const form = _.cloneDeep(this.addForm);
      form.goods_cat = form.goods_cat.join(",");

      //处理动态参数
      this.manyList.forEach(item => {
        const newInfo = {
          attr_id: "item.attr_id",
          attr_value: 'item.attr_vals.join(" ")'
        };
        this.addForm.attrs.push(newInfo);
      });

      //处理静态属性
      this.onlyList.forEach(item => {
        const newInfo = {
          attr_id: "item.attr_id",
          attr_value: "item.attr_vals"
        };
        this.addForm.attrs.push(newInfo);
      });
      form.attrs = this.addForm.attrs;

      this.$http.post("goods", form).then(res => {
        this.$message.success("商品创建成功");
        this.$router.push("/goods");
      });
    },
    beforeTab(activeName, oldActiveName) {
        if (activeName == 1){
            return false
        }
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length !== 3) {
        return null;
      } else {
        return this.addForm.goods_cat[2];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 20px;
}
.el-tabs {
  margin-top: 20px;
}
.el-card {
  height: 100%;
}
.prvImg {
  width: 100%;
}
.editor {
  height: 300px !important;
}
.addBtn {
  margin-top: 100px;
}
</style>