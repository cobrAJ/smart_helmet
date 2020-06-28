<template>
  <div class="left-bar">
    <el-tree
      :data="treeData"
      :props="defaultProps"
      :highlight-current="highlightStatus"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script>
export default {
  name: "LeftBar",
  props: {
    treeData: {
      type: Array
    }
  },
  data() {
    return {
      highlightStatus: true,
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },

  methods: {
    handleNodeClick(data) {
      // console.log(data);
      this.$emit("getSelectNode", data);
    }
  }
};
</script>
<style lang="less">
.left-bar {
  .el-tree {
    background: transparent;
    .el-tree-node {
      .el-tree-node__content {
        height: 40px;
        &:hover {
          background: rgba(30, 43, 62, 0.8);
        }
        .el-tree-node__label {
          color: #fff;
          font-size: 16px;
        }
      }
    }
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background: rgba(30, 43, 62, 1);
  }
  .el-tree-node:focus > .el-tree-node__content {
    background: rgba(30, 43, 62, 1);
  }
}
</style>
