import { createApp } from 'vue'
import App from './App.vue'

// 引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入 Layui 样式 (JS部分我们在组件里直接用)
import 'layui/dist/css/layui.css'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')