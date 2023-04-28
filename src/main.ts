import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// import vue-router
import router from './router/index.ts'


const app = createApp(App)
// use vue-router
app.use(router)
app.mount('#app')
