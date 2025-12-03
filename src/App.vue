<template>
  <div class="container">
    <div class="box">
      <h3>Element Plus (自定义排序)</h3>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="产品" prop="name" width="120" />
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
      <h3>Layui (字段分离)</h3>
      <table id="layuiTable"></table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import layui from 'layui'; // 引入 layui JS

// === 数据源 ===
const rawData = [
  { name: "天汇宝2号", rateDisplay: "1.00%", sortRate: 1.00, subText: "约定年化" },
  { name: "高收益测试", rateDisplay: "10.00%", sortRate: 10.00, subText: "模拟高息" }, 
  { name: "普通产品",   rateDisplay: "2.50%",  sortRate: 2.50, subText: "七日年化" },
  { name: "现金管家",   rateDisplay: "低风险", sortRate: -999, subText: "风险等级" }
];

const tableData = ref(rawData);

// === Element Plus 排序逻辑 ===
const customSort = (a, b) => {
  const getVal = (val) => {
    if (val === '低风险') return -999;
    return parseFloat(val) || 0;
  };
  return getVal(a.rateDisplay) - getVal(b.rateDisplay);
};

// === Layui 初始化逻辑 ===
onMounted(() => {
  layui.use(['table'], function(){
    const table = layui.table;
    table.render({
      elem: '#layuiTable',
      data: rawData,
      page: false, 
      cols: [[
        { field: 'name', title: '产品', width: 120 },
        { 
          field: 'sortRate', title: '收益率', sort: true, align: 'center',
          templet: (d) => {
             return `<div style="font-size:18px;color:#f56c6c;font-weight:bold">${d.rateDisplay}</div>
                     <div style="font-size:12px;color:#999">${d.subText}</div>`;
          }
        }
      ]]
    });
  });
});
</script>

<style>
.container { display: flex; gap: 20px; padding: 20px; background: #f0f2f5; height: 100vh;}
.box { flex: 1; background: #fff; padding: 20px; border-radius: 8px; }
h3 { margin-bottom: 20px; border-left: 4px solid #409EFF; padding-left: 10px; }
.rate-main { font-size: 18px; font-weight: bold; color: #f56c6c; }
.rate-sub { font-size: 12px; color: #999; display: block; }
</style>