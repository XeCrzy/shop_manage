<script setup> 
import { ref, onMounted } from 'vue' 
import { getGoodsList, delGoods } from '../../api' 
import GoodsEdit from '../../components/GoodsEdit.vue' 

const goodsList = ref([]) 
const page = ref(1) 
const pagesize = ref(10) 
const total = ref(0)
const id = ref() 
const dialogVisible = ref(false)
const goodsForm = ref() 
    const columns=   [
        { title: '商品编号', dataIndex: 'id', width: 100 },
        { title: '商品名称', dataIndex: 'name', width: 260 },
        { title: '商品价格', dataIndex: 'price', width: 100 },
        { title: '商品库存', dataIndex: 'stock', width: 100 },
        { title: '商品简介', dataIndex: 'description' },
        { title: '商品图片', dataIndex: 'picture', width: 120 },
        { title: '操作', dataIndex: 'operation', width: 200 },
      ]



onMounted(() => { 
 loadGoodsList() 
}) 
 
const loadGoodsList = async () => { 
 const params = { 
 page: page.value, 
 pagesize: pagesize.value 
 } 
 const data = await getGoodsList(params) 
 goodsList.value = data.list.map(item => { 
 item.description = removeTages(item.description) 
 return item 
 }) 
 total.value = data.total 
} 
// 去掉标签，仅显示文字 
const removeTages = str => { 
 return str.replace(/<[^>]+>/g, '') 
} 

// 新增商品 
const addRow = () => { 
  if (goodsForm.value) { 
 goodsForm.value.resetForm(0) 
 }
  id.value = 0 
 dialogVisible.value = true
} 
 
// 修改商品 
const editRow = row => {
  if (goodsForm.value) { 
 goodsForm.value.resetForm(row.id) 
 }
  id.value = row.id 
 dialogVisible.value = true 
 
} 
 
// 删除商品 
const delRow = row => { 
  ElMessageBox.confirm('确定要删除此商品吗？', { 
 closeOnClickModal: false, 
 confirmButtonText: '确定', 
 cancelButtonText: '取消', 
 }).then(async () => { 
 if (await delGoods({ id: row.id })) { 
 loadGoodsList() 
 } 
 }).catch(() => {})
} 
 
// 换页 
const handleCurrentChange = value => { 
 page.value = value 
 loadGoodsList() 
} 
// 编辑完成 
const editSuccess = () => { 
 loadGoodsList() 
 dialogVisible.value = false 
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
</script>

<template> 

  <div>
    <a-button type="primary" style="margin-bottom: 10px;" @click="addRow">新增商品</a-button>
    <!-- 新增商品的弹出框 -->
    <a-modal v-model:visible="dialogVisible" :title="id ? '修改商品' : '新增商品'"  @cancel="handleBeforeClose">
      <GoodsEdit ref="goodsForm" :id="id" @success="editSuccess" />
    </a-modal>
    <!-- 商品列表 -->
    <a-table :dataSource="goodsList" :columns="columns" :rowKey="record => record.id" :pagination="false" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'picture'">
          <a-image v-if="record.picture !== ''" :src="record.picture" :width="60" />
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <a-button type="warning" @click="editRow(record)">编辑</a-button>
          <a-button type="danger" @click="delRow(record)">删除</a-button>
        </template>
      </template>
    </a-table>
    <a-pagination
      v-model:current="page"
      :total="total"
      :pageSize="pagesize"
      @change="handleCurrentChange"
      style="margin-bottom: 50px;"
    />
  </div>
</template>




