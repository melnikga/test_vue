import './assets/main.css'
import './index.css'
import { createApp } from 'vue'
import App from './App.vue'
import MapboxGlobe from './MapboxGlobe.vue'

const app = createApp(App);
app.component('my-component', MapboxGlobe)
app.mount('#app');
