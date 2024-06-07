import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  server: {
    port: 5174, // 服务端口号
    open: true, // 服务启动时是否自动打开浏览器
    host: '0.0.0.0',
    proxy: {
      '/robotweb': {       //普通json
        target: 'http://127.0.0.1:7861',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/robotweb/, '')
      },
      '/robotwebchat': {     //sse流式专用
        target: 'http://127.0.0.1:7861',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/robotwebchat/, '')
      }
    }
  }
})
