# ai-web
  web端 实现AI智能助手，h5端源码在https://github.com/sjbhz/ai-h5

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

### 预览效果
![images]('./public/ai_web_view.png')
