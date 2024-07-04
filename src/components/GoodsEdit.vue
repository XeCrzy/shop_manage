<template> 
<el-form ref="formRef" :model="form" label-width="120px"> 
 <!-- 商品名称 --> 
 <el-form-item label="商品名称" prop="name" style="width: 92%">
  <el-input v-model="form.name" placeholder="请填写商品名称" /> 
 </el-form-item> 
 <!-- 商品分类 --> 
 <el-form-item label="分类名称" prop="category_id"> 
 </el-form-item> 
 <!-- 商品价格 --> 
 <el-form-item label="商品价格" prop="price" style="width: 92%"> 
 <el-input v-model="form.price" placeholder="请填写商品价格" /> 
 </el-form-item> 
 <!-- 商品图片 --> 
 <el-form-item label="商品图片" prop="picture"> 
 </el-form-item> 
 <!-- 商品相册 --> 
 <el-form-item label="图片相册" prop="album"> 
 </el-form-item> 
 <!-- 商品库存 --> 
 <el-form-item label="商品库存" prop="stock" style="width: 92%"> 
 <el-input v-model="form.stock" placeholder="请填写库存数量" /> 
 </el-form-item> 
 <!-- 商品规格 --> 
 <el-form-item label="商品规格" prop="spec" style="width: 92%"> 
 <el-input v-model="form.spec" placeholder="请填写商品规格" /> 
 </el-form-item> 
 <!-- 商品简介 --> 
 <el-form-item label="商品简介" prop="description" style="width: 92%" class="desc"> 
 </el-form-item> 
 <!-- 操作按钮 --> 
 <el-form-item> 
 <el-button type="primary" @click="editSubmit()" v-if="form.id">修改
</el-button> 
 <el-button type="primary" @click="addSubmit()" v-else>新增</el-button> 
 <el-button @click="btnCancel">重置</el-button> 
 </el-form-item> 
 </el-form> 
</template>

 
<script setup> 
import { reactive, ref} from 'vue' 
const props = defineProps({ 
 id: { 
 type: Number 
 } 
}) 
 
const emit = defineEmits(['success']) 
const form = reactive({ 
 id: props.id, 
 name: '', 
 category_id: '', 
 price: '', 
 picture: '', 
 album: [], 
 stock: '', 
 spec: '', 
 description: '' 
}) 
const formRef = ref() 
 
// 新增操作 
const addSubmit = () => { 
} 
 
// 修改操作 
const editSubmit = () => { 
} 
 
// 重置表单 
const btnCancel = () => { 
 formRef.value.resetFields() 
}
</script>