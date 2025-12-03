<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" type="card" @tab-change="handleTabChange">
      <el-tab-pane label="Demo 1: Element Plus & Layui Comparison" name="demo1">
        <div v-show="activeTab === 'demo1'" class="demo-content">
          <Demo1 />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Demo 2: Sorting Methods Comparison" name="demo2">
        <div v-show="activeTab === 'demo2'" class="demo-content">
          <Demo2 />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Demo 3: Sorting Issues & Solutions" name="demo3">
        <div v-show="activeTab === 'demo3'" class="demo-content">
          <Demo3 />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

// Dynamically import the three demo components
const Demo1 = defineAsyncComponent(() => import('./App copy.vue'))
const Demo2 = defineAsyncComponent(() => import('./App-对比.vue'))
const Demo3 = defineAsyncComponent(() => import('./App2.vue'))

const activeTab = ref('demo1')

const handleTabChange = (tabName) => {
  activeTab.value = tabName
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  overflow: hidden;
}

.demo-content {
  height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 20px;
}

.el-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
}

:deep(.el-tab-pane) {
  height: 100%;
}
</style>