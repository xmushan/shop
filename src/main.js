import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import './assets/globol.css'
import TreeTable from 'vue-table-with-tree-grid'
//导入文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//注册 全局使用
Vue.use(VueQuillEditor)

Vue.component('tree-table', TreeTable)






axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/';
Vue.prototype.$http=axios;

axios.interceptors.request.use(config => {
  config.headers.Authorization =window.sessionStorage.getItem('token');
  return config
})


Vue.filter('dateForm',function(org){
  const dt=new Date();
  let year=dt.getFullYear();
  let month=(dt.getMonth()+1+'').padStart(2,0);
  let day=(dt.getDay()+'').padStart(2,0);
  let hour=(dt.getHours()+'').padStart(2,0);
  let minutes=(dt.getMinutes()+'').padStart(2,0);
  let seconds=(dt.getSeconds()+'').padStart(2,0);
  return `${year}/${month}/${day} ${hour}:${minutes}:${seconds}`
})


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
