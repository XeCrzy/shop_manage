<template>
  <a-form ref="formRef" :model="form" label-width="120px">
    <!-- 分类名称 -->
    <a-form-item label="分类名称" style="width: 92%">
      <a-input v-model:value="form.name" placeholder="请填写分类名称" />
    </a-form-item>

    <a-form-item label="商品简介" style="width: 92%">
      <editor v-model:value="form.description" :init="tinymceInit" />
    </a-form-item>

    <a-form-item label="二级分类">
      <a-radio-group v-model:value="showMore" :default-value="1">
        <a-radio :value="true" :disabled="form.id !== 0 && !form.pid">是</a-radio>
        <a-radio :value="false" :disabled="form.id !== 0 && !form.pid">否</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item v-show="showMore" label="上级分类" :rules="[{ required: true, message: '请选择上级分类名称', trigger: 'change' }]">
      <a-select v-model:value="form.pid" placeholder="请选择上级分类名称">
        <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="分类图片" v-show="showMore">
      <input type="file" @change="handleFileChange" />
      <div class="ant-upload__text">图片文件大小不超过500KB</div>
    </a-form-item>
    <!-- 操作按钮 -->
    <a-form-item>
      <a-button type="primary" @click="id ? editSubmit() : addSubmit()">
        {{ id ? '修改' : '新增' }}
      </a-button>
      <a-button @click="btnCancel">重置</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCategory, getCategoryList, uploadPictureURL, addCategory, editCategory } from '../api'
import useToken from '../stores/token'
import notification from '../utils/notification'

const props = defineProps({
  id: {
    type: Number
  }
})

const emit = defineEmits(['success'])

const form = reactive({
  id: props.id,
  name: '',
  description: '',
  pid: '',
  picture: ''
})

const formRef = ref()
const categoryList = ref([])
const showMore = ref(false)
const fileList = ref([])
const { token } = useToken()
const headers = { jwt: token }
let selectedFile = null
const tinymceInit = {
  height: 300,
  plugins: 'link image code',
  toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
}
onMounted(() => {
  loadCategory()
})
const loadCategory = async() => {
  if (form.id) {
    const data = await getCategory({ id: form.id })
    Object.assign(form, data)
    form.picture = data.picture || ''

    if (data.picture) {
      const fileName = data.picture.substring(data.picture.lastIndexOf('/') + 1)
      if (fileName) {
        fileList.value = [{ name: fileName, url: data.picture }]
      }
    }
  }
  const list = await getCategoryList()
  categoryList.value = list.filter(item => item.pid == 0)
  showMore.value = form.pid != 0
}
const resetForm = id => {
  form.id = id
  btnCancel()
}
defineExpose({ resetForm })
const addSubmit = async () => {
  try {
    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('type', 'category_picture')
      const response = await fetch(uploadPictureURL(), {
        method: 'POST',
        headers,
        body: formData
      })
      const result = await response.json()
      if (result.errno !== 0) {
        notification({
          message: result.errmsg,
          type: 'error'
        })
        return
      }
      form.picture = result.data.savepath
      notification({
        message: '上传成功',
        type: 'success'
      })
    }
    const data = {
      name: form.name,
      description: form.description,
      picture: form.picture,
      pid: form.pid
    }
    if (await addCategory(data)) {
      emit('success')
    }
  } catch (error) {
    notification({
      message: '上传失败，请重试',
      type: 'error'
    })
  }
}
const editSubmit = async () => {
  try {
    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('type', 'category_picture')

      const response = await fetch(uploadPictureURL(), {
        method: 'POST',
        headers,
        body: formData
      })

      const result = await response.json()
      if (result.errno !== 0) {
        notification({
          message: result.errmsg,
          type: 'error'
        })
        return
      }

      form.picture = result.data.savepath
      notification({
        message: '上传成功',
        type: 'success'
      })
    }

    if (await editCategory(form)) {
      emit('success')
    }
  } catch (error) {
    notification({
      message: '上传失败，请重试',
      type: 'error'
    })
  }
}

const btnCancel = () => {
  formRef.value.resetFields()
  form.name = ''
  form.description = ''
  form.pid = ''
  form.picture = ''
  fileList.value = []
  selectedFile = null
  loadCategory()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 500 * 1024) {
    notification({
      message: '图片文件大小不能超过500KB',
      type: 'error'
    })
    return
  }

  selectedFile = file
}
</script>

<style scoped>
.upload-demo {
  text-align: left;
  width: 91%;
}
</style>
