<style lang="less">
@import "./home.less";
</style>

<template>
    <div class="home-container">
        <!-- <button>防抖和节流</button> -->
    </div>
</template>

<script>
// // call方法
// Function.prototype.myCall = function (obj) {
//     obj = obj ? Object(obj) : window; //obj为null或undefined时，obj中的this指向window，同时考虑obj不为对象的情况
//     obj.fun = this; //在obj上创建一个fun方法，这里的this指向fn，fun内的this指向obj
//     let args = [...arguments].slice(1); //arguments代指函数接收的所有参数，[...arguments]将类数组转化为数组
//     let result = obj.fun(...args); //使用es6的扩展运算符传入参数序列

//     delete obj.fun; //fun方法执行完之后要删除
//     return result;
// };

// // apply方法
// Function.prototype.myApply = function (obj, arr) {
//     obj = obj ? Object(obj) : window;
//     obj.fun = this;
//     let result;
//     //判断arr存在与否，避免报错
//     if (!arr) {
//         result = obj.fun();
//     } else {
//         result = obj.fun(...arr);
//     };

//     delete obj.fun;
//     return result;
// };

// var obj = {
//     name: "谢谢谢谢谢~",
// };

// function fn(a, b, c) {
//     console.log(a + b + c + this.name);
// }

// fn.myCall(obj, "我的", "名字", "是");//我的名字是谢谢谢谢谢~
// fn.myApply(obj, ["我的", "名字", "是"]);//我的名字是谢谢谢谢谢~


// // 防抖
// function debounce(fn, wait) {
//     var timeout = null;
//     return function () {
//         if (timeout !== null) clearTimeout(timeout);
//         timeout = setTimeout(fn, wait);
//     };
// }
// // 处理函数
// function handle() {
//     console.log(Math.random());
// }
// // 点击事件
// window.addEventListener("click", debounce(handle, 1000));

// // 节流
// function throttle (func, delay) {
//     var timer = null;
//     return function() {
//         if (timer === null) {
//             timer = setTimeout(function() {
//                 func();
//                 timer = null;
//             }, delay);
//         }
//     }
// }
// function handle() {
//     console.log(Math.random());
// }
// window.addEventListener('click', throttle(handle, 1000));

export default {
    props: {},
    data() {
        return {};
    },
    created() {},
    watch: {},
    components: {},
    mounted() {},
    computed: {},
    methods: {},
    beforeDestroy() {},
    destroyed() {},
};
</script>