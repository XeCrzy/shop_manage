<template>
  <a-form ref="formRef" :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
    <!-- 分类名称 -->
    <a-form-item label="分类名称" name="name" style="width: 92%">
      <a-input v-model:value="form.name" placeholder="请填写分类名称" />
    </a-form-item>
    <!-- 操作按钮 -->
    <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
      <a-button type="primary" @click="editSubmit" v-if="id">修改</a-button>
      <a-button type="primary" @click="addSubmit" v-else>新增</a-button>
      <a-button @click="btnCancel">重置</a-button>
    </a-form-item>
  </a-form>
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