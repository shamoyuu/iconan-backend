import Vue from "vue"
import App from "./App"
import lodash from "lodash"

import api from "./tools/api"
import router from "./tools/router"
import store from "./tools/store"
import errorHandle from "./tools/errorHandle"

import ElementUI from "element-ui"
import Toast from "@/plugins/ImageShow"

import "element-ui/lib/theme-chalk/index.css"
import "@/assets/theme/index.css"

import substr from "./filters/substr"


Vue.config.productionTip = false;

Vue.prototype.$lodash = lodash;

Vue.use(ElementUI, { size: "small" });
Vue.use(Toast);

Vue.use(api);
Vue.use(errorHandle);
Vue.use(substr);

Vue.prototype.instance = new Vue({
    el: "#app",
    router: router,
    store: store,
    components: { App },
    template: "<App/>"
});
