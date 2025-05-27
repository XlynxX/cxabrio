import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Spinner from './components/Spinner.vue'

const app = createApp(App)

app.component('Spinner', Spinner)
app.use(router)
app.mount('#app')