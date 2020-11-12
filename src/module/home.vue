<style lang="less" rel="stylesheet/less">
@import "./home.less";
</style>

<template>
  <div id="map">
    <!-- <p></p>
    <p></p>
    <p class='myP'></p>
    <p></p> -->
  </div>
</template>

<script>
import knowledgeMapD3 from "../utils/knowledge-map-d3.js";

export default {
  props: {},
  data() {
    return {
      data: {
        nodes: [
          { id: "人物1", name: "人物1" },
          { id: "人物2", name: "人物2" },
          { id: "人物3", name: "人物3" },
        ],
        links: [
          { target: "人物1", source: "人物2" },
          { target: "人物1", source: "人物3" },
        ],
      },
    };
  },
  created() {},
  watch: {},
  components: {},
  mounted() {
    this.renderMap();
  },
  computed: {},
  methods: {
    renderMap() {
      knowledgeMapD3.renderChart("#map", this.data);
    },
  },
  beforeDestroy() {},
  destroyed() {},
};
</script>