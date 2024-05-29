import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')

const documentElement = window.document.documentElement
documentElement.style.fontSize = `${Math.min(documentElement.clientWidth,500)/10}px`

window.addEventListener('resize',()=>{
    documentElement.style.fontSize = `${Math.min(documentElement.clientWidth,500)/10}px`
})