<template>
  <div style="padding: 20px">
    <h2>1. Element Plus 默认排序（sortable）</h2>
    <el-table :data="data1" style="width: 400px" border>
      <el-table-column prop="value" label="默认排序 sortable" sortable></el-table-column>
    </el-table>

    <h2 style="margin-top:40px">2. Element Plus 自定义排序（sortMethod）</h2>
    <el-table :data="data2" style="width: 400px" border>
      <el-table-column
        prop="value"
        label="sortMethod 自定义排序"
        :sortable="true"
        :sort-method="customSort"
      ></el-table-column>
    </el-table>

    <h2 style="margin-top:40px">3. Layui 模拟排序（内部使用 Array.sort）</h2>
    <button @click="layuiAscSort" style="margin-right:10px">Layui 升序</button>
    <button @click="layuiDescSort">Layui 降序</button>
    <ul>
      <li v-for="item in data3" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// ✨ 测试数据（数字字符串 + 中文混合）
const testArr = ["100", "2", "张三", "李四", "20", "王五"]

// 1. Element Plus 默认 sortable（内部用 JS Array.sort）
const data1 = ref(testArr.map(v => ({ value: v })))

// 2. Element Plus sortMethod（你自己控制排序规则）
const data2 = ref(testArr.map(v => ({ value: v })))

const customSort = (a, b) => {
  const x = a.value
  const y = b.value

  const isNumX = /^\d+$/.test(x)
  const isNumY = /^\d+$/.test(y)

  // 数字优先，数字从大到小
  if (isNumX && isNumY) return Number(y) - Number(x)
  if (isNumX) return -1
  if (isNumY) return 1

  // 中文按拼音
  return x.localeCompare(y, 'zh')
}

// 3. Layui sort 模拟
const data3 = ref([...testArr])

const layuiAscSort = () => {
  data3.value = [...data3.value].sort((a, b) => (a > b ? 1 : -1))
}

const layuiDescSort = () => {
  data3.value = [...data3.value].sort((a, b) => (a < b ? 1 : -1))
}
</script>

<style>
body {
  background: #f5f5f5;
}
</style>
