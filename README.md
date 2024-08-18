# qrobot-web
### 准备工作
```
1、自行安装 需要先 npm i @microsoft/fetch-event-source 
（h5项目中使用了封装的fetchStream方法，未使用以上包）
2、rightAI.vue中 userId 、getToken需自行更换设置
3、在vue.config.ts中proxy中添加代理，并更换目标代理target
```

### 安装依赖
```
 cnpm i
```

### 项目启动
```
 npm run dev
```
### 项目部署
项目部署为 子路径部署方式

### 说明
#### 1、rightAI0文件 vue2实现 仅支持智能问答
#### 2、rightAI1文件 vue2实现 支持智能问答、文件上传总结md展示；其中md展示使用v-md-preview（@kangc/v-md-editor组件）
#### 3、rightAI文件 vue3实现 支持智能问答、文件上传总结md展示；其中md展示使用md-editor-v3组件，直接引入MdPreview会有流式效果。