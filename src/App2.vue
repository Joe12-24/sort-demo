<template>
  <div class="container">
    <h2>场景复现与对比</h2>

    <div class="box">
      <h3>1. Element 默认 sortable (字符串陷阱)</h3>
      <div class="desc error">
        <strong>现象：</strong> 10.00% 竟然比 2.00% 小？<br>
        <strong>原因：</strong> 它是按字符编码比对。字符 '1' < '2'。
      </div>
      <el-table :data="tableData" border>
        <el-table-column prop="name" label="产品" width="100"></el-table-column>
        <el-table-column prop="rate" label="收益率" sortable width="150">
          <template #default="scope">
             <span class="red-text">{{ scope.row.rate }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="box">
      <h3>2. 截图中的错误写法 (NaN 失效)</h3>
      <div class="desc error">
        <strong>现象：</strong> 点击排序无反应，或者随机乱序。<br>
        <strong>原因：</strong> <code>"1.00%" - "2.00%" = NaN</code>。<br>
        JS无法对含%或中文的字符串做减法，排序彻底崩溃。
      </div>
      <el-table :data="tableData" border>
        <el-table-column prop="name" label="产品" width="100"></el-table-column>
        <el-table-column 
          prop="rate" 
          label="收益率" 
          sortable 
          :sort-method="brokenSort"
          width="150">
          <template #default="scope">
             <span class="red-text">{{ scope.row.rate }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="box">
      <h3>3. 模拟 Layui 原理 (字段分离)</h3>
      <div class="desc success">
        <strong>现象：</strong> 排序完美。<br>
        <strong>原因：</strong> 排序用的是背后的数字，显示用的是字符串。
      </div>
      <el-table :data="tableData" border>
        <el-table-column prop="name" label="产品" width="100"></el-table-column>
        <el-table-column 
          prop="rawRate" 
          label="收益率" 
          sortable 
          width="150">
          <template #default="scope">
             <span class="red-text">{{ scope.row.rate }}</span>
             <div style="font-size:10px;color:#999">(实际排序值: {{scope.row.rawRate}})</div>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

// 模拟脏数据
const tableData = ref([
  { name: '产品A', rate: '1.00%', rawRate: 1.00 },
  { name: '产品B', rate: '10.00%', rawRate: 10.00 }, // 陷阱：字符串排序时 10 < 2
  { name: '产品C', rate: '2.50%', rawRate: 2.50 },
  { name: '产品D', rate: '低风险', rawRate: -999 }   // 陷阱：中文无法相减
]);

// 模拟你截图中的错误逻辑
const brokenSort = (a, b) => {
  // 截图逻辑：(a.rate) - (b.rate)
  // 真实情况： "1.00%" - "2.50%" = NaN (Not a Number)
  // 返回 NaN 会导致浏览器排序算法失效
  return a.rate - b.rate; 
};
</script>

<style scoped>
.container { display: flex; gap: 20px; padding: 20px; background: #f5f7fa;}
.box { flex: 1; background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
h3 { margin-bottom: 10px; font-size: 16px; border-left: 4px solid #409EFF; padding-left: 10px; }
.desc { padding: 8px; font-size: 12px; margin-bottom: 10px; border-radius: 4px; line-height: 1.5; }
.desc.error { background: #fef0f0; color: #f56c6c; }
.desc.success { background: #f0f9eb; color: #67c23a; }
.red-text { color: #f56c6c; font-weight: bold; font-size: 16px; }
</style>