<template> 

  <div>
    <el-button type="primary" style="margin-bottom: 10px" @click="addRow">新增分类</el-button> 
    <!-- 新增分类的弹出框 -->
     <el-dialog v-model="dialogVisible" :title="id ? '修改分类' : '新增分类'" :before-close="handleBeforeClose">
      <CategoryEdit ref="categoryForm" :id="id" @success="editSuccess" />
     </el-dialog>
    <a-table
      ref="tableRef"
      :data-source="tableData"
      :columns="columns"
      :rowKey="record => record.id"
      :bordered="true"
      :expandable="{ defaultExpandAllRows: true }"
      style="margin-bottom: 20px"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          {{ record.name }}
        </template>
        <template v-if="column.key === 'level'">
          <span v-if="record.pid == 0">一级分类</span>
          <span v-else>二级分类</span>
        </template>
        <template v-if="column.key === 'id'">
          {{ record.id }}
        </template>
        <template v-if="column.key === 'picture'">
          <a-image
            v-if="record.picture != ''"
            :src="record.picture"
            :preview="false"
            style="display: flex; align-items: center; height: 60px"
          />
        </template>
        <template v-if="column.key === 'action'">
          <a-button type="warning" @click="editRow(record)">编辑</a-button>
          <a-button type="danger" @click="delRow(record)">删除</a-button>

        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue' 
import { getCategoryList } from '../../api'
import CategoryEdit from '../../components/CategoryEdit.vue'
const tableRef = ref(null);


// 你的数据
    
    const tableData = ref([]);
    const dialogVisible = ref(false) 
    const id = ref(0) 
    const columns = [
      { title: '分类名称', key: 'name', sorter: true },
      { title: '分类级别', key: 'level' },      
      { title: '分类编号', key: 'id' },
      { title: '分类图片', key: 'picture' },
      { title: '操作', key: 'action', fixed: 'right', width: 180 }
    ];
        
onMounted(() => { 
 loadCategoryList()
})
// 查询分类列表 
const loadCategoryList = async () => { 
 let data = await getCategoryList() 
 tableData.value = convertToTree(data) 
} 

// 将一维数组转换成树形结构的方法 
const convertToTree = data => { 
 const treeData = [] 
 const map = {} 
 // 遍历一维数组数据，建立节点映射表 
 for (const item of data) { 
 map[item.id] = { ...item, children: [] } 
 } 
 // 遍历映射表，将节点添加到父节点的 children 中 
 for (const item of data) { 
 const node = map[item.id] 
 if (item.pid === 0) { 
 treeData.push(node) 
 } else { 
 const parent = map[item.pid] 
 parent.children.push(node) 
 } 
 } 
 return treeData 
} 

 // 新增分类 
const addRow = () => { 
  id.value = 0 
 dialogVisible.value = true 
} 
 
// 修改分类 
const editRow = row => { 
  id.value = row.id 
 dialogVisible.value = true 

} 
// 关闭弹出框前 
const handleBeforeClose = () => {
  ElMessageBox.confirm('确定关闭对话框吗？', { 
 showClose: false, 
 closeOnClickModal: false, 
 confirmButtonText: '确定', 
 cancelButtonText: '取消', 
 }).then(() => { 
 dialogVisible.value = false 
 }).catch(() => {}) 
 
} 

// 删除分类 
const delRow = row => {
}

const editSuccess = () => { 
 loadCategoryList() 
 dialogVisible.value = false 
} 
</script>
