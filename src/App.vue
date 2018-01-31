<template>
    <el-container class="app">
        <el-header height="60px">Header</el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu background-color="transparent" :default-active="defaultRouter" @select="menuSelected">
                    <el-menu-item :key="index" :index="key" v-for="(val, key, index) in menus">
                        <i class="el-icon-tickets"></i>
                        <span slot="title">{{val.title}}</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
        <el-footer height="40px">爱柯南后台管理系统 - 静茹♂鱼</el-footer>
    </el-container>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            menus: {
                opus: {
                    index: "1",
                    title: "漫画管理",
                    router: "/opus"
                },
                chapter: {
                    index: "2",
                    title: "章节管理",
                    router: "/chapter/0"
                },
                picture: {
                    index: "3",
                    title: "图片管理",
                    router: "/picture/0"
                }
            },
            defaultRouter: this.$router.currentRoute.name
        };
    },
    methods: {
        menuSelected: function(routerName) {
            console.info(arguments);
            this.$router.push(this.menus[routerName].router);
        }
    },
    beforeCreate: function() {
        let that = this;
        that.$router.beforeEach(function(to, from, next) {
            that.defaultRouter = to.name;
            next();
        });
    }
};
</script>

<style>
@import "./assets/less/main.less";

.app {
    height: 100%;
}

.el-header,
.el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
}

.el-footer {
    line-height: 40px;
    color: #f13c74;
}

.el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
}

.el-main {
    position: relative;
    background-color: #ffffff;
    color: #333;
    text-align: center;
}
</style>
