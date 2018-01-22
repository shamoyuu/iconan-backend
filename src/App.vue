<template>
    <el-container class="app">
        <el-header height="60px">Header</el-header>
        <el-container>
            <el-aside width="200px">Aside</el-aside>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
        <el-footer height="40px">爱柯南后台系统 - 静茹♂鱼</el-footer>
    </el-container>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    @import "./assets/less/main.less";

    .app {
        height: 100%;
    }
    
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
    }

    .el-footer {
        line-height: 40px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
    }
</style>
