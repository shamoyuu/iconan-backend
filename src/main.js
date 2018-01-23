import Vue from 'vue'
import App from './App'
import router from './tool/router/index'
import store from './tool/store/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: 'small' });

new Vue({
    el: '#app',
    router: router,
    store: store,
    components: { App },
    template: '<App/>'
});
