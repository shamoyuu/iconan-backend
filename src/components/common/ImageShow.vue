<template>
    <div class="image-show-dialog" v-show="show" @click="show = false">
        <div class="image-show-content">
            <img :src="img">
        </div>
    </div>
</template>

<script>
export default {
    props: {
        show: Boolean,
        img: String
    }
};
</script>

<style scoped>
.image-show-dialog {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000000;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    vertical-align: middle;
    cursor: zoom-out;
}
.image-show-content {
    height: 80vh;
    margin-top: 10vh;
}
.image-show-content img {
    height: 100%;
    border: 1px solid #000000;
    box-shadow: 0 0 10px 10px #fff;
    border-radius: 5px;
}
</style>
