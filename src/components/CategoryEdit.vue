<template> 
 <el-form ref="formRef" :model="form" label-width="120px"> 
 <!-- 分类名称 --> 
 <el-form-item prop="name" label="分类名称" style="width: 92%"> 
 <el-input v-model="form.name" placeholder="请填写分类名称" /> 
 </el-form-item> 
 <!-- 操作按钮 --> 
 <el-form-item> 
 <el-button type="primary" @click="editSubmit" v-if="id">修改</el-button>
 <el-button type="primary" @click="addSubmit" v-else>新增</el-button> 
 <el-button @click="btnCancel">重置</el-button> 
 </el-form-item> 
 </el-form> 
</template>
<script setup> 
import { ref, reactive } from 'vue' 
const props = defineProps({ 
 id: { 
 type: Number 
 }, 
}) 
 
const form = reactive({ 
 id: props.id, 
 name: '', 
 pid: '', 
 picture: '' 
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