import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import 'ant-design-vue/dist/reset.css';
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import './router/permission'


const app = createApp(App);
const pinia = createPinia()


pinia.use(piniaPluginPersist)
app.use(pinia)
app.use(router)
app.use(Antd)
app.mount('#app')
