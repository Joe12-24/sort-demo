<template>
  <div class="container">
    
    <div class="box">
      <h3>1. Element Plus (默认 sortable)</h3>
      <div class="tip error">
        <strong>问题暴露：</strong><br>
        10.00% 排在 2.50% 前面<br>
        (按字符串 "1" < "2" 排序)
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="产品" prop="name" width="100" />
        <el-table-column 
          label="收益率" 
          prop="rateDisplay" 
          sortable 
          align="center">
          <template #default="scope">
            <div class="rate-main">{{ scope.row.rateDisplay }}</div>
            <span class="rate-sub">{{ scope.row.subText }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="box">
      <h3>2. Element Plus (自定义 sort-method)</h3>
      <div class="tip success">
        <strong>完美解决：</strong><br>
        清洗数据，中文沉底<br>
        按数学数值排序
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="产品" prop="name" width="100" />
        <el-table-column 
          label="收益率" 
          prop="rateDisplay" 
          sortable 
          :sort-method="customSort" 
          align="center">
          <template #default="scope">
            <div class="rate-main">{{ scope.row.rateDisplay }}</div>
            <span class="rate-sub">{{ scope.row.subText }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="box">
      <h3>3. Layui (字段分离)</h3>
      <div class="tip info">
        <strong>Layui 方案：</strong><br>
        排序用 sortRate (数字)<br>
        显示用 templet (字符串)
      </div>
      <table id="layuiTable"></table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 【关键修复】直接引入 Layui 的 JS 文件，让它挂载到 window 全局
import 'layui/dist/layui.js'; 

// === 数据源 ===
const rawData = [
  { name: "天汇宝2号", rateDisplay: "1.00%", sortRate: 1.00, subText: "约定年化" },
  { name: "高收益测试", rateDisplay: "10.00%", sortRate: 10.00, subText: "模拟高息" }, 
  { name: "普通产品",   rateDisplay: "2.50%",  sortRate: 2.50, subText: "七日年化" },
  { name: "现金管家",   rateDisplay: "低风险", sortRate: -999, subText: "风险等级" }
];

const tableData = ref(rawData);

// === Element Plus 自定义排序逻辑 ===
const customSort = (a, b) => {
  const getVal = (val) => {
    if (val === '低风险') return -999;
    return parseFloat(val) || 0;
  };
  return getVal(a.rateDisplay) - getVal(b.rateDisplay);
};

// === Layui 初始化 ===
onMounted(() => {
  // 因为上面 import 'layui/dist/layui.js' 了，
  // 所以这里可以直接通过 window.layui 访问，或者直接 layui
  const layui = window.layui;

  layui.use(['table'], function(){
    const table = layui.table;
    
    table.render({
      elem: '#layuiTable',
      data: rawData,
      page: false, // 静态数据关闭分页，防止不显示
      cols: [[
        { field: 'name', title: '产品', width: 100 },
        { 
          field: 'sortRate', // 【重点】排序用这个字段
          title: '收益率', 
          sort: true, 
          align: 'center',
          // 【重点】显示用 template 里的 rateDisplay
          templet: (d) => {
             return `<div class="rate-main">${d.rateDisplay}</div>
                     <span class="rate-sub">${d.subText}</span>`;
          }
        }
      ]]
    });
  });
});
</script>

<style>
/* 布局样式 */
.container { display: flex; gap: 20px; padding: 20px; background: #f0f2f5; height: 100vh; overflow-x: auto;}
.box { flex: 0 0 350px; background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); }
h3 { margin-bottom: 15px; border-left: 4px solid #409EFF; padding-left: 10px; font-size: 16px;}

/* 业务文字样式 */
.rate-main { font-size: 18px; font-weight: bold; color: #f56c6c; }
.rate-sub { font-size: 12px; color: #999; display: block; margin-top: 2px;}

/* 提示框样式 */
.tip { padding: 10px; font-size: 12px; border-radius: 4px; margin-bottom: 15px; line-height: 1.5; border: 1px solid #ddd;}
.tip.error { background: #fff0f0; border-color: #ffcccc; color: #f56c6c; }
.tip.success { background: #f0f9eb; border-color: #e1f3d8; color: #67c23a; }
.tip.info { background: #e6f7ff; border-color: #91d5ff; color: #1890ff; }
</style>