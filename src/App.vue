<template>
  <div class="container">
    
    <div class="box">
      <h3>1. Element Plus (默认 sortable)</h3>
      <div class="tip error">
        <strong>问题暴露：</strong><br>
        仅添加 <code>sortable</code>。<br>
        它是按字符串比对 ("1.16" vs "低风险")。<br>
        如果是"10.00"和"2.00"，它会把10排在2前面。
      </div>
      
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="产品" min-width="120">
          <template #default="scope">
            <div class="prod-name">{{ scope.row.prodName }}</div>
          </template>
        </el-table-column>

        <el-table-column 
          label="收益率/状态" 
          prop="rate" 
          sortable 
          align="center"
          min-width="140">
          <template #default="scope">
            <div class="rate-main" :class="{'is-text': isNaN(parseFloat(scope.row.rate))}">
              {{ scope.row.rate }}{{ scope.row.ratePostfix }}
            </div>
            <span class="rate-sub">{{ scope.row.rateLabel }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="box">
      <h3>2. Element Plus (+ sort-method)</h3>
      <div class="tip success">
        <strong>完美解决：</strong><br>
        使用 <code>sort-method</code>。<br>
        提取数值，中文转为 -9999。<br>
        回归数学大小排序。
      </div>
      
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="产品" min-width="120">
          <template #default="scope">
             <div class="prod-name">{{ scope.row.prodName }}</div>
             <div class="tags">
               <span v-if="scope.row.rate === '低风险'" class="tag low-risk">R1</span>
             </div>
          </template>
        </el-table-column>

        <el-table-column 
          label="收益率/状态" 
          prop="rate" 
          sortable 
          :sort-method="handleSort" 
          align="center"
          min-width="140">
          <template #default="scope">
            <div class="rate-main" :class="{'is-text': isNaN(parseFloat(scope.row.rate))}">
              {{ scope.row.rate }}{{ scope.row.ratePostfix }}
            </div>
            <span class="rate-sub">{{ scope.row.rateLabel }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="box">
      <h3>3. Layui (字段分离)</h3>
      <div class="tip info">
        <strong>Layui 策略：</strong><br>
        排序字段：<code>_sort_score</code> (数字)<br>
        显示模版：<code>templet</code> (HTML)
      </div>
      <table id="layuiTable"></table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import 'layui/dist/layui.js'; 
import 'layui/dist/css/layui.css';

// ==========================================
// 1. 数据源 (基于你提供的真实 JSON)
// ==========================================
const apiResponse = [
  {
    "itemCode": "lm003401",
    "prodCode": "XN0030",
    "prodName": "现金宝",
    "riskType": "1",
    "rateLabel": "七日年化收益率",
    "rate": "1.16",
    "ratePostfix": "%"
  },
  {
    "itemCode": "lm003401",
    "prodCode": "952100",
    "prodName": "国泰海通现金管家",
    "riskType": "1",
    "rateLabel": "风险等级",
    "rate": "低风险", 
    "ratePostfix": ""
  },
  {
    "itemCode": "lm003401",
    "prodCode": "XN0001",
    "prodName": "天汇宝1号",
    "riskType": "1",
    "rateLabel": "约定年化收益率",
    "rate": "1.00", 
    "ratePostfix": "%"
  },
  // 我故意加了一条 10.00% 的数据，为了演示默认排序的 BUG
  {
    "itemCode": "TEST_HIGH",
    "prodCode": "TEST001",
    "prodName": "高息测试产品(10%)",
    "riskType": "2",
    "rateLabel": "模拟高收益",
    "rate": "10.00", 
    "ratePostfix": "%"
  }
];

const tableData = ref(apiResponse);

// ==========================================
// 2. 核心算法：提取排序分值
// ==========================================
const getSortScore = (row) => {
  const val = row.rate;
  // A. 中文沉底策略
  if (['低风险', '中风险', '高风险'].includes(val)) {
    return -9999; 
  }
  // B. 转数字
  const num = parseFloat(val);
  return isNaN(num) ? -9999 : num;
};

// Element Plus 自定义排序
const handleSort = (a, b) => {
  return getSortScore(a) - getSortScore(b);
};

// ==========================================
// 3. Layui 初始化
// ==========================================
onMounted(() => {
  const layui = window.layui;
  
  // 预处理数据
  const layuiData = apiResponse.map(item => ({
    ...item,
    _sort_score: getSortScore(item)
  }));

  layui.use(['table'], function(){
    const table = layui.table;
    table.render({
      elem: '#layuiTable',
      data: layuiData,
      page: false, 
      cols: [[
        { field: 'prodName', title: '产品名称', minWidth: 120 },
        { 
          field: '_sort_score', // 排序用这个
          title: '收益率/状态', 
          sort: true, 
          align: 'center',
          minWidth: 140,
          templet: function(d) {
            // 显示用这个
            const isText = isNaN(parseFloat(d.rate));
            const colorClass = isText ? 'is-text' : '';
            return `
              <div class="rate-main ${colorClass}">
                ${d.rate}${d.ratePostfix || ''}
              </div>
              <span class="rate-sub">${d.rateLabel}</span>
            `;
          }
        }
      ]]
    });
  });
});
</script>

<style scoped>
.container { display: flex; gap: 20px; padding: 20px; background: #f5f7fa; min-height: 100vh; overflow-x: auto;}
.box { flex: 0 0 380px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05); }

h3 { margin-bottom: 15px; border-left: 4px solid #e60012; padding-left: 10px; font-size: 16px; color: #333; }
.tip { padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 12px; line-height: 1.6; border: 1px solid #ddd;}
.tip.error { background: #fff0f0; border-color: #ffcccc; color: #f56c6c; }
.tip.success { background: #f0f9eb; border-color: #e1f3d8; color: #67c23a; }
.tip.info { background: #e6f7ff; border-color: #91d5ff; color: #1890ff; }

.prod-name { font-size: 14px; font-weight: bold; color: #333; }
.rate-main { font-size: 18px; font-weight: bold; color: #f56c6c; }
.rate-main.is-text { font-size: 14px; color: #606266; font-weight: normal; }
.rate-sub { font-size: 12px; color: #909399; display: block; margin-top: 4px; }
.tags { margin-top: 4px; }
.tag { font-size: 10px; padding: 1px 4px; border-radius: 2px; border: 1px solid #ddd; color: #999; }
</style>