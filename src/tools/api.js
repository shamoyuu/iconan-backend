import axios from "@/tools/axios"

//let apiUrl = "http://meleong.duapp.com/";
let apiUrl = "http://localhost:18080/";

export default {
    install(Vue) {
        Vue.prototype.$api = {
            get(url, params) {
                return axios.get(apiUrl + url, {
                    params: params
                })
            },
            post(url, params) {
                return axios.post(apiUrl + url, params);
            },
            file(url, data) {
                return axios.post(apiUrl + url, data, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            }
        }
    }
}