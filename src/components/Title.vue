<template>
    <div class="appTitle">{{text}}</div>
</template>

<script>
export default {
    name: "Title",
    props: {
        text: String
    }
}
</script>

<style lang="less" scoped>
.appTitle{
    position: relative;
    padding-left: 10px;
    margin: 20px 0;
    font-size: 17px;
    &::after{
        content: " ";
        position: absolute;
        left: 0;
        width: 2px;
        height: 100%;
        background: #d33a31;
    }
}
</style>