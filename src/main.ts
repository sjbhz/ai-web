import { createApp } from 'vue'
import './styles/style.css'
import App from './App.vue'
import Cookies from 'js-cookie'
import router from './router'
// 样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// import VueMarkdownEditor from '@kangc/v-md-editor';
// import '@kangc/v-md-editor/lib/style/base-editor.css';
 
// 这是预览时引用的
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// // 引入你所使用的主题 此处以 github 主题为例
import githubTheme from '@kangc/v-md-editor/lib/theme/github';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// VuePress主题以及样式（这里也可以选择github主题）
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'; 
import Prism from 'prismjs'; // Prism
// highlightjs
import hljs from 'highlight.js';
 //预览的主题
// VMdPreview.use(vuepressTheme, {
//   Prism
// });
 //预览的主题
VMdPreview.use(githubTheme, {
  Hljs: hljs,
});
//编辑器的主题
// VueMarkdownEditor.use(vuepressTheme, {
//   Prism,
// });

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn }) //element图标注册
Object.keys(Icons).forEach((key) => {  // 注册所有图标
  app.component(key, Icons[key])
})
app.use(router) 
app.use(VMdPreview);  
// app.use(VueMarkdownEditor);

//获取token,从cookie中获取
let token = Cookies.get('x-access-token') || null
if (token) {
  localStorage.setItem('token', token)
} else {
  token = localStorage.getItem('token')
}

//用户id
const params = new URLSearchParams(new URL(window.location as any).search)
let userId = params.get('userId')
if (userId) {
  localStorage.setItem('userId', userId)
} else {
  userId = localStorage.getItem('userId')
}

app.mount('#app')
